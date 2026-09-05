import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Lock, CheckCircle2, ChevronRight, AlertCircle, Maximize, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAttendanceStore } from '../store/useAttendanceStore';

export default function LeaveView({ type, setActiveTab }) {
  const { leaves, addLeave } = useAttendanceStore();
  
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  
  // State untuk Fitur Lihat Gambar Full Layar
  const [expandedImage, setExpandedImage] = useState(null);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    detail: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatDateInput = (dateString) => {
    if (!dateString) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = new Date(dateString);
    return `${("0" + d.getDate()).slice(-2)} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const newLeave = {
      id: Date.now(),
      type: type,
      startDate: formatDateInput(formData.startDate),
      endDate: formatDateInput(formData.endDate),
      reason: formData.reason,
      detail: formData.detail,
      status: 'Menunggu Konfirmasi',
      attachment: null // Data baru tidak memiliki attachment karena fitur upload dikunci
    };

    addLeave(newLeave);
    
    setFormData({ startDate: '', endDate: '', reason: '', detail: '' });
    setShowForm(false);
    setToastMsg('Pengajuan berhasil dikirim!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredData = leaves.filter(d => 
    d.type === type && (
      d.reason.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      d.startDate.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      d.endDate.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  );

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      
      {/* Toast Notification Lokal */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-100 backdrop-blur-md shadow-xl"
          >
            <CheckCircle2 size={16} className="text-emerald-400"/>
            <span className="font-medium text-xs whitespace-nowrap">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL GAMBAR FULLSCREEN (LIGHTBOX) - Diperbaiki agar tidak keluar frame HP di PC */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            /* FIX: Menggunakan absolute alih-alih fixed agar tetap terkurung di dalam frame HP */
            className="absolute inset-0 z-[999999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setExpandedImage(null)} 
          >
            {/* Tombol Exit Fullscreen di Pojok Kanan Atas */}
            <button 
              className="absolute top-4 right-4 p-2 bg-zinc-800/80 hover:bg-rose-600 text-zinc-300 hover:text-white rounded-full transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(null);
              }}
            >
              <X size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={expandedImage}
              alt="Lampiran Full"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {(showForm || selectedItem) && (
        <div className="absolute inset-0 z-50 bg-[#09090b] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          
          <div className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between bg-[#09090b] shrink-0 w-full">
            <h3 className="text-white font-bold">{selectedItem ? 'Detail Pengajuan' : `Form ${type}`}</h3>
          </div>
          
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-5 custom-scrollbar pb-32 w-full flex flex-col">
            
            <div className="space-y-1 w-full">
              <label className="text-xs text-zinc-400">Judul / Alasan Singkat</label>
              <input 
                required
                type="text" 
                readOnly={!!selectedItem} 
                value={selectedItem ? selectedItem.reason : formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                placeholder={`Misal: ${type === 'Sakit' ? 'Sakit Tipes' : 'Cuti Liburan'}`}
                className={`w-full max-w-full block appearance-none bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none ${selectedItem ? 'opacity-70' : 'focus:border-emerald-500'}`} 
              />
            </div>

            <div className="flex flex-col gap-5 w-full">
              <div className="space-y-1 w-full">
                <label className="text-xs text-zinc-400">Tanggal Mulai</label>
                {selectedItem ? (
                  <input type="text" readOnly value={selectedItem.startDate} className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none opacity-70" />
                ) : (
                  <input required type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500" />
                )}
              </div>
              <div className="space-y-1 w-full">
                <label className="text-xs text-zinc-400">Tanggal Selesai</label>
                {selectedItem ? (
                  <input type="text" readOnly value={selectedItem.endDate} className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none opacity-70" />
                ) : (
                  <input required type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500" />
                )}
              </div>
            </div>

            <div className="space-y-1 w-full flex-1 flex flex-col">
              <label className="text-xs text-zinc-400">Keterangan Lengkap</label>
              <textarea 
                required
                readOnly={!!selectedItem}
                value={selectedItem ? selectedItem.detail : formData.detail}
                onChange={(e) => setFormData({...formData, detail: e.target.value})}
                placeholder="Tulis detail alasan pengajuan..." 
                className={`w-full flex-1 min-h-[100px] max-w-full block appearance-none bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none ${selectedItem ? 'opacity-70' : 'focus:border-emerald-500'}`} 
              />
            </div>
            
            <div className="space-y-1 w-full pb-4">
              <label className="text-xs text-zinc-400">Lampiran Bukti (Surat Dokter/Dll)</label>
              
              {selectedItem ? (
                selectedItem.attachment ? (
                  <div 
                    onClick={() => setExpandedImage(selectedItem.attachment)}
                    className="relative w-full h-48 bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden cursor-pointer group hover:border-zinc-600 transition-colors"
                  >
                    {/* Gambar Lampiran */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={selectedItem.attachment} 
                      alt="Lampiran" 
                      className="w-full h-full object-contain p-2" 
                    />
                    
                    {/* FIX: Tombol Maximize selalu aktif di pojok kanan atas */}
                    <div className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-md group-hover:bg-black/90 transition-colors">
                      <Maximize size={16} />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-20 bg-[#18181b] border border-zinc-800 rounded-xl flex items-center justify-center opacity-70">
                    <span className="text-xs text-zinc-500">Tidak ada lampiran disertakan</span>
                  </div>
                )
              ) : (
                <div className="relative w-full h-24 bg-[#121214] border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center opacity-50 cursor-not-allowed overflow-hidden">
                  <Lock size={20} className="text-zinc-500 mb-1 shrink-0" />
                  <span className="text-[10px] text-zinc-500 font-medium text-center px-4">Fitur Lampiran Terkunci</span>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 bg-[#09090b] border-t border-zinc-800 flex gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => { setShowForm(false); setSelectedItem(null); setFormData({startDate: '', endDate: '', reason: '', detail: ''}); }} 
                className="flex-1 bg-zinc-800 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
              >
                Kembali
              </button>
              {!selectedItem && (
                <button 
                  type="submit"
                  disabled={!formData.startDate || !formData.endDate || !formData.reason || !formData.detail}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Kirim Pengajuan
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* HEADER UTAMA */}
      <div className="px-6 pb-4 border-b border-zinc-800/50 flex items-center justify-between shrink-0 w-full">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 -ml-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white shrink-0">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-bold text-white">Layanan {type}</h2>
        <div className="w-8 shrink-0" />
      </div>

      <div className="px-6 mt-4 flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden w-full">
        
        <button 
          onClick={() => setShowForm(true)} 
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-3.5 rounded-xl flex items-center justify-center gap-2 font-bold mb-4 shadow-[0_5px_20px_rgba(16,185,129,0.2)] hover:scale-[1.02] transition-transform shrink-0"
        >
          <Plus size={18} /> Ajukan {type} Baru
        </button>

        <div className="flex bg-[#18181b] border border-zinc-800 rounded-xl px-4 items-center gap-2 mb-6 shrink-0 w-full">
          <Search size={16} className="text-zinc-500 shrink-0" />
          <input 
            type="text" 
            placeholder={`Cari riwayat ${type.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white w-full py-3 min-w-0 appearance-none" 
          />
        </div>

        <div className="space-y-3 pb-6 w-full">
          {filteredData.length > 0 ? filteredData.map((d) => (
            <div 
              key={d.id} 
              onClick={() => setSelectedItem(d)}
              className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 transition-colors rounded-xl p-4 cursor-pointer flex justify-between items-center w-full overflow-hidden"
            >
              <div className="w-full pr-3 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2 w-full">
                  <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-1 rounded-md shrink-0">
                    {d.startDate === d.endDate ? d.startDate : `${d.startDate} - ${d.endDate}`}
                  </span>
                  
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md shrink-0 ${
                    d.status === 'Disetujui' ? 'bg-emerald-500/10 text-emerald-400' : 
                    d.status === 'Ditolak' ? 'bg-rose-500/10 text-rose-400' : 
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {d.status === 'Disetujui' ? <CheckCircle2 size={12} /> : d.status === 'Menunggu Konfirmasi' ? <AlertCircle size={12} /> : null}
                    <span className="text-[10px] font-bold truncate">{d.status}</span>
                  </div>
                </div>
                <h4 className="text-white text-sm font-semibold truncate w-full">{d.reason}</h4>
              </div>
              <ChevronRight size={20} className="text-zinc-600 shrink-0" />
            </div>
          )) : (
            <div className="text-center text-zinc-500 text-xs py-10 border border-dashed border-zinc-800 rounded-xl">Data tidak ditemukan.</div>
          )}
        </div>
      </div>
    </div>
  );
}