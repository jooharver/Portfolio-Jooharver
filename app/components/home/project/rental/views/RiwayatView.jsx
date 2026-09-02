import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ReceiptText, CheckCircle2 } from 'lucide-react';
import { useRentalStore } from '../rentalStore';

export default function RiwayatView() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const historyData = useRentalStore(state => state.history);

  return (
    <div className="h-full relative">
      <AnimatePresence mode="wait">
        {!selectedInvoice ? (
          // TAMPILAN DAFTAR RIWAYAT (1 Kolom)
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="w-full h-full overflow-y-auto custom-scrollbar"
          >
            {/* max-w-3xl agar 1 kolom tidak terlalu merenggang lebar */}
            <div className="p-6 pb-20 max-w-3xl mx-auto w-full space-y-6">
              <div className="mb-8 mt-2">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <ReceiptText size={28} className="text-blue-600" />
                  Riwayat Transaksi
                </h2>
                <p className="text-sm text-slate-500 mt-2 font-medium">Daftar reservasi lapangan yang pernah Anda lakukan.</p>
              </div>

              {historyData.length === 0 ? (
                 <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
                   <p className="text-slate-500 font-medium">Belum ada riwayat transaksi.</p>
                 </div>
              ) : (
                // Mengubah grid 2 kolom menjadi flex-col (1 kolom urut ke bawah)
                <div className="flex flex-col gap-4">
                  {historyData.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedInvoice(item)}
                      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                        {/* Status Dinamis: Biru untuk Terkonfirmasi, Hijau untuk Selesai */}
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border tracking-widest uppercase ${
                          item.status === 'TERKONFIRMASI' 
                            ? 'bg-blue-50 text-blue-600 border-blue-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">LJ Futsal {item.branch}</h4>
                      <p className="text-sm text-slate-500 font-medium mb-4">{item.field} • {item.sessions.length} Jam</p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <span className="text-sm font-bold text-slate-900">Rp {item.total.toLocaleString('id-ID')}</span>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          Lihat Detail
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          // TAMPILAN DETAIL INVOICE
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }} 
            className="w-full h-full overflow-y-auto custom-scrollbar"
          >
            <div className="p-4 sm:p-6 pb-16 max-w-2xl mx-auto w-full flex flex-col">
              <button onClick={() => setSelectedInvoice(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors mb-4 w-fit shrink-0">
                <ChevronLeft size={18} /> Kembali ke Riwayat
              </button>

              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden shrink-0 mt-2">
                {/* Stamp Lunas / Confirmed Dinamis */}
                <div className={`absolute top-10 -right-10 rotate-45 border-4 font-black text-xl uppercase tracking-widest py-1 px-12 opacity-20 pointer-events-none ${
                  selectedInvoice.status === 'TERKONFIRMASI' ? 'border-blue-500 text-blue-500' : 'border-emerald-500 text-emerald-500'
                }`}>
                  {selectedInvoice.status === 'TERKONFIRMASI' ? 'CONFIRMED' : 'LUNAS'}
                </div>

                <div className="text-center mb-6 pb-6 border-b border-dashed border-slate-200">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">Pembayaran Berhasil</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedInvoice.timestamp}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-widest uppercase">{selectedInvoice.id}</p>
                </div>

                <div className="space-y-1">
                  {[
                    { label: 'Nama Pemesan', value: selectedInvoice.customerName },
                    { label: 'Email', value: selectedInvoice.customerEmail },
                    { label: 'Cabang', value: `LJ Futsal ${selectedInvoice.branch}` },
                    { label: 'Tanggal Booking', value: selectedInvoice.date },
                    { label: 'Lapangan', value: selectedInvoice.field },
                    { label: 'Metode Pembayaran', value: selectedInvoice.paymentMethod }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-50 py-2.5">
                      <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{item.label}</span>
                      <span className="text-slate-900 text-sm font-bold text-right">{item.value}</span>
                    </div>
                  ))}

                  <div className="flex justify-between items-start border-b border-slate-50 py-3">
                    <span className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Waktu Sesi</span>
                    <div className="flex flex-wrap justify-end gap-1.5 max-w-[60%]">
                      {selectedInvoice.sessions.map(s => (
                        <span key={s} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                          {s} WIB
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <span className="text-slate-900 font-black text-sm uppercase tracking-tight">Total Dibayar</span>
                    <span className="text-2xl font-black text-blue-600">Rp {selectedInvoice.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}