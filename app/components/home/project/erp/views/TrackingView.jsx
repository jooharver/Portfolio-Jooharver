import { useState, useEffect } from 'react';
import { useErpStore } from '../erpStore';
import { Route, ChevronLeft, Truck, AlertTriangle, CheckCircle2, Clock, Search, Plus, X, MapPin, ShieldAlert, CheckSquare, Map, ChevronRight, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackingView() {
  const { currentUser, orders, items, vendors, branches, addOrder, updateTrackingStatus, rerouteOrder, approveTransit } = useErpStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isCreating, setIsCreating] = useState(false);
  const [newOrder, setNewOrder] = useState({ vendorId: '', itemId: '', branchId: '', qty: 1, transits: [] });
  const [rerouteForm, setRerouteForm] = useState({ isOpen: false, location: '', reason: '' });
  const [confirmReceiptModal, setConfirmReceiptModal] = useState(false);
  const [confirmTransitModal, setConfirmTransitModal] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const getFullOrderDetails = (order) => {
    const item = items.find(i => i.id === order.itemId);
    const vendor = vendors.find(v => v.id === order.vendorId);
    const branch = branches.find(b => b.id === order.branchId);
    return { ...order, item, vendor, branch };
  };

  const filteredOrders = orders.filter(o => {
    const itemMatch = items.find(i => i.id === o.itemId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const searchMatch = itemMatch || idMatch;

    if (activeTab === 'MY_BRANCH') {
      const isMyTask = o.tracking.some(t => currentUser.authorizedLocations.includes(t.location));
      return searchMatch && isMyTask;
    }
    return searchMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreateRoute = (e) => {
    e.preventDefault();
    if (!newOrder.vendorId || !newOrder.itemId || !newOrder.branchId) return alert("Pilih Supplier, Barang, dan Cabang Tujuan!");

    const vName = vendors.find(v => v.id === newOrder.vendorId)?.name;
    const bName = branches.find(b => b.id === newOrder.branchId)?.name;
    
    let trackNodes = [
      { id: 1, location: `Fasilitas ${vName}`, status: 'Diproses', desc: 'Barang sedang dipersiapkan oleh Supplier.', time: '08:00 WIB', type: 'success' },
      { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Dikirim', desc: 'Barang diserahkan ke kurir logistik.', time: '10:00 WIB', type: 'process' }
    ];

    newOrder.transits.forEach((transitName, index) => {
      trackNodes.push({ id: 3 + index, location: transitName, status: 'Transit', desc: 'Barang singgah di Gudang Transit.', time: 'Menunggu', type: 'pending' });
    });

    trackNodes.push({ id: 99, location: bName, status: 'Menunggu Kedatangan', desc: 'Estimasi tiba di fasilitas tujuan.', time: 'Pending', type: 'pending' });

    const generatedOrder = {
      id: `PO-2609-0${Math.floor(10 + Math.random() * 89)}`,
      itemId: newOrder.itemId,
      vendorId: newOrder.vendorId,
      branchId: newOrder.branchId,
      qty: Number(newOrder.qty),
      status: 'IN_TRANSIT',
      date: 'Hari Ini', 
      tracking: trackNodes
    };

    addOrder(generatedOrder);
    setIsCreating(false);
    setNewOrder({ vendorId: '', itemId: '', branchId: '', qty: 1, transits: [] });
  };

  const executeConfirmReceipt = () => {
    updateTrackingStatus(selectedOrder.id, 'Diterima', 'Barang telah diterima dan diverifikasi oleh admin cabang.', 'success');
    setSelectedOrder({
      ...selectedOrder, 
      status: 'DELIVERED', 
      tracking: selectedOrder.tracking.map((t, i) => 
        i === selectedOrder.tracking.length - 1 
          ? { ...t, type: 'success', status: 'Diterima', time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' } 
          : t
      )
    });
    setConfirmReceiptModal(false);
  };

  const executeApproveTransit = () => {
    const pendingNode = selectedOrder.tracking.find(t => t.type === 'pending');
    approveTransit(selectedOrder.id, pendingNode.id);
    setConfirmTransitModal(false);
    setSelectedOrder(null); 
  };

  const handleRerouteSubmit = (e) => {
    e.preventDefault();
    rerouteOrder(selectedOrder.id, rerouteForm.location, rerouteForm.reason);
    setRerouteForm({ isOpen: false, location: '', reason: '' });
    setSelectedOrder(null); 
  };

  const firstPendingNode = selectedOrder?.tracking.find(t => t.type === 'pending');
  const hasAuthorityNow = firstPendingNode && currentUser.authorizedLocations.includes(firstPendingNode.location);
  const isFinalDestination = firstPendingNode && firstPendingNode.id === selectedOrder.tracking[selectedOrder.tracking.length - 1].id;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-full relative">
      <AnimatePresence mode="wait">
        {!selectedOrder ? (
          <motion.div key="list" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-6 pb-12">
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2"><Route size={24} className="text-blue-600"/> Supply Chain Tracking</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Lacak pengiriman dari Supplier ke Gudang/Cabang di wilayah Jawa Timur.</p>
              </div>
              <button onClick={() => setIsCreating(true)} className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all shrink-0">
                <Plus size={18}/> Buat Pengiriman
              </button>
            </div>
            
            <div className="flex flex-row items-center justify-between gap-3 bg-white p-2 md:p-3 rounded-2xl shadow-sm border border-slate-200">
              <div className="relative flex-1 md:w-80 md:flex-none">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Cari No. PO atau Barang..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 md:py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>

              <div className="md:hidden shrink-0">
                <select 
                  value={activeTab} 
                  onChange={(e) => setActiveTab(e.target.value)} 
                  className="bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-2 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ALL">Semua Rute</option>
                  <option value="MY_BRANCH">Malang</option>
                </select>
              </div>

              <div className="hidden md:flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                <button onClick={() => setActiveTab('ALL')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}>
                  Semua Rute
                </button>
                <button onClick={() => setActiveTab('MY_BRANCH')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'MY_BRANCH' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}>
                  <Map size={14}/> Malang
                </button>
              </div>
            </div>

            {/* TABEL DIPERBAIKI: Penambahan overflow-hidden agar sudut melengkung */}
            <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-900 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <th className="p-4 first:rounded-tl-2xl">No. PO</th>
                      <th className="p-4">Barang</th>
                      <th className="p-4">Tujuan Cabang</th>
                      <th className="p-4">Tgl Order</th>
                      <th className="p-4 whitespace-nowrap last:rounded-tr-2xl">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-slate-500 text-sm font-medium bg-slate-50">Data tidak ditemukan.</td></tr>
                    ) : (
                      paginatedOrders.map((o) => {
                        const fullOrder = getFullOrderDetails(o);
                        const activePendingNode = o.tracking.find(t => t.type === 'pending');
                        const isMyTask = activePendingNode && currentUser.authorizedLocations.includes(activePendingNode.location);

                        return (
                          <tr key={o.id} onClick={() => setSelectedOrder(fullOrder)} className={`border-b border-slate-200 cursor-pointer transition-colors group ${isMyTask ? 'bg-blue-50/50 hover:bg-blue-100/60' : 'odd:bg-white even:bg-slate-50 hover:bg-slate-100'} last:border-0`}>
                            <td className="p-4 font-bold text-slate-900 text-sm whitespace-nowrap">{o.id}</td>
                            <td className="p-4">
                              <p className="text-sm font-bold text-slate-800">{fullOrder.item?.name}</p>
                              <p className="text-[11px] text-slate-600 font-medium">{o.qty} Unit</p>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col items-start gap-1">
                                <span className="text-sm font-medium text-slate-700">{fullOrder.branch?.name}</span>
                                {isMyTask && <span className="text-[9px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">Tindakan Diperlukan</span>}
                              </div>
                            </td>
                            <td className="p-4 text-sm font-medium text-slate-600">{o.date}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={`inline-block text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border whitespace-nowrap ${o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'}`}>
                                {o.status.replace('_', ' ')}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              
              {filteredOrders.length > 0 && (
                <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-500">
                    Menampilkan <span className="text-slate-900">{paginatedOrders.length}</span> dari <span className="text-slate-900">{filteredOrders.length}</span> pengiriman
                  </span>
                  <div className="flex gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16}/></button>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16}/></button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} className="pb-12">
            <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors w-fit mb-4">
              <ChevronLeft size={18} /> Kembali
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-white border border-slate-300 rounded-[2rem] p-6 md:p-8 shadow-sm h-fit">
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Nomor Order</span>
                    <h3 className="text-2xl font-black text-slate-900">{selectedOrder.id}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border whitespace-nowrap ${selectedOrder.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'}`}>
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Supplier (Asal)', value: selectedOrder.vendor?.name, sub: selectedOrder.vendor?.type },
                    { label: 'Cabang Tujuan', value: selectedOrder.branch?.name, sub: selectedOrder.branch?.address },
                    { label: 'Tanggal Order', value: selectedOrder.date, sub: 'Estimasi Pengiriman: 1 Hari' },
                    { label: 'Rincian Barang', value: selectedOrder.item?.name, sub: `${selectedOrder.qty} Unit (${selectedOrder.item?.category})` },
                  ].map((row, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-slate-200 last:border-0 gap-2">
                      <span className="text-slate-500 text-[11px] font-black uppercase tracking-widest shrink-0">{row.label}</span>
                      <div className="sm:text-right">
                        <p className="text-slate-900 text-sm font-bold">{row.value}</p>
                        <p className="text-slate-600 text-xs font-medium">{row.sub}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-6 mt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-slate-900 font-black text-sm uppercase tracking-tight">Nilai Barang</span>
                    <span className="text-xl font-black text-blue-700">
                      Rp {(selectedOrder.qty * selectedOrder.item?.price).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                
                <div className="bg-white border border-slate-300 rounded-[2rem] p-6 md:p-8 shadow-sm flex-1">
                  <h3 className="text-lg font-black text-slate-900 mb-8 pb-4 border-b border-slate-200">Live Flow Tracking</h3>
                  
                  <div className="relative pl-2 md:pl-4">
                    {selectedOrder.tracking.map((track, idx) => {
                      const isLast = idx === selectedOrder.tracking.length - 1;
                      let icon = <CheckCircle2 size={16} className="text-white"/>;
                      let dotColor = "bg-emerald-500 ring-emerald-200";
                      let lineColor = "bg-emerald-300";
                      
                      if (track.type === 'process') { icon = <Truck size={14} className="text-white"/>; dotColor = "bg-blue-500 ring-blue-200"; lineColor = "bg-blue-300"; }
                      if (track.type === 'warning') { icon = <AlertTriangle size={14} className="text-white"/>; dotColor = "bg-amber-500 ring-amber-200"; lineColor = "border-dashed border-2 border-amber-400 bg-transparent"; }
                      if (track.type === 'pending') { icon = <Clock size={14} className="text-slate-500"/>; dotColor = "bg-slate-100 border-2 border-slate-400 ring-transparent"; lineColor = "border-dashed border-2 border-slate-300 bg-transparent"; }

                      return (
                        <div key={track.id} className="relative pb-8 last:pb-2">
                          {!isLast && <div className={`absolute left-[15px] top-[30px] bottom-[-10px] w-1 rounded-full ${lineColor}`}></div>}
                          <div className="flex items-start gap-4">
                            <div className={`relative z-10 w-8 h-8 rounded-full ${dotColor} ring-4 flex items-center justify-center shrink-0 mt-1`}>{icon}</div>
                            <div className={`flex-1 bg-slate-50 shadow-sm border rounded-2xl p-4 transition-all ${track.type === 'warning' ? 'border-amber-300 bg-amber-50' : 'border-slate-300'}`}>
                              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border whitespace-nowrap ${track.type === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-200 text-slate-700 border-slate-300'}`}>{track.status}</span>
                                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{track.time}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 mb-1">{track.location}</h4>
                              <p className="text-xs text-slate-600 font-medium leading-relaxed">{track.desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {hasAuthorityNow && (
                  <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_-10px_rgba(59,130,246,0.2)] border-2 border-blue-400 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
                    
                    <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-200">
                      <div className="p-3 bg-blue-100 text-blue-700 rounded-xl"><ShieldAlert size={24}/></div>
                      <div>
                        <h3 className="text-slate-900 font-black text-base">Otoritas Cabang ({firstPendingNode.location})</h3>
                        <p className="text-slate-500 text-xs mt-1 font-medium">Paket ini dijadwalkan tiba di wilayah Anda.</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      {isFinalDestination ? (
                        <button onClick={() => setConfirmReceiptModal(true)} className="flex-1 py-3.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200">
                          <CheckSquare size={18}/> Konfirmasi Diterima
                        </button>
                      ) : (
                        <button onClick={() => setConfirmTransitModal(true)} className="flex-1 py-3.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200">
                          <Share size={18}/> Selesaikan Transit
                        </button>
                      )}
                      
                      <button onClick={() => setRerouteForm({...rerouteForm, isOpen: true})} className="flex-1 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 py-3.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all shadow-sm">
                        <Route size={18}/> Alihkan Rute
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL BUAT RUTE BARU */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50 shrink-0">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><Route size={20} className="text-blue-600"/> Setup Rute Logistik</h3>
                <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-rose-600"><X size={20}/></button>
              </div>
              <form onSubmit={handleCreateRoute} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Titik Awal (Supplier/Vendor)</label>
                    <select required value={newOrder.vendorId} onChange={e => setNewOrder({...newOrder, vendorId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <option value="" disabled>Pilih Supplier...</option>
                      {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Barang (SKU)</label>
                    <select required value={newOrder.itemId} onChange={e => setNewOrder({...newOrder, itemId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <option value="" disabled>Pilih Barang...</option>
                      {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Kuantitas</label>
                    <input type="number" min="1" required value={newOrder.qty} onChange={e => setNewOrder({...newOrder, qty: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 border-dashed">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-slate-500">Titik Transit (Opsional)</label>
                    <button type="button" onClick={() => setNewOrder({...newOrder, transits: [...newOrder.transits, '']})} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-md hover:bg-slate-200 flex items-center gap-1">+ Tambah Transit</button>
                  </div>
                  {newOrder.transits.map((transit, index) => (
                    <div key={index} className="flex gap-2 mb-2 relative">
                      <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-3 h-[2px] bg-slate-300"></div>
                      <select required value={transit} onChange={e => { const updated = [...newOrder.transits]; updated[index] = e.target.value; setNewOrder({...newOrder, transits: updated}); }} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500">
                        <option value="" disabled>Pilih Fasilitas Transit...</option>
                        {branches.map(b => <option key={b.id} value={b.name}>{b.name} ({b.type})</option>)}
                      </select>
                      <button type="button" onClick={() => setNewOrder({...newOrder, transits: newOrder.transits.filter((_, i) => i !== index)})} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100"><X size={16}/></button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 border-dashed">
                  <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><MapPin size={12}/> Titik Akhir (Cabang Tujuan)</label>
                  <select required value={newOrder.branchId} onChange={e => setNewOrder({...newOrder, branchId: e.target.value})} className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold text-blue-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="" disabled>Pilih Cabang Tujuan...</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <button type="submit" className="w-full mt-6 py-3.5 bg-slate-900 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all">
                  Buat Rute Pengiriman
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL REROUTE DARURAT */}
      <AnimatePresence>
        {rerouteForm.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-900 text-white">
                <h3 className="text-lg font-black flex items-center gap-2"><Route size={20} className="text-blue-400"/> Alihkan Rute</h3>
                <p className="text-xs text-slate-400 mt-1">Lakukan penyisipan rute darurat ke Cabang Lain.</p>
              </div>
              <form onSubmit={handleRerouteSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Lokasi Dialihkan Ke</label>
                  <select required value={rerouteForm.location} onChange={e => setRerouteForm({...rerouteForm, location: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="" disabled>Pilih Fasilitas Cabang Pengalihan...</option>
                    {branches.map(b => <option key={b.id} value={b.name}>{b.name} ({b.type})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Alasan Pengalihan</label>
                  <textarea required rows="2" placeholder="Truk mengalami masalah jalan rusak, dsb..." value={rerouteForm.reason} onChange={e => setRerouteForm({...rerouteForm, reason: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setRerouteForm({isOpen: false, location: '', reason: ''})} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">Batal</button>
                  <button type="submit" className="flex-1 py-3 bg-slate-900 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors">Eksekusi Alihkan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL KONFIRMASI DITERIMA */}
      <AnimatePresence>
        {confirmReceiptModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Konfirmasi Penerimaan</h3>
              <p className="text-sm text-slate-600 font-medium mb-6">Apakah Anda yakin barang pesanan <span className="font-bold text-slate-900">{selectedOrder?.id}</span> telah sampai di tujuan akhir dan diverifikasi fisik?</p>
              
              <div className="flex gap-3">
                <button onClick={() => setConfirmReceiptModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">Batal</button>
                <button onClick={executeConfirmReceipt} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-colors">Ya, Konfirmasi</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL KONFIRMASI TRANSIT SELESAI */}
      <AnimatePresence>
        {confirmTransitModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Selesaikan Transit</h3>
              <p className="text-sm text-slate-600 font-medium mb-6">Apakah proses bongkar muat di <span className="font-bold text-slate-900">{firstPendingNode?.location}</span> sudah selesai dan truk siap berangkat ke tujuan berikutnya?</p>
              
              <div className="flex gap-3">
                <button onClick={() => setConfirmTransitModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">Batal</button>
                <button onClick={executeApproveTransit} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors">Ya, Berangkatkan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}