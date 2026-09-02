import { useState } from 'react';
import { MapPin, RefreshCw, Thermometer, Calendar, FileText, Gift, Loader2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

export default function DashboardView({ setActiveTab }) {
  const radiusOptions = ['12 Meter', '20 Meter', '2 Meter'];
  const [radiusIndex, setRadiusIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshLocation = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    // Simulasi loading pencarian lokasi 2 detik
    setTimeout(() => {
      setRadiusIndex((prev) => (prev + 1) % radiusOptions.length);
      setIsRefreshing(false);
    }, 2000);
  };

  const dummyGraphData = [
    { date: '26 Ags', percent: 85, emps: 170 },
    { date: '27 Ags', percent: 92, emps: 184 },
    { date: '28 Ags', percent: 80, emps: 160 },
    { date: '31 Ags', percent: 95, emps: 190 },
    { date: '01 Sep', percent: 98, emps: 196 },
  ];

  return (
    <div className="px-6 space-y-6">
      
      {/* LOKASI MODULE */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="mt-1">
              <MapPin size={20} className={isRefreshing ? "text-zinc-500" : "text-emerald-400"} />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Kantor Pusat - Jakarta</h4>
              <p className="text-zinc-400 text-xs mt-0.5">Jl. Jend. Sudirman No.Kav 21</p>
            </div>
          </div>
          <button 
            onClick={handleRefreshLocation} 
            disabled={isRefreshing}
            className={`p-2 bg-zinc-900 rounded-lg transition-colors ${isRefreshing ? 'text-emerald-400' : 'text-zinc-400 hover:text-white'}`}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
        
        <div className={`border rounded-lg py-2 px-3 flex items-center gap-2 transition-colors ${isRefreshing ? 'bg-zinc-900/50 border-zinc-800' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
          {isRefreshing ? (
            <Loader2 size={12} className="text-emerald-400 animate-spin" />
          ) : (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          )}
          <span className={`text-xs font-medium transition-all ${isRefreshing ? 'text-zinc-400' : 'text-emerald-400'}`}>
            {isRefreshing ? 'Mendeteksi titik koordinat...' : `Radius Aman (${radiusOptions[radiusIndex]})`}
          </span>
        </div>
      </div>

      {/* GRAFIK KEHADIRAN */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4">
        <div className="flex justify-between items-end mb-4">
          <h4 className="text-white text-sm font-semibold">Tren Kehadiran</h4>
          <span className="text-[10px] bg-zinc-900 px-2 py-1 rounded text-zinc-400">Total: 200 Karyawan</span>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dummyGraphData}>
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '11px' }} 
                itemStyle={{ color: '#10b981' }} 
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                formatter={(value, name, props) => [`${props.payload.emps}/200 Karyawan`, 'Hadir']}
                labelFormatter={(label) => `Tanggal: ${label}`}
              />
              <Area type="monotone" dataKey="percent" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between px-2 mt-2">
          {dummyGraphData.map(d => <span key={d.date} className="text-[9px] text-zinc-500 font-medium">{d.date}</span>)}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h4 className="text-white text-sm font-semibold mb-3">Menu Layanan</h4>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'sakit', label: 'Sakit', icon: Thermometer, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { id: 'cuti', label: 'Cuti', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { id: 'reimburse', label: 'Reimburse', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { id: 'benefit', label: 'Benefit', icon: Gift, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          ].map((menu) => (
            <button key={menu.id} onClick={() => setActiveTab(menu.id)} className="flex flex-col items-center gap-2 group">
              <div className={`w-14 h-14 rounded-2xl ${menu.bg} border border-zinc-800 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:border-zinc-700`}>
                <menu.icon size={24} className={menu.color} />
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">{menu.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}