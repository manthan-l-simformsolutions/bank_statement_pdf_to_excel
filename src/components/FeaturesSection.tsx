export default function FeaturesSection() {
    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Instant Conversion",
            description: "Convert your bank statement PDF to a clean Excel spreadsheet in seconds, not minutes.",
            color: "from-yellow-500/20 to-orange-500/20",
            border: "border-yellow-500/20",
            text: "text-yellow-400",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "100% Secure",
            description: "Your PDF is processed in memory and never stored on our servers. Your financial data stays private.",
            color: "from-green-500/20 to-emerald-500/20",
            border: "border-green-500/20",
            text: "text-green-400",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            title: "Multi-Bank Support",
            description: "Works with HDFC, SBI, ICICI, Axis Bank, Kotak, PNB, and most Indian bank statement formats.",
            color: "from-blue-500/20 to-cyan-500/20",
            border: "border-blue-500/20",
            text: "text-blue-400",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: "Structured Data",
            description: "Dates, narrations, reference numbers, deposits, withdrawals, and balances — all in separate columns.",
            color: "from-purple-500/20 to-indigo-500/20",
            border: "border-purple-500/20",
            text: "text-purple-400",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Completely Free",
            description: "No subscriptions, no account required, no watermarks. Just upload and convert — always free.",
            color: "from-pink-500/20 to-rose-500/20",
            border: "border-pink-500/20",
            text: "text-pink-400",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: "Excel Compatible",
            description: "Output is a standard .xlsx file that opens directly in Microsoft Excel, Google Sheets, or LibreOffice.",
            color: "from-teal-500/20 to-cyan-500/20",
            border: "border-teal-500/20",
            text: "text-teal-400",
        },
    ];

    return (
        <section id="features" className="px-4 py-20">
            {/* Orbs */}
            <div className="relative max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-blue-400 font-semibold text-sm tracking-wider uppercase">Why BankPDF2Excel</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Built for Bank Statement Conversion
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-base">
                        Everything you need to transform messy bank statement PDFs into clean, usable Excel data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`feature-card glass-card rounded-xl p-5 border ${feature.border}`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} border ${feature.border} flex items-center justify-center mb-4 ${feature.text}`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-white font-semibold mb-2 text-base">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
