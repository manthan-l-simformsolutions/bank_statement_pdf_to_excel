import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Types ──────────────────────────────────────────────────────────────────────
interface RawItem {
    text: string;
    x: number;
    y: number;
}

// ── File upload helper ─────────────────────────────────────────────────────────
async function parseForm(req: NextRequest): Promise<{ filePath: string; fileName: string }> {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;
    if (!file) throw new Error("No PDF file provided");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tmpPath = path.join(os.tmpdir(), `upload_${Date.now()}_${file.name}`);
    await fs.writeFile(tmpPath, buffer);
    return { filePath: tmpPath, fileName: file.name };
}

// ── Extract all text items with X/Y positions using pdfjs-dist ────────────────
async function extractItems(buffer: Buffer): Promise<RawItem[][]> {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const uint8Array = new Uint8Array(buffer);

    const loadingTask = pdfjsLib.getDocument({
        data: uint8Array,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
    });
    const pdf = await loadingTask.promise;
    const pages: RawItem[][] = [];

    for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const tc = await page.getTextContent();
        const items: RawItem[] = [];

        for (const item of tc.items) {
            if ("str" in item && item.str.trim()) {
                const t = (item as { transform: number[] }).transform;
                items.push({ text: item.str.trim(), x: t[4], y: t[5] });
            }
        }
        pages.push(items);
    }
    return pages;
}

// ── Group items into horizontal rows by similar Y coordinate ──────────────────
function groupByRow(items: RawItem[], tolerance = 3): RawItem[][] {
    const sorted = [...items].sort((a, b) => b.y - a.y); // top to bottom
    const rows: RawItem[][] = [];

    for (const item of sorted) {
        const existing = rows.find((r) => Math.abs(r[0].y - item.y) <= tolerance);
        if (existing) {
            existing.push(item);
        } else {
            rows.push([item]);
        }
    }
    // Sort each row left to right
    for (const row of rows) row.sort((a, b) => a.x - b.x);
    return rows;
}

// ── Detect column X-boundaries from the header row ────────────────────────────
interface ColBounds {
    narrationEnd: number;   // x where Chq/Ref No column starts
    chqEnd: number;         // x where Value Dt starts
    valueDtEnd: number;     // x where Withdrawal starts
    withdrawalEnd: number;  // x where Deposit starts
    depositEnd: number;     // x where Closing Balance starts
}

function detectColumns(rows: RawItem[][]): ColBounds | null {
    for (const row of rows) {
        const texts = row.map((i) => i.text.toLowerCase());
        const narIdx = texts.findIndex((t) => t.includes("narration"));
        const chqIdx = texts.findIndex((t) => t.includes("chq") || t.includes("ref"));
        const valIdx = texts.findIndex((t) => t.includes("value") || t.includes("val"));
        const wdIdx = texts.findIndex((t) => t.includes("withdrawal") || t.includes("debit"));
        const dpIdx = texts.findIndex((t) => t.includes("deposit") || t.includes("credit"));
        const cbIdx = texts.findIndex((t) => t.includes("closing") || t.includes("balance"));

        if (narIdx >= 0 && chqIdx >= 0 && cbIdx >= 0) {
            return {
                narrationEnd: row[chqIdx]?.x ?? 999,
                chqEnd: row[valIdx]?.x ?? row[chqIdx].x + 80,
                valueDtEnd: row[wdIdx]?.x ?? row[chqIdx].x + 130,
                withdrawalEnd: row[dpIdx]?.x ?? row[chqIdx].x + 170,
                depositEnd: row[cbIdx]?.x ?? row[chqIdx].x + 210,
            };
        }
    }
    return null;
}

// ── Main parser ───────────────────────────────────────────────────────────────
function parseStatement(pages: RawItem[][]): Record<string, string>[] {
    const results: Record<string, string>[] = [];
    const dateRegex = /^\d{2}\/\d{2}\/\d{2,4}$/;
    const moneyRegex = /^\d{1,3}(?:,\d{3})*\.\d{2}$/;
    const toFloat = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
    let prevBalance: number | null = null;

    for (const pageItems of pages) {
        const rows = groupByRow(pageItems);
        const cols = detectColumns(rows);

        if (!cols) continue; // skip pages without a recognisable header

        for (const row of rows) {
            // Is this a transaction row? First item must look like DD/MM/YY
            const firstText = row[0]?.text ?? "";
            if (!dateRegex.test(firstText)) continue;

            const date = firstText;

            // Assign each item to a column by its X position
            const narItems: string[] = [];
            const chqItems: string[] = [];
            const valItems: string[] = [];
            const wdItems: string[] = [];
            const dpItems: string[] = [];
            const cbItems: string[] = [];

            for (const item of row.slice(1)) {
                const x = item.x;
                if (x < cols.narrationEnd) narItems.push(item.text);
                else if (x < cols.chqEnd) chqItems.push(item.text);
                else if (x < cols.valueDtEnd) valItems.push(item.text);
                else if (x < cols.withdrawalEnd) wdItems.push(item.text);
                else if (x < cols.depositEnd) dpItems.push(item.text);
                else cbItems.push(item.text);
            }

            // Narration: everything in the narration column for this row
            const narration = narItems.join(" ").trim();

            // Chq/Ref No: first long-digit item
            const chqRefNo = chqItems.find((s) => /^\d{8,}$/.test(s)) ?? chqItems.join(" ").trim();

            // Value date
            const valueDate = valItems.find((s) => dateRegex.test(s)) ?? "";

            // Monetary amounts
            const wdMoney = wdItems.filter((s) => moneyRegex.test(s));
            const dpMoney = dpItems.filter((s) => moneyRegex.test(s));
            const cbMoney = cbItems.filter((s) => moneyRegex.test(s));

            // Closing balance is the rightmost monetary value; if column detection
            // missed, fall back to using balance-diff heuristic on all amounts.
            let closingBalance = cbMoney[cbMoney.length - 1] ?? "";
            let withdrawalAmt = wdMoney[0] ?? "";
            let depositAmt = dpMoney[0] ?? "";

            // Fallback: if column detection wasn't precise enough, use balance diff
            if (!closingBalance && !withdrawalAmt && !depositAmt) {
                // collect all monetary amounts from entire row (excluding date/narration)
                const allMoney: string[] = [];
                for (const item of row.slice(1)) {
                    if (moneyRegex.test(item.text)) allMoney.push(item.text);
                }
                if (allMoney.length >= 2) {
                    closingBalance = allMoney[allMoney.length - 1];
                    const txn = allMoney[allMoney.length - 2];
                    if (prevBalance !== null) {
                        const diff = toFloat(closingBalance) - prevBalance;
                        if (diff >= 0) depositAmt = txn;
                        else withdrawalAmt = txn;
                    } else {
                        withdrawalAmt = txn;
                    }
                } else if (allMoney.length === 1) {
                    closingBalance = allMoney[0];
                }
            }

            if (closingBalance) prevBalance = toFloat(closingBalance);

            results.push({
                Date: date,
                Narration: narration,
                "Chq./Ref.No.": chqRefNo,
                "Value Dt": valueDate,
                "Withdrawal Amt.": withdrawalAmt,
                "Deposit Amt.": depositAmt,
                "Closing Balance": closingBalance,
            });
        }
    }

    return results;
}

// ── But pdfjs per-page rows don't span sub-lines across rows.               ───
// Some PDFs wrap narration across *multiple* Y-rows within the same logical   //
// transaction. We need to collect narration sub-rows into the right txn.      //
// Strategy: gather all "narration-column-only" rows that sit between two      //
// date rows and merge them into the preceding transaction.                    //
function mergeNarrationRows(
    pages: RawItem[][],
    cols: ColBounds | null
): RawItem[][] {
    if (!cols) return pages.map((p) => [...p]);
    // Not needed here – we handle it per-page inside parseStatement by using
    // groupByRow with tolerance. For multi-line narration cells, pdfjs emits
    // each visual line as a separate item BUT at a different Y. We need to
    // collect them all for the same transaction.
    return pages;
}

// ── Merge transactions split across page boundaries ────────────────────────────
// When a transaction falls on the last row of a page, its remaining data may
// appear as the FIRST row of the next page (same date + same Chq/Ref No).
// We detect this by checking consecutive rows for:
//   • Same date AND same Chq/Ref No  → definitely the same transaction
//   • Same date AND previous row has no Closing Balance → split row
function mergeSplitTransactions(
    rows: Record<string, string>[]
): Record<string, string>[] {
    if (rows.length === 0) return rows;

    const out: Record<string, string>[] = [{ ...rows[0] }];

    for (let i = 1; i < rows.length; i++) {
        const prev = out[out.length - 1];
        const curr = rows[i];

        const sameDate = prev.Date === curr.Date;
        const sameChq =
            prev["Chq./Ref.No."] &&
            curr["Chq./Ref.No."] &&
            prev["Chq./Ref.No."] === curr["Chq./Ref.No."];
        const prevNoBalance = !prev["Closing Balance"];

        if (sameDate && (sameChq || prevNoBalance)) {
            // Merge: concatenate narrations, prefer non-empty fields
            out[out.length - 1] = {
                Date: prev.Date,
                Narration: [prev.Narration, curr.Narration]
                    .filter(Boolean).join(" "),
                "Chq./Ref.No.": prev["Chq./Ref.No."] || curr["Chq./Ref.No."],
                "Value Dt": prev["Value Dt"] || curr["Value Dt"],
                "Withdrawal Amt.": prev["Withdrawal Amt."] || curr["Withdrawal Amt."],
                "Deposit Amt.": prev["Deposit Amt."] || curr["Deposit Amt."],
                "Closing Balance": prev["Closing Balance"] || curr["Closing Balance"],
            };
        } else {
            out.push({ ...curr });
        }
    }

    return out;
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    let tmpFilePath = "";

    try {
        const { filePath, fileName } = await parseForm(req);
        tmpFilePath = filePath;

        const fileBuffer = await fs.readFile(filePath);
        const pages = await extractItems(fileBuffer);

        // ── Build column-aware rows per page ─────────────────────────────────
        // We need to handle multi-row narration: gather ALL items for each
        // logical transaction (date row + sub-rows until next date row).
        const allResults: Record<string, string>[] = [];
        const dateRegex = /^\d{2}\/\d{2}\/\d{2,4}$/;
        const moneyRegex = /^\d{1,3}(?:,\d{3})*\.\d{2}$/;
        const toFloat = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
        let prevBalance: number | null = null;

        let lastCols: ColBounds | null = null; // persist across pages

        for (const pageItems of pages) {
            const rows = groupByRow(pageItems, 3);

            // Try to detect columns from this page's header row.
            // If this page has no header (continuation page), reuse lastCols.
            const pageCols = detectColumns(rows);
            const cols = pageCols ?? lastCols;
            if (!cols) continue; // no column info at all yet — skip
            if (pageCols) lastCols = pageCols; // update for future pages

            // Find the Y position of the header row so we can exclude anything above it
            // (account info, date-range header, page title, etc.)
            let headerRowIdx = -1;
            for (let i = 0; i < rows.length; i++) {
                const texts = rows[i].map((it) => it.text.toLowerCase());
                if (
                    texts.some((t) => t.includes("narration")) &&
                    texts.some((t) => t.includes("chq") || t.includes("ref"))
                ) {
                    headerRowIdx = i;
                    break;
                }
            }

            // Detect HDFC footer row (appears at bottom of every page).
            // Stop collecting transactions before this row.
            const FOOTER_MARKERS = [
                "hdfc bank limited",
                "earmarked for hold",
                "closing balance includes",
                "considered correct if no error",
            ];
            let footerRowIdx = rows.length; // default: no footer found
            for (let i = headerRowIdx + 1; i < rows.length; i++) {
                const combined = rows[i].map((it) => it.text.toLowerCase()).join(" ");
                if (FOOTER_MARKERS.some((m) => combined.includes(m))) {
                    footerRowIdx = i;
                    break;
                }
            }

            // Collect date-row indices — ONLY rows between header and footer
            const dateRowIdxs: number[] = [];
            for (let i = headerRowIdx + 1; i < footerRowIdx; i++) {
                if (dateRegex.test(rows[i][0]?.text ?? "")) {
                    dateRowIdxs.push(i);
                }
            }

            for (let d = 0; d < dateRowIdxs.length; d++) {
                const startRow = dateRowIdxs[d];
                // Cap endRow at footerRowIdx so last transaction never absorbs footer text
                const nextDateRow = d + 1 < dateRowIdxs.length ? dateRowIdxs[d + 1] : footerRowIdx;
                const endRow = Math.min(nextDateRow, footerRowIdx);

                // Merge all items from startRow..endRow-1 into one flat list
                const txnItems: RawItem[] = [];
                for (let r = startRow; r < endRow; r++) {
                    txnItems.push(...rows[r]);
                }
                if (txnItems.length === 0) continue;

                const date = txnItems[0].text;
                if (!dateRegex.test(date)) continue;

                // Assign items to columns
                const narItems: string[] = [];
                const chqItems: string[] = [];
                const valItems: string[] = [];
                const wdItems: string[] = [];
                const dpItems: string[] = [];
                const cbItems: string[] = [];

                for (const item of txnItems.slice(1)) {
                    const x = item.x;
                    if (x < cols.narrationEnd) narItems.push(item.text);
                    else if (x < cols.chqEnd) chqItems.push(item.text);
                    else if (x < cols.valueDtEnd) valItems.push(item.text);
                    else if (x < cols.withdrawalEnd) wdItems.push(item.text);
                    else if (x < cols.depositEnd) dpItems.push(item.text);
                    else cbItems.push(item.text);
                }

                const narration = narItems.join(" ").trim();
                const chqRefNo = chqItems.find((s) => /^\d{8,}$/.test(s)) ?? chqItems.join(" ").trim();
                const valueDate = valItems.find((s) => dateRegex.test(s)) ?? "";

                const wdMoney = wdItems.filter((s) => moneyRegex.test(s));
                const dpMoney = dpItems.filter((s) => moneyRegex.test(s));
                const cbMoney = cbItems.filter((s) => moneyRegex.test(s));

                let closingBalance = cbMoney[cbMoney.length - 1] ?? "";
                let withdrawalAmt = wdMoney[0] ?? "";
                let depositAmt = dpMoney[0] ?? "";

                // Fallback if column detection didn't capture amounts
                if (!closingBalance) {
                    const allMoney = txnItems
                        .slice(1)
                        .map((i) => i.text)
                        .filter((s) => moneyRegex.test(s));

                    if (allMoney.length >= 2) {
                        closingBalance = allMoney[allMoney.length - 1];
                        const txnAmt = allMoney[allMoney.length - 2];
                        if (prevBalance !== null) {
                            const diff = toFloat(closingBalance) - prevBalance;
                            if (diff >= 0) depositAmt = txnAmt;
                            else withdrawalAmt = txnAmt;
                        } else {
                            withdrawalAmt = txnAmt;
                        }
                    } else if (allMoney.length === 1) {
                        closingBalance = allMoney[0];
                    }
                } else if (!withdrawalAmt && !depositAmt) {
                    const allMoney = txnItems
                        .slice(1)
                        .map((i) => i.text)
                        .filter((s) => moneyRegex.test(s));
                    if (allMoney.length >= 2) {
                        const txnAmt = allMoney[allMoney.length - 2];
                        if (prevBalance !== null) {
                            const diff = toFloat(closingBalance) - prevBalance;
                            if (diff >= 0) depositAmt = txnAmt;
                            else withdrawalAmt = txnAmt;
                        } else {
                            withdrawalAmt = txnAmt;
                        }
                    }
                }

                if (closingBalance) prevBalance = toFloat(closingBalance);

                // ── Skip rows not from the actual transactions table ────────────
                // A valid transaction MUST have a closing balance. Without one,
                // the row is a stray date match (totals, page footer, summary, etc.)
                if (!closingBalance) continue;

                allResults.push({
                    Date: date,
                    Narration: narration,
                    "Chq./Ref.No.": chqRefNo,
                    "Value Dt": valueDate,
                    "Withdrawal Amt.": withdrawalAmt,
                    "Deposit Amt.": depositAmt,
                    "Closing Balance": closingBalance,
                });
            }
        }

        if (allResults.length === 0) {
            return NextResponse.json(
                { error: "No transactions found. Make sure this is a valid bank statement PDF (text-based, not scanned image)." },
                { status: 400 }
            );
        }

        // ── Build Excel ────────────────────────────────────────────────────────
        // First, merge any transactions that were split across page boundaries
        const mergedResults = mergeSplitTransactions(allResults);

        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(mergedResults);

        ws["!cols"] = [
            { wch: 12 },
            { wch: 55 },
            { wch: 20 },
            { wch: 12 },
            { wch: 16 },
            { wch: 14 },
            { wch: 16 },
        ];

        XLSX.utils.book_append_sheet(wb, ws, "Bank Statement");
        const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

        const outputName = fileName.replace(/\.pdf$/i, "") + "_converted.xlsx";
        return new NextResponse(excelBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${outputName}"`,
                "X-Transaction-Count": mergedResults.length.toString(),
            },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to convert PDF";
        console.error("Conversion error:", err);
        return NextResponse.json({ error: message }, { status: 500 });
    } finally {
        if (tmpFilePath) await fs.unlink(tmpFilePath).catch(() => { });
    }
}
