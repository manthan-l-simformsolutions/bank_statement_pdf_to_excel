"use client";

import { useCallback } from "react";
import { ConversionResult } from "@/app/page";

interface ResultSectionProps {
    result: ConversionResult;
    onReset: () => void;
}

export default function ResultSection({ result, onReset }: ResultSectionProps) {
    const handleDownload = useCallback(() => {
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [result]);

    return (
        <div className="mt-4 glass-card rounded-2xl p-6 border border-green-500/20">
            {/* Success Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-white font-semibold">Conversion Successful!</h3>
                    <p className="text-slate-400 text-sm">Your Excel file is ready to download</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl glass-card-light border border-white/5 text-center">
                    <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {result.transactionCount}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">Transactions Found</div>
                </div>
                <div className="p-3 rounded-xl glass-card-light border border-white/5 text-center">
                    <div className="text-2xl font-bold text-green-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        .xlsx
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">Excel Format</div>
                </div>
            </div>

            {/* File Info */}
            <div className="flex items-center gap-3 p-3 rounded-xl glass-card-light border border-white/5 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{result.filename}</p>
                    <p className="text-slate-400 text-xs">{(result.blob.size / 1024).toFixed(1)} KB · Excel Spreadsheet</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    id="download-btn"
                    onClick={handleDownload}
                    className="btn-success flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Excel File
                </button>

                <button
                    onClick={onReset}
                    className="flex-1 sm:flex-none sm:w-auto py-3.5 px-5 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                >
                    Convert Another
                </button>
            </div>

            {/* Tips */}
            <div className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
                <p className="text-xs text-blue-300/80 leading-relaxed">
                    <span className="font-semibold text-blue-300">💡 Tip:</span> Open the file in Microsoft Excel or Google Sheets.
                    If amounts appear merged in one column, use <strong>Text to Columns</strong> feature to separate them.
                </p>
            </div>
        </div>
    );
}
