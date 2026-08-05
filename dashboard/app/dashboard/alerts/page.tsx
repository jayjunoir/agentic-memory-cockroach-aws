export default function AlertsPage() {
  return (
    <div className="bg-[#0B0E1F] border border-purple-950 rounded-2xl p-8 space-y-4">
      <h2 className="text-xl font-bold text-white">Active Security Alerts</h2>
      <p className="text-xs text-slate-400">Real-time telemetry stream categorized by severity and host asset criticality.</p>
      <div className="p-4 bg-[#070913] rounded-xl border border-purple-950 text-xs font-mono text-purple-300">
        3 active unacknowledged threat vectors queued for agent evaluation.
      </div>
    </div>
  );
}