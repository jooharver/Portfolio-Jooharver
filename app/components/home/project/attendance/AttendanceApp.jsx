"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Camera, Clock, Bell, User, X, CheckCircle, MailWarning, FileCheck2, LogOut } from 'lucide-react';
import DashboardView from './views/DashboardView';
import CameraView from './views/CameraView';
import HistoryView from './views/HistoryView';
import LeaveView from './views/LeaveView';
import FeatureLockedView from './views/FeatureLockedView';

export default function AttendanceApp({ onClose }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [showNotifications, setShowNotifications] = useState(false);

  // EFEK UNTUK MENGUNCI SCROLL HALAMAN UTAMA (INDUK)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999999] bg-[#050505] flex items-center justify-center sm:p-4 font-sans">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999999999] flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-100 backdrop-blur-md shadow-2xl"
          >
            <CheckCircle size={20} className="text-emerald-400"/>
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOMBOL EXIT LIVE DEMO (DESKTOP) */}
      <button 
        onClick={onClose}
        className="hidden sm:flex absolute top-8 right-8 items-center gap-2 bg-rose-600 text-white hover:bg-rose-500 px-5 py-3 rounded-full transition-all font-semibold text-sm shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] z-50"
      >
        <LogOut size={18} />
        Exit Live Project
      </button>

      <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }} transition={{ duration: 0.3, ease: "easeOut" }} className="w-full h-[100dvh] sm:w-[390px] sm:h-[100vh] bg-[#09090b] sm:rounded-[2.5rem] sm:border-[8px] sm:border-zinc-900 shadow-2xl relative overflow-hidden flex flex-col">
        
        <AnimatePresence>
          {showNotifications && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setShowNotifications(false)}
            >
              <motion.div 
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                className="absolute top-20 left-4 right-4 bg-[#18181b] border border-zinc-800 rounded-2xl p-1 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()} 
              >
                <div className="px-4 py-3 border-b border-zinc-800/80 flex justify-between items-center">
                  <h3 className="text-white font-bold text-sm">Notifikasi</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-white"><X size={16}/></button>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  <div className="p-4 border-b border-zinc-800/50 flex gap-3 hover:bg-zinc-900/50 transition-colors">
                    <div className="mt-0.5"><FileCheck2 size={16} className="text-emerald-400" /></div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-0.5">Slip Gaji Agustus</h4>
                      <p className="text-xs text-zinc-400 mb-2">Slip gaji bulan Agustus 2026 sudah dapat diunduh di portal keuangan.</p>
                      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">HARI INI</span>
                    </div>
                  </div>
                  <div className="p-4 flex gap-3 hover:bg-zinc-900/50 transition-colors">
                    <div className="mt-0.5"><MailWarning size={16} className="text-amber-400" /></div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-0.5">Pesan Manajer HR</h4>
                      <p className="text-xs text-zinc-400 mb-2">Mohon segera perbarui kontak darurat di profil karyawan Anda.</p>
                      <span className="text-[9px] font-medium text-zinc-500">2 HARI YANG LALU</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER TOP BAR */}
        <header className="h-20 px-6 pt-6 pb-2 flex items-center justify-between bg-[#09090b] border-b border-zinc-800/50 absolute top-0 w-full z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 p-[2px]">
              <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center"><User size={18} className="text-white" /></div>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 font-medium">Selamat Pagi,</p>
              <h3 className="text-sm font-bold text-white leading-tight">Anonymous</h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotifications(true)} className="relative text-zinc-300 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#09090b]"></span>
            </button>
            {/* TOMBOL EXIT LIVE DEMO (MOBILE) */}
            <button 
              onClick={onClose} 
              className="sm:hidden flex items-center gap-1.5 bg-rose-600 text-white hover:bg-rose-500 px-3 py-1.5 rounded-full transition-all shadow-[0_0_10px_rgba(225,29,72,0.3)]"
            >
              <LogOut size={12} />
              <span className="text-[10px] font-bold">Exit Live Project</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pt-24 pb-28 custom-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <motion.div key="dash" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}><DashboardView setActiveTab={setActiveTab} /></motion.div>}
            {activeTab === 'camera' && <motion.div key="cam" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}}><CameraView setActiveTab={setActiveTab} showToast={showToast} /></motion.div>}
            {activeTab === 'history' && <motion.div key="hist" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}><HistoryView /></motion.div>}
            
            {activeTab === 'sakit' && <motion.div key="sakit" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="h-full"><LeaveView type="Sakit" setActiveTab={setActiveTab} /></motion.div>}
            {activeTab === 'cuti' && <motion.div key="cuti" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="h-full"><LeaveView type="Cuti" setActiveTab={setActiveTab} /></motion.div>}
            {activeTab === 'reimburse' && <motion.div key="reimb" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="h-full"><FeatureLockedView title="Reimburse" setActiveTab={setActiveTab} /></motion.div>}
            {activeTab === 'benefit' && <motion.div key="bene" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="h-full"><FeatureLockedView title="Benefit" setActiveTab={setActiveTab} /></motion.div>}
          </AnimatePresence>
        </div>

        <nav className="absolute bottom-0 w-full h-20 bg-[#18181b]/95 backdrop-blur-lg border-t border-zinc-800 flex items-center justify-between px-8 z-30 pb-2">
          <button onClick={() => setActiveTab('dashboard')} className="flex flex-col items-center gap-1 w-16"><Home size={24} className={activeTab === 'dashboard' ? 'text-emerald-400' : 'text-zinc-500'} /><span className={`text-[10px] font-medium ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-zinc-500'}`}>Beranda</span></button>
          <div className="relative -top-6">
            <button onClick={() => setActiveTab('camera')} className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center text-white shadow-[0_10px_25px_rgba(16,185,129,0.4)] hover:scale-105 transition-transform border-4 border-[#09090b]"><Camera size={28} /></button>
          </div>
          <button onClick={() => setActiveTab('history')} className="flex flex-col items-center gap-1 w-16"><Clock size={24} className={activeTab === 'history' ? 'text-emerald-400' : 'text-zinc-500'} /><span className={`text-[10px] font-medium ${activeTab === 'history' ? 'text-emerald-400' : 'text-zinc-500'}`}>Riwayat</span></button>
        </nav>
      </motion.div>
    </motion.div>
  );
}