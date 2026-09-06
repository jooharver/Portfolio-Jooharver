"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PackageSearch, FileBarChart2, X, Bell, User, LogOut, Menu } from 'lucide-react';
import DashboardView from './views/DashboardView';
import ItemsView from './views/ItemsView';
import ReportsView from './views/ReportsView';

export default function InventoryApp({ onClose }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // STATE NOTIFIKASI
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  // EFEK 1: MENGUNCI SCROLL HALAMAN UTAMA (INDUK)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // EFEK 2: CLICK-OUTSIDE UNTUK NOTIFIKASI
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    if (showNotif) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotif]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); 
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999999] bg-[#09090b] font-sans flex overflow-hidden"
    >
      {/* SIDEBAR - Hanya tampil di Tablet besar/Desktop */}
      <aside className="hidden md:flex w-64 bg-[#18181b] border-r border-zinc-800 flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b300ff] to-[#ffa67a] flex items-center justify-center">
              <PackageSearch size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Nexus<span className="text-zinc-500">Inv</span></span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => handleTabSwitch('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-[#27272a] text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}><LayoutDashboard size={20}/> Dashboard</button>
          <button onClick={() => handleTabSwitch('items')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'items' ? 'bg-[#27272a] text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}><PackageSearch size={20}/> Kelola Barang</button>
          <button onClick={() => handleTabSwitch('reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'reports' ? 'bg-[#27272a] text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}><FileBarChart2 size={20}/> Laporan</button>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="bg-zinc-900 rounded-xl p-4 flex items-center gap-3 border border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
               <User className="text-zinc-400" size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Anonymous</p>
              <p className="text-xs text-zinc-500 truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full bg-[#09090b] w-full relative">
        
        {/* TOPBAR */}
        <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-md relative z-40">
          
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b300ff] to-[#ffa67a] flex items-center justify-center">
              <PackageSearch size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Nexus<span className="text-zinc-500">Inv</span></span>
          </div>

          <div className="hidden md:block text-zinc-400 text-sm">
            Mode Live Demo (Tanpa Login)
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* WRAPPER NOTIFIKASI */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotif(!showNotif)} className="flex w-9 h-9 md:w-10 md:h-10 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center text-zinc-400 hover:text-white transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#09090b]"></span>
              </button>
              
              <AnimatePresence>
                {showNotif && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                    transition={{ duration: 0.15 }}
                    // Di Mobile: Mengambang di tengah. Di PC: Dropdown di bawah icon.
                    className="fixed top-16 left-1/2 -translate-x-1/2 md:absolute md:top-full md:left-auto md:-translate-x-0 md:right-0 mt-2 w-[90vw] md:w-80 max-w-[340px] bg-[#18181b] border border-zinc-800 shadow-2xl rounded-2xl p-4 z-[99999]"
                  >
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-zinc-800">
                      <h4 className="font-bold text-white text-sm">Notifikasi Terkini</h4>
                      <span className="text-[10px] bg-[#b300ff]/20 text-[#b300ff] font-bold px-2 py-0.5 rounded-full">1 Baru</span>
                    </div>
                    <div className="flex gap-3 items-start p-3 bg-zinc-900/50 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer border border-zinc-800/50">
                      <div className="mt-0.5 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <PackageSearch size={14}/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5 leading-tight">Stok Menipis</p>
                        <p className="text-xs text-zinc-400 leading-relaxed">Stok <span className="font-bold text-emerald-400">Lenovo Legion 5</span> tersisa 2 unit. Segera lakukan restock.</p>
                        <span className="text-[10px] font-bold text-zinc-500 mt-2 block">BARU SAJA</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Tombol Exit Desktop */}
            <button onClick={onClose} className="hidden md:flex items-center gap-2 bg-rose-600 text-white hover:bg-rose-500 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)]">
              <LogOut size={16} /> Exit Live Project
            </button>

            {/* Tombol Exit Mobile */}
            <button onClick={onClose} className="md:hidden flex items-center gap-1.5 bg-rose-600 text-white hover:bg-rose-500 px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_10px_rgba(225,29,72,0.3)]">
              <LogOut size={16} /> Exit
            </button>

            {/* Hamburger Button Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Dropdown Menu Mobile */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 w-full bg-[#18181b] border-b border-zinc-800 shadow-2xl flex flex-col p-4 gap-2 md:hidden z-50"
              >
                <button onClick={() => handleTabSwitch('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'dashboard' ? 'bg-[#27272a] text-white' : 'text-zinc-400'}`}><LayoutDashboard size={20}/> Dashboard</button>
                <button onClick={() => handleTabSwitch('items')} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'items' ? 'bg-[#27272a] text-white' : 'text-zinc-400'}`}><PackageSearch size={20}/> Kelola Barang</button>
                <button onClick={() => handleTabSwitch('reports')} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'reports' ? 'bg-[#27272a] text-white' : 'text-zinc-400'}`}><FileBarChart2 size={20}/> Laporan</button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* SCROLLABLE VIEW AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'items' && <ItemsView />}
          {activeTab === 'reports' && <ReportsView />}
        </div>
      </main>
    </motion.div>
  );
}