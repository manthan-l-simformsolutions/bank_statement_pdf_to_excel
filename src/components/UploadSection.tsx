"use client";

import { useCallback, useState } from "react";

interface UploadSectionProps {
    file: File | null;
    converting: boolean;
    progress: number;
    onFileSelected: (file: File) => void;
    onConvert: () => void;
    onReset: () => void;
}

export default function UploadSection({
    file,
    converting,
    progress,
    onFileSelected,
    onConvert,
    onReset,
}: UploadSectionProps) {
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragOver(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped && dropped.type === "application/pdf") {
                onFileSelected(dropped);
            }
        },
        [onFileSelected]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selected = e.target.files?.[0];
            if (selected) onFileSelected(selected);
        },
        [onFileSelected]
    );

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    return (
        <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Upload Your Bank Statement
                </h2>
                <p className="text-slate-400 text-sm">
                    Upload a PDF bank statement to extract and convert to Excel
                </p>
            </div>

            {!file ? (
                /* Drop Zone */
                <div
                    id="drop-zone"
                    className={`drop-zone rounded-xl p-10 md:p-14 text-center ${dragOver ? "drag-over" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("pdf-input")?.click()}
                >
                    <div className="float-animation inline-block mb-5">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mx-auto">
                            <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-white font-semibold text-lg mb-1">
                        Drop your PDF here
                    </p>
                    <p className="text-slate-500 text-sm mb-5">
                        or click to browse files
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        PDF files only · Max 50MB
                    </div>

                    <input
                        id="pdf-input"
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={handleFileInput}
                    />
                </div>
            ) : (
                /* File Preview + Convert */
                <div className="space-y-4">
                    {/* File Info */}
                    <div className="flex items-center gap-4 p-4 rounded-xl glass-card-light border border-white/10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{file.name}</p>
                            <p className="text-slate-400 text-sm">{formatSize(file.size)} · PDF</p>
                        </div>
                        {!converting && (
                            <button
                                onClick={onReset}
                                className="text-slate-500 hover:text-white transition-colors p-1"
                                aria-label="Remove file"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {converting && progress > 0 && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Processing your bank statement...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className="h-full rounded-full progress-bar transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Extracting transaction data from PDF...
                            </div>
                        </div>
                    )}

                    {/* Convert Button */}
                    <button
                        id="convert-btn"
                        onClick={onConvert}
                        disabled={converting}
                        className="btn-primary w-full py-4 rounded-xl text-base flex items-center justify-center gap-3"
                    >
                        {converting ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Converting...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Convert to Excel
                            </>
                        )}
                    </button>

                    {!converting && (
                        <button
                            onClick={() => document.getElementById("pdf-input-replace")?.click()}
                            className="w-full py-2.5 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                        >
                            Change File
                        </button>
                    )}
                    <input
                        id="pdf-input-replace"
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={handleFileInput}
                    />
                </div>
            )}

            {/* Security note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your file is processed locally and never stored on our servers
            </div>
        </div>
    );
}
