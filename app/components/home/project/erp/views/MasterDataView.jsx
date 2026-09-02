import { useState } from 'react';
import { useErpStore } from '../erpStore';
import { Database, Box, Factory, Store, Plus, Edit2, Trash2, Settings2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MasterDataView() {
  const { items, vendors, branches, addEntity, updateEntity, deleteEntity, adjustStock } = useErpStore();
  
  // State untuk Modal
  const [modal, setModal] = useState({ isOpen: false, mode: 'add', type: 'items', data: null });
  const [formData, setFormData] = useState({});

  // Buka Modal Tambah/Edit
  const openModal = (mode, type, data = null) => {
    setModal({ isOpen: true, mode, type, data });
    setFormData(data || (
      type === 'items' ? { name: '', category: 'Sembako', stock: 0, price: 0 } :
      type === 'vendors' ? { name: '', type: 'Supplier Umum', rating: 5.0 } :
      { name: '', type: 'Supermarket Store', address: '' }
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modal.mode === 'add') {
      addEntity(modal.type, { ...formData, stock: Number(formData.stock), price: Number(formData.price), rating: Number(formData.rating) });
    } else {
      updateEntity(modal.type, modal.data.id, { ...formData, stock: Number(formData.stock), price: Number(formData.price), rating: Number(formData.rating) });
    }
    setModal({ isOpen: false });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 relative">
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2"><Database size={24} className="text-blue-600"/> Master Data Relasional</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Kelola entitas terpusat: Barang (SKU), Supplier, dan Cabang. Terdapat fitur CRUD lengkap.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM BARANG */}
        <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 border border-blue-200 text-blue-700 rounded-lg"><Box size={20}/></div>
              <h3 className="text-lg font-bold text-slate-900">Master SKU</h3>
            </div>
            <button onClick={() => openModal('add', 'items')} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"><Plus size={16}/></button>
          </div>
          <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
            {items.map(item => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-300 shadow-sm group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black tracking-widest text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-300">{item.id}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => adjustStock(item.id, 50)} title="Tambah Stok (+50)" className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md hover:bg-emerald-200"><Settings2 size={12}/></button>
                    <button onClick={() => openModal('edit', 'items', item)} className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"><Edit2 size={12}/></button>
                    <button onClick={() => deleteEntity('items', item.id)} className="p-1.5 bg-rose-100 text-rose-600 rounded-md hover:bg-rose-200"><Trash2 size={12}/></button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                <div className="flex justify-between items-end mt-2">
                  <p className="text-xs text-slate-600 font-medium">{item.category}</p>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded">Stok: {item.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KOLOM VENDOR */}
        <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 border border-purple-200 text-purple-700 rounded-lg"><Factory size={20}/></div>
              <h3 className="text-lg font-bold text-slate-900">Master Supplier</h3>
            </div>
            <button onClick={() => openModal('add', 'vendors')} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-colors"><Plus size={16}/></button>
          </div>
          <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
            {vendors.map(v => (
              <div key={v.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-300 shadow-sm group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black tracking-widest text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-300">{v.id}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal('edit', 'vendors', v)} className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"><Edit2 size={12}/></button>
                    <button onClick={() => deleteEntity('vendors', v.id)} className="p-1.5 bg-rose-100 text-rose-600 rounded-md hover:bg-rose-200"><Trash2 size={12}/></button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 text-sm truncate">{v.name}</h4>
                <div className="flex justify-between items-end mt-2">
                  <p className="text-xs text-slate-600 font-medium">{v.type}</p>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">⭐ {v.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KOLOM CABANG */}
        <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 border border-rose-200 text-rose-700 rounded-lg"><Store size={20}/></div>
              <h3 className="text-lg font-bold text-slate-900">Master Cabang</h3>
            </div>
            <button onClick={() => openModal('add', 'branches')} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors"><Plus size={16}/></button>
          </div>
          <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
            {branches.map(b => (
              <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-300 shadow-sm group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black tracking-widest text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-300">{b.id}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal('edit', 'branches', b)} className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"><Edit2 size={12}/></button>
                    <button onClick={() => deleteEntity('branches', b.id)} className="p-1.5 bg-rose-100 text-rose-600 rounded-md hover:bg-rose-200"><Trash2 size={12}/></button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                <div className="flex justify-between items-end mt-2 gap-2">
                  <p className="text-[10px] text-slate-500 leading-tight truncate flex-1">{b.address}</p>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded shrink-0">{b.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL FORM CRUD */}
      <AnimatePresence>
        {modal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-lg font-black text-slate-900">
                  {modal.mode === 'add' ? 'Tambah Data ' : 'Edit Data '} 
                  {modal.type === 'items' ? 'Barang' : modal.type === 'vendors' ? 'Supplier' : 'Cabang'}
                </h3>
                <button onClick={() => setModal({ isOpen: false })} className="text-slate-400 hover:text-rose-600"><X size={20}/></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Nama Entitas</label>
                  <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" placeholder="Masukkan Nama..." />
                </div>

                {modal.type === 'items' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Kategori</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none">
                          <option>Sembako</option><option>Dairy</option><option>Packaging</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Stok Awal</label>
                        <input type="number" min="0" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Harga Jual (Rp)</label>
                      <input type="number" min="0" value={formData.price || 0} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none" />
                    </div>
                  </>
                )}

                {modal.type === 'vendors' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Tipe Vendor</label>
                      <input required type="text" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Rating (1-5)</label>
                      <input type="number" step="0.1" min="1" max="5" value={formData.rating || 5} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none" />
                    </div>
                  </div>
                )}

                {modal.type === 'branches' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Tipe Fasilitas</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none">
                        <option>Supermarket Store</option><option>Distribution Center</option><option>Transit Hub</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Alamat Lengkap</label>
                      <textarea required rows="2" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none" />
                    </div>
                  </>
                )}

                <button type="submit" className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors">
                  Simpan Data
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}