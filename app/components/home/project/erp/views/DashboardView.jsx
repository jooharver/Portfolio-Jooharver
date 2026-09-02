import { Package, Truck, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useErpStore } from '../erpStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardView() {
  const { items, orders } = useErpStore();
  
  const totalStock = items.reduce((acc, curr) => acc + curr.stock, 0);
  const activeShipments = orders.filter(o => o.status === 'IN_TRANSIT').length;

  // DATA GRAFIK: Mengelompokkan order berdasarkan tanggal untuk 7 hari terakhir
  const getChartData = () => {
    const dataMap = {};
    orders.forEach(o => {
      // Ambil kata pertama (tanggal) dari format "2 September 2026"
      const shortDate = o.date.split(' ')[0] + ' ' + o.date.split(' ')[1].substring(0,3); 
      dataMap[shortDate] = (dataMap[shortDate] || 0) + 1;
    });
    
    // Convert ke array untuk Recharts
    return Object.keys(dataMap).map(key => ({
      name: key,
      Pengiriman: dataMap[key]
    })).reverse(); // Balik agar berurutan secara waktu
  };

  const chartData = getChartData();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Supply Chain Overview</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Ringkasan aktivitas inventaris dan pengiriman logistik Supermarket hari ini.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total SKU Aktif', value: items.length, icon: Package, color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200' },
          { label: 'Total Stok (Unit)', value: totalStock, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200' },
          { label: 'Pengiriman Aktif', value: activeShipments, icon: Truck, color: 'text-indigo-700', bg: 'bg-indigo-100 border-indigo-200' },
          { label: 'Kendala Logistik', value: '1', icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-300 rounded-2xl p-5 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{stat.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl border ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAFIK RECHARTS */}
        <div className="bg-white border border-slate-300 rounded-3xl p-6 md:p-8 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Volume Pengiriman Logistik</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Frekuensi pesanan masuk berdasarkan tanggal.</p>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={20}/></div>
          </div>
          
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                />
                <Bar dataKey="Pengiriman" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#2563eb' : '#93c5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AKTIVITAS TERKINI */}
        <div className="bg-white border border-slate-300 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Peringatan Operasional</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 border border-amber-200 text-amber-600 rounded-xl flex items-center justify-center shrink-0 mt-1"><AlertTriangle size={18}/></div>
              <div>
                <p className="font-bold text-slate-900 text-sm leading-tight mb-1">Kendala: PO-2609-006</p>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">Jalur Arteri Porong macet total akibat banjir rob. Rute melambat, estimasi kedatangan di Gudang Pasuruan mundur.</p>
                <span className="text-[10px] font-black text-amber-500 mt-2 block tracking-widest">12:00 WIB</span>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 border border-blue-200 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mt-1"><Truck size={18}/></div>
              <div>
                <p className="font-bold text-slate-900 text-sm leading-tight mb-1">Mendekat: PO-2609-001</p>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">Truk ekspedisi pembawa 50 Unit Daging Sapi telah melintasi Tol Surabaya-Mojokerto menuju Cabang Utama Malang.</p>
                <span className="text-[10px] font-black text-blue-500 mt-2 block tracking-widest">06:30 WIB</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}