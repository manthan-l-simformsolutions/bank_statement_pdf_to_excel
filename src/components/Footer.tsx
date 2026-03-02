import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-white/5 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            BankPDF<span className="text-blue-400">2Excel</span>
                        </span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <a href="#upload" className="hover:text-white transition-colors">Convert</a>
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                    </div>

                    {/* Copyright */}
                    <p className="text-slate-600 text-sm">
                        © {year} BankPDF2Excel. All rights reserved.
                    </p>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 p-4 rounded-xl glass-card-light border border-white/5 text-center">
                    <p className="text-slate-500 text-xs leading-relaxed">
                        <strong className="text-slate-400">Disclaimer:</strong> This tool is not affiliated with any bank.
                        All processing occurs on the server and files are immediately deleted after conversion.
                        We do not store or share your financial data.
                    </p>
                </div>
            </div>
        </footer>
    );
}
