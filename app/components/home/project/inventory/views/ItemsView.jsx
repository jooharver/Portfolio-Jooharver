import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Eye, AlertTriangle, FileText, PackageMinus, ChevronLeft, ChevronRight, CheckCircle, Filter } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

const KATEGORI_OPTIONS = ['Laptop', 'Monitor', 'Komponen PC', 'Aksesoris'];
const ITEMS_PER_PAGE = 15;

const formatRupiahDisplay = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
const getStatus = (stock) => stock > 10 ? 'Aman' : stock > 0 ? 'Menipis' : 'Habis';

const formatNumberInput = (val) => {
  if (val === '' || val === null || val === undefined) return '';
  return new Intl.NumberFormat('id-ID').format(val);
};

export default function ItemsView() {
  const { items, addItem, updateItem, deleteItem } = useInventoryStore();
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // State untuk Fitur Filter Kategori
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Efek untuk menutup dropdown filter jika klik di luarnya
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mengekstrak daftar kategori unik dari data yang ada di Zustand
  const availableCategories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return ['Semua Kategori', ...Array.from(cats)];
  }, [items]);

  // Logika Filter Ganda: Pencarian (Search) + Dropdown Kategori
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(debouncedTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(debouncedTerm.toLowerCase());
      
      const matchCategory = selectedCategory === 'Semua Kategori' || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [items, debouncedTerm, selectedCategory]);

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  // Reset page ke 1 setiap kali filter atau pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedTerm, selectedCategory]);

  const currentItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });
  const [formData, setFormData] = useState({ name: '', category: 'Laptop', stock: '', price: '', description: '', selectedItemId: '', outQuantity: '' });

  const openModal = (type, data = null) => {
    setModalConfig({ isOpen: true, type, data });
    if (type === 'stockOut') {
      setFormData({ ...formData, selectedItemId: items.filter(i => i.stock > 0)[0]?.id || '', outQuantity: '' });
    } else if (data) {
      setFormData({ name: data.name, category: data.category, stock: data.stock, price: data.price, description: data.description || '' });
    } else {
      setFormData({ name: '', category: 'Laptop', stock: '', price: '', description: '' });
    }
  };

  const closeModal = () => setModalConfig({ isOpen: false, type: null, data: null });

  const handleNumberChange = (field, value) => {
    const rawValue = value.replace(/\D/g, ''); 
    setFormData({ ...formData, [field]: rawValue ? Number(rawValue) : '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalConfig.type === 'stockOut') {
      const targetItem = items.find(i => i.id === formData.selectedItemId);
      if (targetItem) {
        const newStock = Math.max(0, targetItem.stock - (formData.outQuantity || 0));
        updateItem(targetItem.id, { stock: newStock });
        showToast(`Berhasil mengeluarkan ${formData.outQuantity} unit ${targetItem.name}`);
      }
    } else {
      const finalData = {
        ...formData,
        stock: formData.stock === '' ? 0 : formData.stock,
        price: formData.price === '' ? 0 : formData.price,
      };
      if (modalConfig.type === 'add') {
        addItem(finalData);
        showToast('Barang berhasil ditambahkan!');
      }
      if (modalConfig.type === 'edit') {
        updateItem(modalConfig.data.id, finalData);
        showToast('Data barang berhasil diperbarui!');
      }
    }
    closeModal();
  };

  const executeDelete = () => {
    deleteItem(modalConfig.data.id); 
    showToast('Data barang berhasil dihapus!');
    closeModal();
  };

  const selectedStockOutItem = items.find(i => i.id === formData.selectedItemId);
  const maxStockOut = selectedStockOutItem ? selectedStockOutItem.stock : 0;

  return (
    <div className="space-y-6 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[9999999999] flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl border ${
              toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100' : 'bg-rose-950/90 border-rose-500/50 text-rose-100'
            } backdrop-blur-md`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} className="text-emerald-400"/> : <AlertTriangle size={20} className="text-rose-400"/>}
            <span className="font-medium text-sm md:text-base whitespace-nowrap">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Kelola Barang</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => openModal('stockOut')} className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-zinc-800 border border-zinc-700 px-3 md:px-4 py-2 rounded-xl text-white text-sm md:text-base font-semibold hover:bg-zinc-700 transition-colors">
            <PackageMinus size={18} className="md:w-5 md:h-5" /> Catat Keluar
          </button>
          <button onClick={() => openModal('add')} className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-gradient-to-r from-[#b300ff] to-[#ffa67a] px-3 md:px-4 py-2 rounded-xl text-white text-sm md:text-base font-semibold hover:scale-105 transition-transform">
            <Plus size={18} className="md:w-5 md:h-5" /> Tambah Data
          </button>
        </div>
      </div>

      <div className="bg-[#18181b] rounded-2xl border border-zinc-800 flex flex-col shadow-lg">
        
        {/* HEADER TABEL: Pencarian & Filter */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex flex-col md:flex-row gap-3 md:items-center justify-between rounded-t-2xl">
          
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari ID, Nama, Kategori..." 
              className="w-full bg-[#09090b] border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm md:text-base focus:outline-none focus:border-[#b300ff] transition-colors"
            />
          </div>

          <div className="relative w-full md:w-auto" ref={filterRef}>
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full md:w-auto flex items-center justify-between gap-3 px-4 py-2 bg-[#09090b] border border-zinc-700 hover:border-zinc-500 rounded-lg text-sm text-zinc-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Filter size={16} className="text-[#b300ff]" /> 
                {selectedCategory}
              </span>
              <ChevronRight size={16} className={`transform transition-transform ${showFilterDropdown ? 'rotate-90' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-full md:w-48 bg-[#18181b] border border-zinc-700 shadow-2xl rounded-xl overflow-hidden z-50"
                >
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {availableCategories.map((cat, idx) => (
                      <button 
                        key={idx}
                        onClick={() => { setSelectedCategory(cat); setShowFilterDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          selectedCategory === cat 
                            ? 'bg-[#27272a] text-white font-bold border-l-2 border-[#b300ff]' 
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border-l-2 border-transparent'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* BUNGKUSAN TABEL MELENGKUNG */}
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#09090b] text-zinc-400 text-xs md:text-sm">
                <th className="px-4 md:px-6 py-4 font-medium border-b border-zinc-800">ID Barang</th>
                <th className="px-4 md:px-6 py-4 font-medium border-b border-zinc-800">Nama Produk</th>
                <th className="px-4 md:px-6 py-4 font-medium border-b border-zinc-800">Kategori</th>
                <th className="px-4 md:px-6 py-4 font-medium border-b border-zinc-800">Stok</th>
                <th className="px-4 md:px-6 py-4 font-medium border-b border-zinc-800">Harga Satuan</th>
                <th className="px-4 md:px-6 py-4 font-medium border-b border-zinc-800">Status</th>
                <th className="px-4 md:px-6 py-4 font-medium border-b border-zinc-800 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm text-zinc-300">
              {currentItems.length > 0 ? currentItems.map((item) => (
                <tr key={item.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors last:border-0">
                  <td className="px-4 md:px-6 py-4 font-mono text-zinc-400">{item.id}</td>
                  <td className="px-4 md:px-6 py-4 font-medium text-white">{item.name}</td>
                  <td className="px-4 md:px-6 py-4">{item.category}</td>
                  <td className="px-4 md:px-6 py-4">{item.stock} unit</td>
                  <td className="px-4 md:px-6 py-4">{formatRupiahDisplay(item.price)}</td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-medium border ${
                      getStatus(item.stock) === 'Aman' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      getStatus(item.stock) === 'Menipis' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {getStatus(item.stock)}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => openModal('view', item)} className="text-zinc-400 hover:text-white transition-colors"><Eye size={18} /></button>
                      <button onClick={() => openModal('edit', item)} className="text-zinc-400 hover:text-blue-400 transition-colors"><Edit size={18} /></button>
                      <button onClick={() => openModal('delete', item)} className="text-zinc-400 hover:text-rose-400 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-zinc-500 text-sm">
                    {items.length === 0 ? "Belum ada data barang." : "Tidak ada barang yang cocok dengan filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-2xl">
          <span className="text-xs md:text-sm text-zinc-400">
            Page <span className="text-white font-medium">{currentPage}/{totalPages}</span> menampilkan <span className="text-white font-medium">{currentItems.length}/{totalItems}</span> barang.
          </span>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 md:p-2 rounded-lg bg-[#09090b] border border-zinc-700 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"><ChevronLeft size={18} className="md:w-5 md:h-5" /></button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 md:p-2 rounded-lg bg-[#09090b] border border-zinc-700 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"><ChevronRight size={18} className="md:w-5 md:h-5" /></button>
          </div>
        </div>
      </div>

      {/* MODAL MENGAMBANG */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99999999] flex items-center justify-center p-4">
          <div className={`relative bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-in fade-in zoom-in duration-200 ${modalConfig.type === 'delete' || modalConfig.type === 'stockOut' ? 'max-w-md' : 'max-w-2xl'}`}>
            <div className="p-4 md:p-6 border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-10">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                {modalConfig.type === 'delete' && <AlertTriangle className="text-rose-500" size={24} />}
                {modalConfig.type === 'stockOut' && <PackageMinus className="text-rose-400" size={24} />}
                {modalConfig.type === 'view' && <FileText className="text-[#b300ff]" size={24} />}
                {modalConfig.type === 'add' ? 'Tambah Barang' : modalConfig.type === 'edit' ? 'Edit Barang' : modalConfig.type === 'stockOut' ? 'Barang Keluar' : modalConfig.type === 'view' ? 'Spesifikasi Barang' : 'Konfirmasi Hapus'}
              </h3>
            </div>
            {modalConfig.type === 'delete' ? (
              <div className="p-4 md:p-6">
                <p className="text-sm md:text-base text-zinc-300">Apakah Anda yakin menghapus <strong className="text-white">{modalConfig.data?.name}</strong>?</p>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg text-zinc-300 bg-zinc-800 hover:bg-zinc-700">Batal</button>
                  <button onClick={executeDelete} className="px-4 py-2 text-sm rounded-lg text-white bg-rose-600 hover:bg-rose-700">Ya, Hapus</button>
                </div>
              </div>
            ) : modalConfig.type === 'stockOut' ? (
              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Pilih Barang</label>
                  <select required value={formData.selectedItemId} onChange={(e) => setFormData({...formData, selectedItemId: e.target.value})} className="w-full bg-[#09090b] border border-zinc-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-white focus:border-[#b300ff] focus:outline-none appearance-none">
                    {items.filter(i => i.stock > 0).map(item => (<option key={item.id} value={item.id}>{item.name} (Stok: {item.stock})</option>))}
                    {items.filter(i => i.stock > 0).length === 0 && <option value="" disabled>Semua barang habis</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Jumlah Dikeluarkan</label>
                  <input required type="text" value={formatNumberInput(formData.outQuantity)} onChange={(e) => { const rawValue = e.target.value.replace(/\D/g, ''); const numValue = Number(rawValue); if (numValue <= maxStockOut) setFormData({...formData, outQuantity: numValue || ''}); }} className="w-full bg-[#09090b] border border-zinc-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-white focus:border-[#b300ff] focus:outline-none" placeholder={`Maks: ${maxStockOut}`} />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm rounded-lg text-zinc-300 bg-zinc-800 hover:bg-zinc-700">Batal</button>
                  <button type="submit" disabled={!formData.selectedItemId || !formData.outQuantity} className="px-4 py-2 text-sm rounded-lg text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50">Kurangi Stok</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Nama Produk</label>
                      <input 
                        required 
                        disabled={modalConfig.type === 'view'} 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        placeholder="Contoh: ACER Nitro V15" 
                        className="w-full bg-[#09090b] border border-zinc-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-white disabled:opacity-50 focus:border-[#b300ff] focus:outline-none placeholder-zinc-600" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Kategori</label>
                      <select required disabled={modalConfig.type === 'view'} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[#09090b] border border-zinc-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-white disabled:opacity-50 focus:border-[#b300ff] focus:outline-none appearance-none">
                        {KATEGORI_OPTIONS.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Stok Unit</label>
                        <input 
                          required 
                          disabled={modalConfig.type === 'view'} 
                          type="text" 
                          value={formatNumberInput(formData.stock)} 
                          onChange={(e) => handleNumberChange('stock', e.target.value)} 
                          placeholder="Misal: 50" 
                          className="w-full bg-[#09090b] border border-zinc-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-white disabled:opacity-50 focus:border-[#b300ff] focus:outline-none placeholder-zinc-600" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Harga (Rp)</label>
                        <input 
                          required 
                          disabled={modalConfig.type === 'view'} 
                          type="text" 
                          value={formatNumberInput(formData.price)} 
                          onChange={(e) => handleNumberChange('price', e.target.value)} 
                          placeholder="Misal: 15.000.000" 
                          className="w-full bg-[#09090b] border border-zinc-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-white disabled:opacity-50 focus:border-[#b300ff] focus:outline-none placeholder-zinc-600" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-full flex flex-col">
                      <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">
                        Deskripsi {modalConfig.type === 'add' && <span className="text-zinc-600 text-[10px] md:text-xs italic">(Opsional)</span>}
                      </label>
                      <textarea 
                        disabled={modalConfig.type === 'view'} 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        placeholder="Tuliskan detail spesifikasi atau keterangan tambahan produk di sini..." 
                        className="w-full flex-1 min-h-[120px] md:min-h-[150px] bg-[#09090b] border border-zinc-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-white disabled:opacity-50 focus:border-[#b300ff] focus:outline-none resize-none placeholder-zinc-600" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm rounded-lg text-zinc-300 bg-zinc-800 hover:bg-zinc-700">{modalConfig.type === 'view' ? 'Tutup Detail' : 'Batal'}</button>
                  {modalConfig.type !== 'view' && (<button type="submit" className="px-4 py-2 text-sm rounded-lg text-white bg-gradient-to-r from-[#b300ff] to-[#ffa67a] font-medium hover:scale-105">Simpan Data</button>)}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}