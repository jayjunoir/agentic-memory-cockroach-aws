import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, Radio, Server } from 'lucide-react';

export default function LiveFeedPage() {
  const liveEvents = [
    {
      id: "EVT-9042",
      severity: "critical",
      title: "Brute-force SSH attack neutralized",
      source: "AWS-US-East-Cluster",
      time: "Just now",
      color: "text-pink-400 border-pink-500/30 bg-pink-500/10"
    },
    {
      id: "EVT-9041",
      severity: "warning",
      title: "Anomalous outbound payload flagged & isolated",
      source: "CockroachDB-Node-02",
      time: "2 mins ago",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10"
    },
    {
      id: "EVT-9040",
      severity: "info",
      title: "Automated firewall rule sync completed successfully",
      source: "Edge-Gateway-Alpha",
      time: "5 mins ago",
      color: "text-blue-400 border-blue-500/30 bg-blue-500/10"
    },
    {
      id: "EVT-9039",
      severity: "success",
      title: "Vector memory indexing cycle optimized",
      source: "Bedrock-Reasoning-Core",
      time: "12 mins ago",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    }
  ];

  return (
    <main className="min-h-screen bg-[#07080f] text-white p-8 md:p-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header with Live Status Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-medium mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm tracking-wide uppercase font-semibold">Live Telemetry Feed</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-400 bg-clip-text text-transparent">
              Real-Time Security Stream
            </h1>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md">
            <Radio className="w-5 h-5 text-pink-400 animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">Status: All Systems Operational</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium">Events Triaged Today</p>
            <p className="text-3xl font-extrabold text-white">48,215</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium">Mean Response Time</p>
            <p className="text-3xl font-extrabold text-pink-400">42ms</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium">Active Defense Nodes</p>
            <p className="text-3xl font-extrabold text-purple-400">18 / 18</p>
          </div>
        </div>

        {/* Feed List */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <h2 className="text-lg font-semibold text-gray-200 px-2 mb-2 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span>Incoming Threat Stream</span>
          </h2>

          {liveEvents.map((event) => (
            <div 
              key={event.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-lg text-xs font-semibold border ${event.color}`}>
                  {event.id}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{event.title}</h4>
                  <p className="text-xs text-gray-400 flex items-center space-x-1 mt-0.5">
                    <Server className="w-3 h-3" />
                    <span>{event.source}</span>
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-400 font-medium sm:text-right">
                {event.time}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}