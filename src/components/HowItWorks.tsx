export default function HowItWorks() {
    const steps = [
        {
            number: "1",
            title: "Upload Your PDF",
            description: "Drag and drop your bank statement PDF or click to browse. Works with all major Indian banks including HDFC, SBI, ICICI, and more.",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            ),
        },
        {
            number: "2",
            title: "Auto-Processing",
            description: "Our smart parser reads your PDF, identifies transaction rows, and extracts dates, narrations, amounts, and closing balances automatically.",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                </svg>
            ),
        },
        {
            number: "3",
            title: "Download Excel",
            description: "Get a clean, formatted Excel file (.xlsx) with all transactions in separate columns, ready to use for accounting, budgeting, or tax filing.",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            ),
        },
    ];

    const columns = [
        { name: "Date", example: "01/04/24", color: "text-blue-400" },
        { name: "Narration", example: "UPI-VODAFONE...", color: "text-purple-400" },
        { name: "Chq/Ref No.", example: "0000445871...", color: "text-yellow-400" },
        { name: "Value Dt", example: "01/04/24", color: "text-blue-400" },
        { name: "Withdrawal", example: "157.00", color: "text-red-400" },
        { name: "Deposit", example: "1,200.00", color: "text-green-400" },
        { name: "Balance", example: "72,722.82", color: "text-cyan-400" },
    ];

    return (
        <section id="how-it-works" className="px-4 py-20">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-purple-400 font-semibold text-sm tracking-wider uppercase">Step by Step</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        How It Works
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-base">
                        Three simple steps to turn your bank statement PDF into a usable Excel file.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connector line */}
                    <div className="hidden md:block absolute top-6 left-1/2 -translate-x-1/2 w-[calc(100%-8rem)] h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step) => (
                            <div key={step.number} className="relative flex flex-col items-start md:items-center text-left md:text-center gap-4">
                                <div className="flex items-center gap-4 md:flex-col md:gap-3">
                                    <div className="step-badge z-10">{step.number}</div>
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 md:hidden">
                                        {step.icon}
                                    </div>
                                </div>
                                <div className="hidden md:flex w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-blue-500/20 items-center justify-center text-blue-400">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Output Preview */}
                <div className="mt-16 glass-card rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            📊 Output Excel Preview
                        </h3>
                        <span className="text-xs text-slate-500">Sample from HDFC Bank Statement</span>
                    </div>

                    {/* Excel-like table */}
                    <div className="overflow-x-auto rounded-lg">
                        <table className="w-full text-xs border-collapse min-w-max">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                                    {columns.map((col) => (
                                        <th key={col.name} className="px-3 py-2.5 text-left text-slate-300 font-semibold border border-white/10 whitespace-nowrap">
                                            {col.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ["01/04/24", "UPI-VODAFONE IDEA GUJAR-VIINAPPGU3@YBL", "0000445871538015", "01/04/24", "157.00", "", "72,722.82"],
                                    ["02/04/24", "UPI-PITHADIYA HARDIK ANI-HARDIKPITHADIYA", "0000445964365481", "02/04/24", "", "1,200.00", "73,922.82"],
                                    ["02/04/24", "UPI-VODAFONE IDEA GUJAR-VIINAPPGU3@YBL", "0000445967648924", "02/04/24", "50.00", "", "73,872.82"],
                                    ["02/04/24", "UPI-DIGRA SANNY GULJARIB-SUNNYDIGRA6@OKA", "0000409362202880", "02/04/24", "1,000.00", "", "72,872.82"],
                                    ["02/04/24", "UPI-VISPARA NARENDRABHAI-787412728@YBL", "0000445931107806", "02/04/24", "", "1,200.00", "73,891.82"],
                                ].map((row, ri) => (
                                    <tr key={ri} className="table-row-hover border-b border-white/5">
                                        {row.map((cell, ci) => (
                                            <td key={ci} className={`px-3 py-2 border border-white/5 whitespace-nowrap ${columns[ci].color} font-mono`}>
                                                {cell || <span className="text-slate-600">—</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-slate-500 text-xs mt-3 text-center">This is exactly how your Excel output will look</p>
                </div>
            </div>
        </section>
    );
}
