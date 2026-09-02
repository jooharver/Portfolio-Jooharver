import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Package, AlertCircle } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

const COLORS = ['#b300ff', '#ffa67a', '#3b82f6', '#10b981', '#f43f5e'];

export default function DashboardView() {
  const items = useInventoryStore((state) => state.items);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const generatedData = [];
    const baseMasuk = [120, 150, 180, 90, 210, 160, 100];
    const baseKeluar = [80, 120, 100, 150, 170, 140, 90];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      generatedData.push({
        name: `${d.getDate()} ${days[d.getDay()]}`,
        masuk: baseMasuk[6 - i],
        keluar: baseKeluar[6 - i]
      });
    }
    setChartData(generatedData);

    const stockByCategory = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.stock);
      return acc;
    }, {});
    
    setPieData(Object.keys(stockByCategory).map(key => ({
      name: key,
      value: stockByCategory[key]
    })));
  }, [items]);

  const totalStock = items.reduce((sum, item) => sum + Number(item.stock), 0);
  const lowStock = items.filter(i => i.stock < 5).length;

  return (
    // Menggunakan h-full dan flex-col agar pas layar tanpa scroll
    <div className="h-full flex flex-col gap-4 md:gap-6">
      <h2 className="text-xl md:text-2xl font-bold text-white shrink-0">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {[
          { title: 'Total Varian Barang', val: items.length, icon: Package, color: 'text-blue-400' },
          { title: 'Total Unit Tersedia', val: totalStock, icon: TrendingUp, color: 'text-emerald-400' },
          { title: 'Transaksi Keluar', val: '1,240', icon: TrendingDown, color: 'text-rose-400' },
          { title: 'Peringatan Stok', val: lowStock, icon: AlertCircle, color: 'text-amber-400' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#18181b] p-4 md:p-5 rounded-2xl border border-zinc-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-xs md:text-sm">{kpi.title}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-1 md:mt-2">{kpi.val}</h3>
              </div>
              <div className={`p-2 md:p-3 bg-zinc-900 rounded-xl ${kpi.color}`}>
                <kpi.icon size={20} className="md:w-6 md:h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kontainer grafik mengambil sisa ruang (flex-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0">
        <div className="bg-[#18181b] p-4 md:p-6 rounded-2xl border border-zinc-800 lg:col-span-2 flex flex-col">
          <h3 className="text-base md:text-lg font-semibold text-white mb-4 shrink-0">Aktivitas Arus Barang (7 Hari)</h3>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis stroke="#a1a1aa" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.75rem' }} itemStyle={{ color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" name="Barang Masuk" dataKey="masuk" stroke="#b300ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Barang Keluar" dataKey="keluar" stroke="#ffa67a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#18181b] p-4 md:p-6 rounded-2xl border border-zinc-800 lg:col-span-1 flex flex-col">
          <h3 className="text-base md:text-lg font-semibold text-white mb-4 shrink-0">Proporsi Stok per Kategori</h3>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={50} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                  labelLine={{ stroke: '#52525b' }} 
                  label={({ value }) => `${value} unit`}
                  style={{ fontSize: '12px', fontWeight: '500' }} 
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.75rem' }} 
                  itemStyle={{ color: '#fff' }} 
                  formatter={(value) => [`${value} unit`, 'Stok']} 
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}