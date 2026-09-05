"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Store, User, Bell, LogOut, Package, Inbox } from 'lucide-react';
import { useMarketplaceStore } from './marketplaceStore';

import ClientView from './views/ClientView';
import SellerView from './views/SellerView';

export default function MarketplaceApp({ onClose }) {
  const { cart, setClientView, setSearchQuery } = useMarketplaceStore();
  const [activeRole, setActiveRole] = useState('client'); 
  
  const [localSearch, setLocalSearch] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => { 
      document.body.style.overflow = ''; 
      document.documentElement.style.overflow = ''; 
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    if(role === 'client') {
      setClientView('home');
      setLocalSearch(''); 
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.4 }} className="fixed inset-0 z-[9999999] bg-[#F9F8F6] font-sans flex flex-col overflow-hidden text-[#1C2C24]">
      
      {/* TOP BAR */}
      <div className="bg-[#1C2C24] text-[#C2BBAF] text-[11px] font-medium py-1.5 px-3 md:px-8 flex justify-between items-center z-50">
        <div className="flex gap-4 shrink-0">
          {/* FIX: Toggle Role 2 Arah */}
          <button 
            onClick={() => handleRoleSwitch(activeRole === 'client' ? 'seller' : 'client')} 
            className="hover:text-[#F4F1EA] transition-colors"
          >
            {activeRole === 'client' ? 'Mode Seller' : 'Mode Belanja'}
          </button>
        </div>
        
        <div className="flex gap-3 md:gap-4 items-center relative">
          <div ref={notifRef} className="relative">
            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="flex items-center gap-1 hover:text-[#F4F1EA] cursor-pointer transition-colors">
              <Bell size={12}/> <span className="hidden sm:inline">Notifikasi</span>
            </button>
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#EBEAE5] z-50 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-[#F4F1EA] rounded-full flex items-center justify-center text-[#9BA8A1] mb-3"><Inbox size={20}/></div>
                  <h4 className="font-bold text-[#1C2C24] text-sm">Tidak ada pemberitahuan</h4>
                  <p className="text-xs text-[#78857E] mt-1">Pemberitahuan terbaru akan muncul di sini.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FIX: Pesanan Saya Dimunculkan di Mobile */}
          <button onClick={() => { handleRoleSwitch('client'); setClientView('orders'); }} className="flex items-center gap-1 hover:text-[#F4F1EA] cursor-pointer transition-colors text-center leading-tight">
            <Package size={12} className="shrink-0"/> 
            <span className="hidden sm:inline">Pesanan Saya</span>
            <span className="sm:hidden text-[10px]">Pesanan<br/>Saya</span>
          </button>
          
          <span className="text-[#5C6E63]">|</span>
          
          {/* TOMBOL EXIT DESKTOP */}
          <button onClick={onClose} className="hidden md:flex font-bold text-white bg-rose-600 hover:bg-rose-500 px-3 py-1.5 rounded-md items-center gap-1 transition-all shadow-[0_0_10px_rgba(225,29,72,0.3)] shrink-0">
            <LogOut size={12}/> Exit Live Project
          </button>
          
          {/* TOMBOL EXIT MOBILE (Teks Lebih Singkat) */}
          <button onClick={onClose} className="md:flex hidden font-bold text-white bg-rose-600 hover:bg-rose-500 px-2.5 py-1.5 rounded-[4px] items-center gap-1 transition-all shadow-[0_0_10px_rgba(225,29,72,0.3)] shrink-0" style={{ display: 'flex' }}>
            <LogOut size={12} className="md:hidden"/> 
            <span className="md:hidden">Exit</span>
          </button>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <header className="bg-white h-20 flex items-center px-4 md:px-8 gap-4 md:gap-8 border-b border-[#EBEAE5] z-50 sticky top-0 shadow-sm">
        
        {/* EFEK HOVER SCALE PADA LOGO */}
        <div className="flex items-center gap-2 text-[#1C2C24] shrink-0 cursor-pointer hover:scale-105 transition-transform origin-left" onClick={() => { handleRoleSwitch('client'); setLocalSearch(''); }}>
          <ShoppingBagIcon size={32} className="shrink-0" />
          <span className="font-black text-2xl tracking-tight hidden md:block uppercase">NEXUS<span className="font-light text-[#5C6E63]">MALL</span></span>
        </div>

        <div className="flex-1 max-w-4xl relative min-w-0"> 
          <input 
            type="text" 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            disabled={activeRole === 'seller'}
            placeholder={activeRole === 'client' ? "Cari koleksi pakaian..." : "Dinonaktifkan"} 
            className="w-full py-2.5 pl-4 pr-12 bg-[#F7F6F2] border border-[#EBEAE5] rounded-lg text-sm outline-none focus:border-[#1C2C24] focus:ring-1 focus:ring-[#1C2C24] transition-all text-[#1C2C24] disabled:opacity-50 text-ellipsis overflow-hidden" 
          />
          <button className="absolute right-1 top-1 bottom-1 bg-[#1C2C24] hover:bg-[#2A4034] text-white px-4 md:px-5 rounded-md transition-colors flex items-center justify-center shrink-0">
            <Search size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4 md:gap-5 text-[#5C6E63] shrink-0">
          <div className="relative cursor-pointer hover:text-[#1C2C24] transition-colors" onClick={() => { handleRoleSwitch('client'); setClientView('cart'); }}>
            <ShoppingCart size={24} />
            {cart.length > 0 && <span className="absolute -top-1.5 -right-2 bg-[#9B7E5D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{cart.length}</span>}
          </div>
          
          <div className="w-[1px] h-6 bg-[#EBEAE5] mx-1 hidden md:block"></div>

          <button onClick={() => handleRoleSwitch(activeRole === 'client' ? 'seller' : 'client')} className="hidden md:flex items-center gap-2 bg-white hover:bg-[#F4F1EA] border border-[#EBEAE5] px-4 py-2 rounded-lg text-sm font-bold transition-all text-[#1C2C24]">
            {activeRole === 'client' ? <><Store size={16}/> Mode Seller</> : <><ShoppingBagIcon size={16}/> Mode Belanja</>}
          </button>
          
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#F4F1EA] flex items-center justify-center border border-[#EBEAE5] cursor-pointer text-[#5C6E63] hover:text-[#1C2C24] transition-colors shrink-0"><User size={18} /></div>
        </div>
      </header>

      <main className="flex-1 flex overflow-y-auto custom-scrollbar bg-[#F9F8F6] relative">
        <AnimatePresence mode="wait">
          {activeRole === 'client' 
            ? <motion.div key="client" className="w-full" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}><ClientView /></motion.div> 
            : <motion.div key="seller" className="w-full flex" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}><SellerView /></motion.div>
          }
        </AnimatePresence>
      </main>
    </motion.div>
  );
}

function ShoppingBagIcon({ size = 24, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}