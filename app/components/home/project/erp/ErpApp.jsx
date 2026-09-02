"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Database, Route, X, Bell, User, LogOut, Menu, Network, Truck } from 'lucide-react';

import DashboardView from './views/DashboardView';
import MasterDataView from './views/MasterDataView';
import TrackingView from './views/TrackingView';

export default function ErpApp({ onClose }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // STATE NOTIFIKASI
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-[9999999] bg-slate-50 font-sans flex overflow-hidden text-slate-900"
    >
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Network size={20} className="text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">Nexus<span className="text-blue-600">ERP</span></span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 mt-2">Menu Utama</p>
          
          <button onClick={() => handleTabSwitch('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
            <LayoutDashboard size={18}/> Dashboard
          </button>
          
          <button onClick={() => handleTabSwitch('master')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === 'master' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
            <Database size={18}/> Master Data
          </button>
          
          <button onClick={() => handleTabSwitch('tracking')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === 'tracking' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
            <Route size={18}/> Supply Chain & Track
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="rounded-xl p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center overflow-hidden shrink-0">
               <User className="text-blue-600" size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">Anonymous</p>
              <p className="text-[11px] font-medium text-slate-500 truncate">Manager Reg. Malang</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full w-full relative bg-slate-50/50">
        
        <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md relative z-40">
          
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Network size={16} className="text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900">Nexus<span className="text-blue-600">ERP</span></span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-emerald-200">Live Demo</span>
            <span className="text-slate-400 text-sm font-medium">/ Modul Logistik Interaktif</span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* WRAPPER NOTIFIKASI */}
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${showNotif ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              
              <AnimatePresence>
                {showNotif && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-50">
                    <div className="flex justify-between items-center p-3 border-b border-slate-100">
                      <h4 className="font-bold text-slate-900 text-sm">Notifikasi Terkini</h4>
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">1 Baru</span>
                    </div>
                    <div className="p-2 space-y-1">
                      <div className="flex gap-3 p-3 bg-blue-50/50 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-blue-100">
                        <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Truck size={14}/>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 mb-0.5 leading-tight">Pengiriman Mendekat</p>
                          <p className="text-xs text-slate-600 leading-relaxed">Ekspedisi PO-2609-001 menuju Cabang Utama Malang diestimasi tiba dalam <span className="font-bold text-rose-600">2 jam</span>.</p>
                          <span className="text-[10px] font-bold text-slate-400 mt-2 block">BARU SAJA</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button onClick={onClose} className="hidden sm:flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm">
              <LogOut size={16} /> Exit Live Project
            </button>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden flex items-center justify-center w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl flex flex-col p-4 gap-2 md:hidden z-50">
                <button onClick={() => handleTabSwitch('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}><LayoutDashboard size={18}/> Dashboard</button>
                <button onClick={() => handleTabSwitch('master')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${activeTab === 'master' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}><Database size={18}/> Master Data</button>
                <button onClick={() => handleTabSwitch('tracking')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${activeTab === 'tracking' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}><Route size={18}/> Supply Chain</button>
                <div className="h-[1px] w-full bg-slate-100 my-2"></div>
                <button onClick={onClose} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 text-rose-600 font-bold border border-rose-100"><LogOut size={18}/> Keluar Demo</button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <motion.div key="dash" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="h-full"><DashboardView /></motion.div>}
            {activeTab === 'master' && <motion.div key="mast" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="h-full"><MasterDataView /></motion.div>}
            {activeTab === 'tracking' && <motion.div key="track" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="h-full"><TrackingView /></motion.div>}
          </AnimatePresence>
        </div>

      </main>
    </motion.div>
  );
}