import { motion } from 'framer-motion';
import { Phone, Mail, AtSign, MessageCircle, Info, ExternalLink } from 'lucide-react';

export default function ContactView() {
  const contacts = [
    { 
      id: 'mlg', 
      name: 'LJ Futsal Malang', 
      wa: '+62 812-3456-7890', 
      ig: '@ljfutsal.malang', 
      email: 'malang@ljfutsal.com',
      active: true 
    },
    { 
      id: 'sby', 
      name: 'LJ Futsal Surabaya', 
      wa: '+62 813-4567-8901', 
      ig: '@ljfutsal.surabaya', 
      email: 'surabaya@ljfutsal.com',
      active: true 
    },
    { 
      id: 'jkt', 
      name: 'LJ Futsal Jakarta', 
      wa: '+62 814-5678-9012', 
      ig: '@ljfutsal.jakarta', 
      email: 'jakarta@ljfutsal.com',
      active: true 
    },
    { 
      id: 'smg', 
      name: 'LJ Futsal Semarang', 
      active: false 
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full h-full overflow-y-auto custom-scrollbar"
    >
      <div className="p-6 pb-20 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header Section */}
        <div className="mb-8 mt-2">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <MessageCircle size={28} className="text-blue-600" />
            Hubungi Kami
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium max-w-2xl">
            Ada pertanyaan terkait reservasi lapangan atau penyewaan rutin bulanan? Jangan ragu untuk menghubungi layanan pelanggan di masing-masing cabang.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map(c => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
              
              <h4 className={`text-xl font-black mb-6 pb-4 border-b border-slate-100 ${c.active ? 'text-slate-900' : 'text-slate-400'}`}>
                {c.name}
              </h4>

              {c.active ? (
                <div className="space-y-4">
                  {/* WhatsApp (Emerald Hover) */}
                  <div 
                    onClick={() => window.open('https://whatsapp.com', '_blank', 'noopener,noreferrer')}
                    className="group/item flex items-center justify-between p-3 rounded-2xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-200 cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors rounded-full flex items-center justify-center">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 group-hover/item:text-emerald-500 transition-colors uppercase tracking-widest">WhatsApp</p>
                        <p className="text-sm font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors">{c.wa}</p>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-emerald-500 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                  </div>

                  {/* Instagram (Pink Hover) */}
                  <div 
                    onClick={() => window.open('https://instagram.com', '_blank', 'noopener,noreferrer')}
                    className="group/item flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50 transition-all border border-transparent hover:border-pink-200 cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 text-pink-600 group-hover/item:bg-pink-500 group-hover/item:text-white transition-colors rounded-full flex items-center justify-center">
                        <AtSign size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 group-hover/item:text-pink-500 transition-colors uppercase tracking-widest">Instagram</p>
                        <p className="text-sm font-bold text-slate-800 group-hover/item:text-pink-700 transition-colors">{c.ig}</p>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-pink-500 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                  </div>

                  {/* Email (Blue Hover) */}
                  <div 
                    onClick={() => window.open('https://accounts.google.com', '_blank', 'noopener,noreferrer')}
                    className="group/item flex items-center justify-between p-3 rounded-2xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200 cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors rounded-full flex items-center justify-center">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 group-hover/item:text-blue-500 transition-colors uppercase tracking-widest">Email</p>
                        <p className="text-sm font-bold text-slate-800 group-hover/item:text-blue-700 transition-colors">{c.email}</p>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-blue-500 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Info size={32} className="text-slate-300 mb-3" />
                  <span className="bg-slate-200 text-slate-500 font-black px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase">
                    Coming Soon
                  </span>
                  <p className="text-xs font-medium text-slate-400 mt-3 text-center px-6">Informasi kontak akan tersedia saat cabang resmi dibuka.</p>
                </div>
              )}
              
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}