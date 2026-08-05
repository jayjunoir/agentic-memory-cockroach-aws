// dashboard/app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Bell, 
  Clock, 
  Bot, 
  FileText, 
  Settings, 
  Lock, 
  RefreshCw,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Alerts', href: '/dashboard/alerts', icon: Bell, badge: '3' },
    { name: 'Threat Timeline', href: '/dashboard/timeline', icon: Clock },
    { name: 'Agents', href: '/dashboard/agents', icon: Bot },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans flex flex-col selection:bg-purple-600 selection:text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-950/80 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`w-64 border-r border-purple-950/60 bg-[#0B0E1F] flex flex-col justify-between fixed md:static inset-y-0 left-0 z-50 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div>
            <div className="p-6 flex items-center justify-between border-b border-purple-950/60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-600/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-base tracking-wider text-white">CarapaceAI</span>
              </div>
              <button className="md:hidden text-slate-400" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 block">Command Center</span>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive 
                          ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30 shadow-inner' 
                          : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom Lock Terminal */}
          <div className="p-4 m-4 bg-[#070913] border border-purple-950 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-mono text-[11px]">Lock Terminal</span>
            </div>
            <Link href="/login" className="block text-center w-full py-2 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/60 rounded-xl text-xs font-semibold transition">
              Sign Out
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <header className="h-16 border-b border-purple-950/60 bg-[#0B0E1F]/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button className="md:hidden text-slate-400" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Agent Active</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-[#070913] border border-purple-950 px-3 py-1.5 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-purple-600/30 text-purple-300 font-bold text-xs flex items-center justify-center">
                  AT
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-200">A. Turing</div>
                  <div className="text-[10px] text-slate-400">L3 Analyst</div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Render */}
          <main className="p-6 md:p-8 space-y-6 flex-1">
            {children}
          </main>

          {/* Copyright Footer */}
          <footer className="py-6 px-8 border-t border-purple-950/40 text-center text-xs text-slate-500 bg-[#070913]">
            <p>© 2026 CarapaceAI. Built with enterprise precision by Ugoh Jessica Chinazaekpere.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}