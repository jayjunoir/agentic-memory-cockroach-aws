// dashboard/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('analyst@company.com');
  const [password, setPassword] = useState('••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard'); // Route directly to overview dashboard
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-purple-600 selection:text-white">
      <div className="absolute top-6 left-8 flex items-center gap-3">
        <div className="p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-600/30">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-lg tracking-wider text-white">CarapaceAI</span>
      </div>

      <div className="bg-[#0B0E1F] border border-purple-950/80 p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 relative">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-white tracking-wide">Agent Portal</h2>
          <p className="text-xs text-slate-400">Sign in to your command center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#070913] border border-purple-950 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <a href="#" className="text-[11px] text-purple-400 hover:underline">Forgot?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#070913] border border-purple-950 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-purple-950/60"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-500">Or</span>
          <div className="flex-grow border-t border-purple-950/60"></div>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full py-3 bg-[#070913] hover:bg-slate-900 border border-purple-950 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
        >
          Sign in with Microsoft
        </button>

        <div className="pt-2 text-center">
          <p className="text-[10px] text-slate-500 font-mono tracking-wide flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" /> SOC 2 TYPE II • END-TO-END ENCRYPTED
          </p>
        </div>
      </div>
    </div>
  );
}