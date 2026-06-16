import React from 'react';
import { LayoutDashboard, CheckCircle2, Flame, Hourglass, Layers } from 'lucide-react';

export default function PremiumStaffDashboard() {
  const data = {
    totalAssigned: 1,
    completed: 0,
    inProgress: 0,
    upcoming: 1
  };

  const metrics = [
    {
      id: 'assigned',
      label: 'Total Scope',
      value: data.totalAssigned,
      icon: Layers,
      theme: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400'
    },
    {
      id: 'progress',
      label: 'In Flight',
      value: data.inProgress,
      icon: Flame,
      theme: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400'
    },
    {
      id: 'upcoming',
      label: 'Pipeline',
      value: data.upcoming,
      icon: Hourglass,
      theme: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400'
    },
    {
      id: 'completed',
      label: 'Closed Out',
      value: data.completed,
      icon: CheckCircle2,
      theme: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400'
    }
  ];

  return (
    <div className="w-full max-w-6xl p-8 bg-[#0B0F19] border border-slate-800/60 rounded-2xl shadow-2xl text-slate-100 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">
            <LayoutDashboard size={14} />
            <span>Operations Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Staff Overview</h1>
        </div>
        
        {/* API Status Anchor */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full shadow-inner">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-medium text-slate-400">Live Sync Active</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((item) => {
          const Icon = item.icon;
          const hasValue = item.value > 0;
          
          return (
            <div 
              key={item.id} 
              className={`relative overflow-hidden p-6 bg-gradient-to-br ${item.theme} border rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              {/* Decorative radial ambient glow behind icon */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-current opacity-[0.03] blur-xl rounded-full pointer-events-none" />

              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                  {item.label}
                </span>
                <Icon size={18} className="opacity-80" />
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <span className="text-4xl font-extrabold tracking-tight text-white">
                  {item.value}
                </span>
                
                {/* Visual context micro-copy */}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  hasValue 
                    ? 'bg-white/5 border-white/10 text-white' 
                    : 'bg-black/20 border-transparent text-slate-600'
                }`}>
                  {hasValue ? 'Action Required' : 'Idle'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
