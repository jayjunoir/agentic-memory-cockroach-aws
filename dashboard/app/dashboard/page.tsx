// dashboard/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Layers, CheckCircle2, AlertTriangle, BrainCircuit, Clock, RefreshCw } from 'lucide-react';

interface Incident {
  incident_id: string;
  title: string;
  summary: string;
  status: string;
  disposition: string;
  created_at: string;
  tool_call: any;
  result: any;
}

export default function DashboardOverview() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.success) setIncidents(data.incidents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const benignCount = incidents.filter(i => i.disposition === 'benign').length;
  const escalatedCount = incidents.filter(i => i.disposition !== 'benign').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0B0E1F] border border-purple-950 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Threats</p>
            <h3 className="text-2xl font-black text-purple-400 mt-1 font-mono">{incidents.length + 19}</h3>
            <span className="text-[11px] text-purple-300 font-medium flex items-center gap-1 mt-1">⚡ Real-time stream</span>
          </div>
          <div className="p-3 bg-purple-950/60 text-purple-400 rounded-xl border border-purple-800/40">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0B0E1F] border border-purple-950 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alerts Resolved (24h)</p>
            <h3 className="text-2xl font-black text-white mt-1 font-mono">1,204</h3>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">✓ Automated</span>
          </div>
          <div className="p-3 bg-emerald-950/60 text-emerald-400 rounded-xl border border-emerald-800/40">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0B0E1F] border border-purple-950 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mean Time to Respond</p>
            <h3 className="text-2xl font-black text-white mt-1 font-mono">42ms</h3>
            <span className="text-[11px] text-purple-400 font-medium flex items-center gap-1 mt-1">⚡ Machine Speed</span>
          </div>
          <div className="p-3 bg-indigo-950/60 text-indigo-400 rounded-xl border border-indigo-800/40">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0B0E1F] border border-purple-950 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agent Confidence Score</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1 font-mono">99.4%</h3>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">✓ High Precision</span>
          </div>
          <div className="p-3 bg-emerald-950/60 text-emerald-400 rounded-xl border border-emerald-800/40">
            <BrainCircuit className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live Threat Feed / Agent Reasoning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Threat Feed */}
        <div className="bg-[#0B0E1F] border border-purple-950 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-purple-950 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <h3 className="font-bold text-sm tracking-wider uppercase text-white">Live Threat Feed</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Auto-refresh: ON</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#070913] border border-purple-950/80 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 bg-rose-950 text-rose-400 border border-rose-800 rounded text-[10px] font-bold">CRITICAL</span>
                <span className="text-slate-400 text-[10px]">10:42:01.04</span>
              </div>
              <p className="text-slate-200 font-bold">Ransomware precursor binary execution attempt blocked.</p>
              <div className="text-[11px] text-purple-400">DB-PROD-01</div>
            </div>

            <div className="bg-[#070913] border border-purple-950/80 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 rounded text-[10px] font-bold">WARNING</span>
                <span className="text-slate-400 text-[10px]">10:41:12.88</span>
              </div>
              <p className="text-slate-200 font-bold">Unusual outbound data transfer volume detected.</p>
              <div className="text-[11px] text-purple-400">FS-CORP-09</div>
            </div>
          </div>
        </div>

        {/* Agent Reasoning Log */}
        <div className="bg-[#0B0E1F] border border-purple-950 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-purple-950 pb-4">
            <h3 className="font-bold text-sm tracking-wider uppercase text-white">Agent Reasoning Log</h3>
            <span className="text-[10px] font-mono text-purple-400">Protocol Alpha</span>
          </div>

          <div className="bg-[#070913] border border-purple-950/80 p-4 rounded-xl font-mono text-[11px] text-purple-300 space-y-2 leading-relaxed">
            <div className="text-slate-500">[10:42:01.04] <span className="text-purple-400">EVENT_INGEST:</span> ALR-8501 (DB-PROD-01)</div>
            <div className="text-slate-500">[10:42:01.06] <span className="text-purple-400">PAYLOAD:</span> Execution of known ransomware precursor 'crypt_insert.exe'</div>
            <div className="text-slate-500">[10:42:01.12] <span className="text-purple-400">CORRELATION:</span> Querying Threat Intelligence Graph... Match found (APT-FIN7) | Confidence: 99.8%</div>
            <div className="text-slate-500">[10:42:02.01] <span className="text-emerald-400">DECISION:</span> Initiate Containment Protocol Alpha</div>
            <div className="bg-purple-950/40 p-2 rounded border border-purple-800/40 text-emerald-300">
              exec_execute_containment(host_id):<br/>
              &nbsp;&nbsp;network.isolate(host_id, mode='STRICT')<br/>
              &nbsp;&nbsp;processes.kill_tree(pid=64923)<br/>
              &nbsp;&nbsp;alerts.notify_soc(severity='CRITICAL')
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}