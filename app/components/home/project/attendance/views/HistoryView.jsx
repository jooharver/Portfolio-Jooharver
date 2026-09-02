import { useState } from 'react';
import { CheckCircle2, AlertCircle, CalendarOff, AlertTriangle } from 'lucide-react';
import { useAttendanceStore, formatFullDate } from '../store/useAttendanceStore';

export default function HistoryView() {
  const historyData = useAttendanceStore((state) => state.history);
  const [filter, setFilter] = useState('all'); // State filter: 'all' | '7days' | 'month'
  
  const now = new Date();
  const todayString = formatFullDate(now);

  const getStatusStyle = (status) => {
    if (status === 'Tepat Waktu') return { icon: CheckCircle2, color: 'text-emerald-400' };
    if (status === 'Libur Nasional') return { icon: CalendarOff, color: 'text-blue-400' };
    if (status.includes('Pulang Awal') && !status.includes('Terlambat')) return { icon: AlertTriangle, color: 'text-amber-400' };
    return { icon: AlertCircle, color: 'text-rose-400' }; 
  };

  // LOGIKA FILTER
  const filteredData = historyData.filter((data) => {
    if (filter === 'all') return true;
    
    // Gunakan id (timestamp) untuk mengkonversi kembali ke Date
    const recordDate = new Date(data.id);
    
    if (filter === '7days') {
      const diffTime = Math.abs(now.getTime() - recordDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    
    if (filter === 'month') {
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
    }
    
    return true;
  });

  return (
    <div className="px-6 space-y-5">
      
      {/* HEADER & FILTER */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Riwayat Absensi</h2>
        
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              filter === 'all' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-[#18181b] text-zinc-400 border border-zinc-800'
            }`}
          >
            Semua
          </button>
          <button 
            onClick={() => setFilter('7days')}
            className={`px-4 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              filter === '7days' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-[#18181b] text-zinc-400 border border-zinc-800'
            }`}
          >
            7 Hari Terakhir
          </button>
          <button 
            onClick={() => setFilter('month')}
            className={`px-4 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              filter === 'month' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-[#18181b] text-zinc-400 border border-zinc-800'
            }`}
          >
            Bulan Ini
          </button>
        </div>
      </div>
      
      {/* LIST DATA */}
      <div className="space-y-4 pb-4">
        {filteredData.length > 0 ? (
          filteredData.map((data) => {
            const StatusIcon = getStatusStyle(data.status).icon;
            const statusColor = getStatusStyle(data.status).color;
            const isToday = data.date === todayString;

            return (
              <div 
                key={data.id} 
                className={`relative overflow-hidden rounded-xl p-4 flex justify-between items-center transition-all ${
                  isToday 
                    ? 'bg-emerald-950/20 border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                    : 'bg-[#18181b] border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {isToday && <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full" />}

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-white">{data.date}</p>
                    {isToday && (
                      <span className="bg-emerald-500 text-emerald-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Hari Ini
                      </span>
                    )}
                  </div>
                  
                  {data.status === 'Libur Nasional' ? (
                    <div className="text-xs text-zinc-500 font-medium">Hari Kemerdekaan RI</div>
                  ) : (
                    <div className="flex gap-3 text-[11px] text-zinc-400 font-mono">
                      <span className={`px-2 py-1 rounded-md border ${isToday ? 'bg-emerald-950/40 border-emerald-500/20' : 'bg-zinc-900 border-zinc-800'}`}>
                        In: <span className="text-white">{data.in}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-md border ${isToday ? 'bg-emerald-950/40 border-emerald-500/20' : 'bg-zinc-900 border-zinc-800'}`}>
                        Out: <span className="text-white">{data.out}</span>
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-1 max-w-[100px] relative z-10">
                  <StatusIcon size={20} className={statusColor} />
                  <span className={`text-[10px] font-bold text-right leading-tight ${statusColor}`}>
                    {data.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-zinc-500 text-xs py-10 border border-dashed border-zinc-800 rounded-xl">
            Tidak ada riwayat absensi.
          </div>
        )}
      </div>
    </div>
  );
}