import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Lock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function LeaveView({ type, setActiveTab }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const dummyData = [
    { 
      id: 1, 
      startDate: '12 Ags 2026', 
      endDate: '14 Ags 2026', 
      reason: type === 'Sakit' ? 'Demam Berdarah' : 'Cuti Tahunan', 
      detail: type === 'Sakit' 
        ? 'Berdasarkan hasil lab klinik, diwajibkan istirahat total selama 3 hari pemulihan. Surat dokter terlampir.' 
        : 'Mengambil jatah cuti tahunan untuk agenda liburan keluarga ke luar kota.', 
      status: 'Disetujui' 
    },
    { 
      id: 2, 
      startDate: '05 Jul 2026', 
      endDate: '05 Jul 2026', 
      reason: type === 'Sakit' ? 'Migrain Berat' : 'Acara Keluarga', 
      detail: type === 'Sakit' 
        ? 'Mengalami sakit kepala sebelah (migrain) kronis sejak pagi. Tidak memungkinkan menatap monitor, izin istirahat 1 hari.' 
        : 'Meminta izin cuti 1 hari untuk menghadiri acara pernikahan saudara kandung di Yogyakarta.', 
      status: 'Disetujui' 
    },
  ];

  const filteredData = dummyData.filter(d => 
    d.reason.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
    d.startDate.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    d.endDate.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      
      {/* MODAL FORM / DETAIL PENGAJUAN */}
      {(showForm || selectedItem) && (
        <div className="absolute inset-0 z-50 bg-[#09090b] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          
          <div className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between bg-[#09090b] shrink-0 w-full">
            <h3 className="text-white font-bold">{selectedItem ? 'Detail Pengajuan' : `Form ${type}`}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-5 custom-scrollbar pb-32 w-full">
            
            {/* INPUT TANGGAL: Disusun Vertikal (Atas-Bawah) agar 100% aman di layar HP */}
            <div className="flex flex-col gap-5 w-full">
              <div className="space-y-1 w-full">
                <label className="text-xs text-zinc-400">Tanggal Mulai</label>
                <input 
                  type={selectedItem ? "text" : "date"} 
                  readOnly={!!selectedItem} 
                  defaultValue={selectedItem?.startDate || ''}
                  className={`w-full max-w-full block appearance-none bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none ${selectedItem ? 'opacity-70' : 'focus:border-emerald-500'}`} 
                />
              </div>
              <div className="space-y-1 w-full">
                <label className="text-xs text-zinc-400">Tanggal Selesai</label>
                <input 
                  type={selectedItem ? "text" : "date"} 
                  readOnly={!!selectedItem} 
                  defaultValue={selectedItem?.endDate || ''}
                  className={`w-full max-w-full block appearance-none bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none ${selectedItem ? 'opacity-70' : 'focus:border-emerald-500'}`} 
                />
              </div>
            </div>

            <div className="space-y-1 w-full">
              <label className="text-xs text-zinc-400">Keterangan Lengkap</label>
              <textarea 
                rows={3} 
                readOnly={!!selectedItem}
                defaultValue={selectedItem?.detail || ''}
                placeholder="Tulis alasan detail..." 
                className={`w-full max-w-full block appearance-none bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none ${selectedItem ? 'opacity-70' : 'focus:border-emerald-500'}`} 
              />
            </div>
            
            <div className="space-y-1 w-full">
              <label className="text-xs text-zinc-400">Lampiran Bukti (Surat Dokter/Dll)</label>
              <div className="relative w-full h-32 bg-[#121214] border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center opacity-50 cursor-not-allowed overflow-hidden">
                <Lock size={24} className="text-zinc-500 mb-2 shrink-0" />
                <span className="text-xs text-zinc-500 font-medium text-center px-4">Fitur Lampiran Terkunci</span>
                <span className="text-[10px] text-zinc-600 px-8 text-center mt-1">Memerlukan koneksi ke Database Backend API (AWS S3 / Supabase).</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 bg-[#09090b] border-t border-zinc-800 flex gap-3 shrink-0">
            <button 
              onClick={() => { setShowForm(false); setSelectedItem(null); }} 
              className="flex-1 bg-zinc-800 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
            >
              Kembali
            </button>
            {!selectedItem && (
              <button disabled className="flex-1 bg-emerald-600/50 text-white py-3 rounded-xl text-sm font-semibold cursor-not-allowed">
                Kirim Pengajuan
              </button>
            )}
          </div>
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
                  <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md shrink-0">
                    <CheckCircle2 size={12} />
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