import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BankPDF2Excel — Bank Statement PDF to Excel Converter",
  description: "Convert your HDFC, SBI, ICICI, Axis or any bank statement PDF into a clean Excel spreadsheet instantly. Free, secure, and fast.",
  keywords: "bank statement, PDF to Excel, HDFC statement converter, bank statement converter, PDF converter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
