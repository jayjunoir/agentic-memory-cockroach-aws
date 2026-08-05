// dashboard/app/page.tsx
'use client';

import Link from 'next/link';
import { ShieldAlert, Terminal, Activity, ArrowRight, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-purple-950/40 bg-[#070913]/80 backdrop-blur sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">CarapaceAI</span>
          <span className="text-[10px] bg-purple-950/80 text-purple-400 border border-purple-800/50 px-2.5 py-0.5 rounded-full font-mono">
            v2.4 Core Engine Now Live
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#platform" className="hover:text-purple-400 transition">Platform</a>
          <a href="#architecture" className="hover:text-purple-400 transition">Architecture</a>
          <a href="#live" className="hover:text-purple-400 transition">Live View</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition">
            Login
          </Link>
          <Link href="/login" className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30">
            Deploy Agent
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-purple-950/50 border border-purple-800/50 px-4 py-1.5 rounded-full text-xs text-purple-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Autonomous Triage Engine Operational
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-white max-w-4xl mx-auto">
          Autonomous SOC <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-500">Response Agent</span>
        </h1>

        <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          CarapaceAI continuously monitors, triages, and neutralizes security threats across your global infrastructure at machine speed.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/login" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-xl shadow-purple-600/20 flex items-center gap-2">
            Deploy for Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard" className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-purple-950 font-bold px-6 py-3.5 rounded-xl transition">
            View Demo
          </Link>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="border-y border-purple-950/40 bg-[#0A0D1D] py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-black text-purple-400 font-mono">42ms</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Mean Time to Respond</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-white font-mono">1.2B+</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Threats Neutralized</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-emerald-400 font-mono">0.01%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">False Positive Rate</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-white font-mono">99.999%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Platform Uptime</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-950/40 py-8 text-center text-xs text-slate-500">
        <p>© 2026 CarapaceAI Security Systems. Built by Ugoh Jessica Chinazaekpere. All rights reserved.</p>
      </footer>
    </div>
  );
}