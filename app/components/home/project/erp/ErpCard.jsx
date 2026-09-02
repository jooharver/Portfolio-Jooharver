"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Truck, Route, Box, Play } from "lucide-react";

export default function ERPCard({ onClick }) {
  return (
    <div 
      onClick={onClick}
      className="relative w-full h-full min-h-[400px] sm:min-h-[500px] bg-[#09090b] rounded-2xl border border-zinc-800 overflow-hidden group cursor-pointer"
    >
      
      {/* Desktop Image */}
      <Image 
        src="/erp-pc.jpg" 
        alt="NexusERP Presentation Desktop" 
        fill
        className="hidden md:block object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        priority
      />
      
      {/* Mobile Image */}
      <Image 
        src="/erp-mobile.jpg" 
        alt="NexusERP Presentation Mobile" 
        fill
        className="block md:hidden object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        priority
      />
      
      {/* Overlays Bawaan */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10 pointer-events-none opacity-100 group-hover:opacity-50 transition-opacity duration-500"></div>
      
      {/* OVERLAY KLIK LIVE DEMO */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
          <Play size={16} className="fill-white" />
          <span>Klik untuk mencoba Live Demo Project</span>
        </div>
      </div>

      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none z-40"></div>
      
      {/* FLOATING PROMOTIONAL BADGES */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-[10%] right-[5%] md:right-[5%] z-20 flex items-center gap-2 bg-[#18181b]/80 border border-blue-500/50 px-3 md:px-4 py-2 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)] backdrop-blur-md group-hover:opacity-0 transition-opacity duration-300"
      >
        <Route size={16} className="text-blue-400" />
        <span className="text-[10px] md:text-xs font-semibold text-white tracking-wide">Setup Rute Logistik</span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[15%] left-[5%] md:left-[5%] z-20 flex items-center gap-2 bg-[#18181b]/80 border border-emerald-500/50 px-3 md:px-4 py-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] backdrop-blur-md group-hover:opacity-0 transition-opacity duration-300"
      >
        <Truck size={16} className="text-emerald-400" />
        <span className="text-[10px] md:text-xs font-semibold text-white tracking-wide">Live Flow Tracking</span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[40%] right-[5%] md:right-[5%] z-20 flex items-center gap-2 bg-[#18181b]/80 border border-amber-500/50 px-3 md:px-4 py-2 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] backdrop-blur-md group-hover:opacity-0 transition-opacity duration-300"
      >
        <Box size={16} className="text-amber-400" />
        <span className="text-[10px] md:text-xs font-semibold text-white tracking-wide">Supply Chain Overview</span>
      </motion.div>

    </div>
  );
}