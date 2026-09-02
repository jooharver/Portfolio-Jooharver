"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PackageSearch, FileBarChart2, X, Bell, User, LogOut, Menu } from 'lucide-react';
import DashboardView from './views/DashboardView';
import ItemsView from './views/ItemsView';
import ReportsView from './views/ReportsView';

export default function InventoryApp({ onClose }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // EFEK UNTUK MENGUNCI SCROLL HALAMAN UTAMA (INDUK)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Otomatis tutup menu di HP setelah klik
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
          
          {/* Logo Mobile (Ganti tulisan header di HP) */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b300ff] to-[#ffa67a] flex items-center justify-center">
              <PackageSearch size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Nexus<span className="text-zinc-500">Inv</span></span>
          </div>

          {/* Keterangan Desktop */}
          <div className="hidden md:block text-zinc-400 text-sm">
            Mode Live Demo (Tanpa Login)
          </div>
          
          <div className="flex items-center gap-3">
            {/* Tombol Desktop */}
            <button className="hidden md:flex w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Bell size={18} />
            </button>
            <button onClick={onClose} className="hidden md:flex items-center gap-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 px-4 py-2 rounded-full text-sm font-semibold transition-all">
              <LogOut size={16} /> Exit Live Project
            </button>

            {/* Hamburger Button Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              Menu
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
                <div className="h-[1px] w-full bg-zinc-800 my-2"></div>
                <button onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 font-semibold"><LogOut size={20}/> Exit Live Project</button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* SCROLLABLE VIEW AREA - Padding dikecilkan untuk mobile */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'items' && <ItemsView />}
          {activeTab === 'reports' && <ReportsView />}
        </div>
      </main>
    </motion.div>
  );
}