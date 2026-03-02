"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        BankPDF<span className="text-blue-400">2Excel</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <a href="#upload" className="text-slate-400 hover:text-white text-sm transition-colors">Convert</a>
                    <a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</a>
                    <a href="#how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors">How It Works</a>
                    <a
                        href="#upload"
                        className="btn-primary px-4 py-2 rounded-lg text-sm"
                    >
                        Start Converting
                    </a>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-slate-400 hover:text-white"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden glass-card border-t border-white/5 px-4 py-4 flex flex-col gap-3">
                    <a href="#upload" className="text-slate-300 hover:text-white py-2 text-sm" onClick={() => setMenuOpen(false)}>Convert</a>
                    <a href="#features" className="text-slate-300 hover:text-white py-2 text-sm" onClick={() => setMenuOpen(false)}>Features</a>
                    <a href="#how-it-works" className="text-slate-300 hover:text-white py-2 text-sm" onClick={() => setMenuOpen(false)}>How It Works</a>
                    <a href="#upload" className="btn-primary px-4 py-2 rounded-lg text-sm text-center" onClick={() => setMenuOpen(false)}>Start Converting</a>
                </div>
            )}
        </nav>
    );
}
