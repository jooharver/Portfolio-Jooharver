import { useMarketplaceStore } from '../marketplaceStore';
import { Package, TrendingUp, Eye, ShoppingCart, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const getShortDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

export default function SellerView() {
  const { currentUser, products, myOrders } = useMarketplaceStore();

  const totalViews = products.reduce((acc, p) => acc + p.views, 0);
  const totalCartAdds = products.reduce((acc, p) => acc + p.cartAdds, 0);
  const totalSales = products.reduce((acc, p) => acc + p.sales, 0);
  const revenue = products.reduce((acc, p) => acc + (p.sales * p.price), 0);

  const topProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);

  const chartData = [
    { name: getShortDate(6), Penjualan: 1250000 },
    { name: getShortDate(5), Penjualan: 2100000 },
    { name: getShortDate(4), Penjualan: 1800000 },
    { name: getShortDate(3), Penjualan: 3200000 },
    { name: getShortDate(2), Penjualan: 2500000 },
    { name: getShortDate(1), Penjualan: 4100000 },
    { name: 'Hari Ini', Penjualan: revenue > 0 ? revenue : 3800000 }, 
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6 pb-32">
      
      {/* Title Tampil HANYA di Mobile Karena Sidebar Disembunyikan */}
      <div className="lg:hidden flex items-center justify-between pb-4 border-b border-[#EBEAE5]">
        <div>
          <h2 className="text-2xl font-black text-[#1C2C24] uppercase tracking-tight">Mode Seller</h2>
          <p className="text-sm text-[#5C6E63] mt-1">Ringkasan performa toko <span className="font-bold text-[#1C2C24]">{currentUser?.shopName || "Nexus Fashion Official"}</span>.</p>
        </div>
      </div>

      {/* Grid Utama (Gunakan min-w-0 agar tidak membengkak di mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[
          { label: 'Total Pendapatan', value: `Rp ${revenue.toLocaleString('id-ID')}`, icon: TrendingUp },
          { label: 'Produk Terjual', value: totalSales, icon: Package },
          { label: 'Total Dilihat', value: totalViews, icon: Eye },
          { label: 'Dimasukkan Keranjang', value: totalCartAdds, icon: ShoppingCart },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#EBEAE5] rounded-2xl p-5 md:p-6 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow min-w-0">
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-[10px] font-bold tracking-widest text-[#9BA8A1] uppercase mb-1 truncate">{stat.label}</p>
              <h3 className="text-xl md:text-2xl font-black text-[#1C2C24] truncate">{stat.value}</h3>
            </div>
            <div className="w-10 h-10 shrink-0 bg-[#F4F1EA] rounded-xl flex items-center justify-center text-[#5C6E63] border border-[#EBEAE5]">
              <stat.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        {/* CHART CONTAINER: Pakai min-w-0 & overflow-hidden agar responsive */}
        <div className="bg-white border border-[#EBEAE5] rounded-2xl p-5 md:p-8 shadow-sm lg:col-span-2 flex flex-col min-w-0 overflow-hidden">
          <h3 className="text-lg font-black text-[#1C2C24] mb-1">Tren Penjualan</h3>
          <p className="text-[#9BA8A1] text-xs font-bold uppercase tracking-widest mb-6">7 Hari Terakhir</p>
          
          <div className="h-[250px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEAE5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9BA8A1', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9BA8A1', fontWeight: 'bold' }} tickFormatter={(val) => `Rp${val/1000000}M`} />
                <RechartsTooltip 
                  cursor={{ fill: '#F7F6F2' }}
                  contentStyle={{ backgroundColor: '#1C2C24', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#D1C3A5', fontWeight: 'bold' }}
                  formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Penjualan']}
                />
                <Bar dataKey="Penjualan" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#1C2C24' : '#C2BBAF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#EBEAE5] rounded-2xl p-5 md:p-8 shadow-sm flex flex-col min-w-0 overflow-hidden">
          <h3 className="text-lg font-black text-[#1C2C24] mb-1">Produk Terlaris</h3>
          <p className="text-[#9BA8A1] text-xs font-bold uppercase tracking-widest mb-6">Berdasarkan Unit Terjual</p>
          
          <div className="space-y-4 flex-1">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4">
                <span className="text-[#D1C3A5] font-black text-xl w-4 shrink-0">{i + 1}</span>
                <img src={p.image} className="w-10 h-10 rounded-lg bg-[#F7F6F2] object-cover mix-blend-multiply border border-[#EBEAE5] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1C2C24] truncate">{p.name}</p>
                  <p className="text-xs text-[#78857E]">{p.sales} Terjual</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABEL PESANAN: Tambah margin bawah ekstra agar lega */}
      <div className="bg-white border border-[#EBEAE5] rounded-2xl p-5 md:p-8 shadow-sm min-w-0 overflow-hidden mb-12 md:mb-16">
        <h3 className="text-lg font-black text-[#1C2C24] mb-1">Pesanan Masuk</h3>
        <p className="text-[#9BA8A1] text-xs font-bold uppercase tracking-widest mb-6">Real-time update</p>
        
        {myOrders.length === 0 ? (
          <p className="text-center text-[#9BA8A1] py-8 text-sm font-medium">Belum ada pesanan masuk.</p>
        ) : (
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
              <thead>
                <tr className="border-b border-[#EBEAE5] text-[#9BA8A1]">
                  <th className="pb-3 font-medium px-2">Order ID</th>
                  <th className="pb-3 font-medium px-2">Waktu</th>
                  <th className="pb-3 font-medium px-2">Pembeli</th>
                  <th className="pb-3 font-medium px-2">Produk</th>
                  <th className="pb-3 font-medium text-right px-2">Total</th>
                  <th className="pb-3 font-medium text-right px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEAE5]">
                {myOrders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-[#F7F6F2] transition-colors">
                    <td className="py-4 px-2 font-bold text-[#1C2C24]">{order.id}</td>
                    <td className="py-4 px-2 text-[#78857E] flex items-center gap-1.5"><Clock size={14}/> {order.date.split(',')[1] || order.date}</td>
                    <td className="py-4 px-2 text-[#1C2C24] font-medium">{order.shipping.name}</td>
                    <td className="py-4 px-2 text-[#5C6E63] max-w-[150px] md:max-w-[200px] truncate">{order.item.name}</td>
                    <td className="py-4 px-2 font-black text-[#9B7E5D] text-right">Rp {order.total.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-2 text-right">
                      <span className="bg-[#E3F2ED] text-[#2A4034] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#5C6E63]/20">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}