"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, User, MapPin } from 'lucide-react';

import BookingView from './views/BookingView';
import RiwayatView from './views/RiwayatView';
import LocationView from './views/LocationView';
import ContactView from './views/ContactView';

export default function RentalApp({ onClose }) {
  const [activeTab, setActiveTab] = useState('Booking');
  const tabs = ['Booking', 'Riwayat', 'Location', 'Contact'];
  
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  // EFEK 1: Menghilangkan Scroll Body Utama
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // EFEK 2: Menutup Notifikasi jika klik area di luarnya (Click Outside)
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

  const getGrandOpeningDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 10);
    return today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999999] bg-slate-50 flex items-center justify-center font-sans">
      
      <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }} transition={{ duration: 0.3, ease: "easeOut" }} className="w-full h-[100dvh] bg-slate-50 relative overflow-hidden flex flex-col">
        
        {/* TOP BAR */}
        <header className="px-4 md:px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200 z-50 shrink-0 relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white italic shrink-0">LJ</div>
            <h1 className="text-slate-900 font-bold text-lg tracking-tight hidden sm:block">LJ Futsal</h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* WRAPPER NOTIFIKASI DENGAN REF */}
            <div className="relative" ref={notifRef}>
              {/* TOMBOL NOTIFIKASI (Sekarang tampil di mobile juga) */}
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className={`relative p-2 rounded-full transition-colors ${showNotif ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
              </button>
              
              {/* CARD NOTIFIKASI (Tengah di Mobile, Kanan di PC) */}
              <AnimatePresence>
                {showNotif && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="fixed top-16 left-1/2 -translate-x-1/2 md:absolute md:top-full md:left-auto md:-translate-x-0 md:right-0 mt-3 w-[90vw] md:w-80 max-w-[340px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-[99999]"
                  >
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900">Pemberitahuan</h4>
                      <span className="text-[10px] bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full">1 Baru</span>
                    </div>
                    <div className="flex gap-3 items-start p-3 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 mb-1">Grand Opening Cabang Semarang</h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Nantikan pembukaan cabang baru kami di Semarang pada <span className="font-bold text-blue-700">{getGrandOpeningDate()}</span>. Dapatkan promo diskon booking 50%!
                        </p>
                        <p className="text-[9px] text-slate-400 mt-2 font-medium">Baru saja</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-200">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Selamat datang,</p>
                <p className="text-sm font-bold text-slate-900 leading-tight">Anonymous</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
            </div>
            
            {/* TOMBOL EXIT DESKTOP */}
            <button 
              onClick={onClose} 
              className="hidden md:flex items-center gap-2 bg-rose-600 text-white hover:bg-rose-500 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] shrink-0"
            >
              <X size={16} /> Exit Live Project
            </button>
            
            {/* TOMBOL EXIT MOBILE */}
            <button 
              onClick={onClose} 
              className="md:hidden flex items-center gap-1.5 bg-rose-600 text-white hover:bg-rose-500 px-3 py-2 rounded-lg font-bold text-sm transition-all shadow-[0_0_10px_rgba(225,29,72,0.3)] shrink-0"
            >
              <X size={16} /> Exit
            </button>

          </div>
        </header>

        {/* SUB NAVIGATION */}
        <div className="flex overflow-x-auto custom-scrollbar border-b border-slate-200 bg-white shrink-0 px-4 py-2 gap-2">
          {tabs.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-500 hover:bg-slate-100 border border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50">
          <AnimatePresence mode="wait">
            {/* Mengirim fungsi onGoToRiwayat ke BookingView */}
            {activeTab === 'Booking' && <BookingView key="booking" onGoToRiwayat={() => setActiveTab('Riwayat')} />}
            {activeTab === 'Riwayat' && <RiwayatView key="riwayat" />}
            {activeTab === 'Location' && <LocationView key="location" />}
            {activeTab === 'Contact' && <ContactView key="contact" />}
          </AnimatePresence>
        </div>

      </motion.div>
    </motion.div>
  );
}