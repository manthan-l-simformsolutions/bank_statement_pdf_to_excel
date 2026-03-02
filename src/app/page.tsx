"use client";

import { useState, useCallback, useRef } from "react";
import UploadSection from "@/components/UploadSection";
import ResultSection from "@/components/ResultSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export type ConversionResult = {
  blob: Blob;
  filename: string;
  transactionCount: number;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const uploadRef = useRef<HTMLDivElement>(null);

  const handleFileSelected = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;

    setConverting(true);
    setError(null);
    setResult(null);
    setProgress(10);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 88));
    }, 400);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(95);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Conversion failed");
      }

      const blob = await response.blob();
      const transactionCount = parseInt(
        response.headers.get("X-Transaction-Count") || "0",
        10
      );
      const disposition = response.headers.get("Content-Disposition") || "";
      const filenameMatch = disposition.match(/filename="([^"]+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "bank_statement.xlsx";

      setProgress(100);
      setResult({ blob, filename, transactionCount });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      clearInterval(progressInterval);
      setConverting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [file]);

  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-animated">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute top-60 -left-40 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-cyan-500/8 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-light text-sm font-medium text-blue-300 mb-8 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Free · Secure · No Account Required
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Convert Bank Statement{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent glow-text">
              PDF to Excel
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your HDFC, SBI, ICICI, Axis, or any bank statement PDF and get a perfectly formatted Excel spreadsheet in seconds — ready for accounting or analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToUpload}
              className="btn-primary px-8 py-4 rounded-xl text-base pulse-glow"
            >
              ⚡ Convert Now — It&apos;s Free
            </button>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-xl text-base glass-card-light text-slate-300 hover:text-white transition-all duration-200 border border-white/10"
            >
              See How It Works
            </a>
          </div>

          {/* Supported banks */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <span className="text-slate-500 text-sm">Supports:</span>
            {["HDFC Bank", "SBI", "ICICI", "Axis Bank", "Kotak", "PNB", "BOB"].map((bank) => (
              <span
                key={bank}
                className="px-3 py-1 rounded-full text-xs font-medium glass-card-light text-slate-300 border border-white/10"
              >
                {bank}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section ref={uploadRef} className="px-4 pb-20" id="upload">
        <div className="max-w-3xl mx-auto">
          <UploadSection
            file={file}
            converting={converting}
            progress={progress}
            onFileSelected={handleFileSelected}
            onConvert={handleConvert}
            onReset={handleReset}
          />

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Conversion Error</p>
                <p className="text-sm text-red-400 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {result && <ResultSection result={result} onReset={handleReset} />}
        </div>
      </section>

      {/* Features */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorks />

      <Footer />
    </div>
  );
}
