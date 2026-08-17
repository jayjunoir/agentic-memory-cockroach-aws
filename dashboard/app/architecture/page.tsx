import React from 'react';
import NetworkThreeCanvas from '@/components/NetworkThreeCanvas';

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-[#07080f] text-white p-8 md:p-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-400 bg-clip-text text-transparent">
          3D Threat Mesh Architecture
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Real-time spatial visualization of autonomous SOC nodes communicating through AWS Bedrock pipelines.
        </p>

        {/* Embedded 3D Three.js Interactive Component */}
        <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)]">
          <NetworkThreeCanvas />
        </div>
      </div>
    </main>
  );
}