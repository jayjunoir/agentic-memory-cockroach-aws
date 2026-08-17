import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, Database, Zap, Lock, ArrowRight } from 'lucide-react';

export default function PlatformPage() {
  const capabilities = [
    {
      icon: <Cpu className="w-6 h-6 text-pink-400" />,
      title: "Autonomous Triage Engine",
      description: "Processes live telemetry data feeds, filtering false positives and ranking anomalies using multi-stage reasoning loops."
    },
    {
      icon: <Database className="w-6 h-6 text-purple-400" />,
      title: "Vector Memory Matrix",
      description: "Maintains high-speed persistent context with CockroachDB, mapping historical attack vectors against current intrusions."
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-400" />,
      title: "Machine-Speed Containment",
      description: "Instantly deploys network isolation scripts, dynamic firewall rules, and API token revocations within milliseconds."
    },
    {
      icon: <Lock className="w-6 h-6 text-blue-400" />,
      title: "Secure Enterprise Guardrails",
      description: "Ensures compliance and strict role-based access control backed by NextAuth.js session encryption."
    }
  ];

  return (
    <main className="min-h-screen bg-[#07080f] text-white p-8 md:p-16 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center space-x-2 text-pink-400 font-medium mb-3">
          <ShieldCheck className="w-5 h-5" />
          <span>Core Platform Overview</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-400 bg-clip-text text-transparent">
          Engineered for Next-Gen Threat Defense
        </h1>
        <p className="text-gray-400 text-lg mb-12 max-w-3xl leading-relaxed">
          CarapaceAI unifies automated incident response with advanced large-language reasoning to protect complex cloud-native architectures without human intervention latency.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {capabilities.map((item, index) => (
            <div 
              key={index}
              className="bg-white/[0.03] border border-white/10 p-8 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:border-pink-500/40 hover:bg-white/[0.05] hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/20 to-transparent border border-purple-500/30 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to secure your architecture?</h2>
            <p className="text-gray-400 text-sm">Deploy autonomous triage agents instantly across your infrastructure.</p>
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}