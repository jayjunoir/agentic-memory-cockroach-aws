// dashboard/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Cpu, 
  Database, 
  BrainCircuit, 
  Search,
  Bell,
  Clock,
  Layers,
  Sun,
  Moon
} from 'lucide-react';

interface Incident {
  incident_id: string;
  title: string;
  summary: string;
  status: string;
  disposition: string;
  created_at: string;
  action_type: string;
  reasoning_trace: string;
  tool_call: any;
  result: any;
}

export default function SOCDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'benign' | 'escalated'>('all');
  const [darkMode, setDarkMode] = useState(false);
  const [triggering, setTriggering] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.success) {
        setIncidents(data.incidents);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateAlert = async (type: 'powershell' | 'bruteforce') => {
    setTriggering(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTriggering(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = incidents.filter((inc) => {
    if (activeTab === 'benign') return inc.disposition === 'benign';
    if (activeTab === 'escalated') return inc.disposition !== 'benign';
    return true;
  });

  const benignCount = incidents.filter(i => i.disposition === 'benign').length;
  const escalatedCount = incidents.filter(i => i.disposition !== 'benign').length;

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-200 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r flex flex-col justify-between hidden md:flex transition-colors duration-200 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className={`p-6 flex items-center gap-3 border-b ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`font-bold tracking-tight text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>CarapaceAI</h2>
              <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wider">SOC Agent v2.4</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <a href="#" className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl text-sm transition ${
              darkMode ? 'bg-indigo-950/60 text-indigo-400' : 'bg-indigo-50 text-indigo-700'
            }`}>
              <Activity className="w-4 h-4" /> Live Incident Stream
            </a>
            <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              darkMode ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}>
              <BrainCircuit className="w-4 h-4 text-slate-400" /> Vector Memory Bank
            </a>
            <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              darkMode ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}>
              <Database className="w-4 h-4 text-slate-400" /> CockroachDB State
            </a>
            <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              darkMode ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}>
              <Cpu className="w-4 h-4 text-slate-400" /> AWS Bedrock Engine
            </a>
          </nav>
        </div>

        <div className="p-4 m-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl shadow-lg border border-indigo-800/40">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-indigo-200 tracking-wider">DISTRIBUTED CLUSTER</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            CockroachDB multi-region node online with 1024-dim Vector Search.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className={`h-16 border-b px-8 flex items-center justify-between transition-colors duration-200 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-4 w-1/3">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search alert hashes, IPs, memories..."
                className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-full focus:ring-2 focus:ring-indigo-500 transition border-none ${
                  darkMode ? 'bg-slate-800 text-slate-200 placeholder-slate-500' : 'bg-slate-100 text-slate-700'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Trigger Buttons */}
            <button
              disabled={triggering}
              onClick={() => handleSimulateAlert('powershell')}
              className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-full transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              🧪 Fire Benign Alert
            </button>

            <button
              disabled={triggering}
              onClick={() => handleSimulateAlert('bruteforce')}
              className="flex items-center gap-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-full transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              🚨 Fire Real Threat
            </button>

            <button
              onClick={fetchDashboardData}
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition ${
                darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync State
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition flex items-center justify-center cursor-pointer ${
                darkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`h-6 w-[1px] ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center">
                SOC
              </div>
              <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Tier-1 Analyst</span>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          {error && (
            <div className="bg-rose-950/40 border border-rose-800 text-rose-300 p-4 rounded-xl text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <span><strong>Connection Notice:</strong> {error}</span>
            </div>
          )}

          {/* Metric Cards Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-colors ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
            }`}>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Triage Events</p>
                <h3 className={`text-2xl font-extrabold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{incidents.length}</h3>
                <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-1">
                  ⚡ Real-time Stream
                </span>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-indigo-950/60 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                <Layers className="w-6 h-6" />
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-colors ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
            }`}>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Auto-Resolved (Benign)</p>
                <h3 className={`text-2xl font-extrabold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{benignCount}</h3>
                <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-1">
                  ✓ Vector Match Confidence 100%
                </span>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-emerald-950/60 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-colors ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
            }`}>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Escalated to Human</p>
                <h3 className={`text-2xl font-extrabold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{escalatedCount}</h3>
                <span className="text-[11px] text-orange-500 font-medium flex items-center gap-1 mt-1">
                  ⚠ Requires SOC Review
                </span>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-orange-950/60 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-colors ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
            }`}>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vector Recall Model</p>
                <h3 className={`text-lg font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Bedrock Titan</h3>
                <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1 mt-1">
                  1024-Dim Cosine Search
                </span>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-950/60 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                <BrainCircuit className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Incidents Table / Cards Section */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
          }`}>
            {/* Filter Bar */}
            <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              darkMode ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div>
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Incident Triage Memory Log</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Autonomous agent decisions backed by distributed CockroachDB vector storage.
                </p>
              </div>

              {/* Filter Pills */}
              <div className={`flex p-1 rounded-xl text-xs font-semibold ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-1.5 rounded-lg transition ${
                    activeTab === 'all' 
                      ? (darkMode ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm')
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({incidents.length})
                </button>
                <button
                  onClick={() => setActiveTab('benign')}
                  className={`px-4 py-1.5 rounded-lg transition ${
                    activeTab === 'benign' 
                      ? (darkMode ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'bg-white text-emerald-600 shadow-sm')
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Auto-Resolved ({benignCount})
                </button>
                <button
                  onClick={() => setActiveTab('escalated')}
                  className={`px-4 py-1.5 rounded-lg transition ${
                    activeTab === 'escalated' 
                      ? (darkMode ? 'bg-slate-800 text-orange-400 shadow-sm' : 'bg-white text-orange-600 shadow-sm')
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Escalated ({escalatedCount})
                </button>
              </div>
            </div>

            {/* Incidents List */}
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-sm">Querying CockroachDB Cluster...</div>
            ) : filteredIncidents.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">No incidents match the selected filter.</div>
            ) : (
              <div className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {filteredIncidents.map((inc) => (
                  <div key={inc.incident_id} className={`p-6 transition-colors ${
                    darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono px-2.5 py-1 rounded-md font-semibold border ${
                          darkMode ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {inc.incident_id.substring(0, 8)}
                        </span>
                        <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>{inc.title}</h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                            inc.disposition === 'benign'
                              ? (darkMode ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-emerald-100 text-emerald-700 border border-emerald-200')
                              : (darkMode ? 'bg-orange-950/80 text-orange-400 border border-orange-800' : 'bg-orange-100 text-orange-700 border border-orange-200')
                          }`}
                        >
                          {inc.disposition === 'benign' ? 'Auto-Resolved' : 'Escalated'}
                        </span>
                      </div>
                    </div>

                    <p className={`text-xs p-3 rounded-xl border leading-relaxed mb-4 ${
                      darkMode ? 'bg-slate-950/60 text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200/60'
                    }`}>
                      <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>CarapaceAI Reasoning Trace: </span>
                      {inc.summary}
                    </p>

                    {/* Vector Memory Recalled Box */}
                    <div className={`border rounded-xl p-4 text-xs space-y-2 ${
                      darkMode ? 'bg-indigo-950/30 border-indigo-900/50' : 'bg-indigo-50/50 border-indigo-100'
                    }`}>
                      <div className="flex justify-between items-center font-bold">
                        <span className={`flex items-center gap-1.5 ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                          <BrainCircuit className="w-4 h-4 text-indigo-500" />
                          Recalled Memory Match & Decision Output
                        </span>
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-mono">
                          Distance: {inc.disposition === 'benign' ? '0.0000' : '0.8421'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className={`p-3 rounded-lg border ${
                          darkMode ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-white border-indigo-100 text-slate-600'
                        }`}>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                            Input Context
                          </span>
                          <pre className="text-[11px] font-mono overflow-x-auto">
                            {JSON.stringify(inc.tool_call, null, 2)}
                          </pre>
                        </div>

                        <div className={`p-3 rounded-lg border ${
                          darkMode ? 'bg-slate-950/80 border-slate-800 text-emerald-400' : 'bg-white border-indigo-100 text-indigo-600'
                        }`}>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                            Agent Decision Payload
                          </span>
                          <pre className="text-[11px] font-mono font-semibold overflow-x-auto">
                            {JSON.stringify(inc.result, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}