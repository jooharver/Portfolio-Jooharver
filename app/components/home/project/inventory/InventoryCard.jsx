"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Database, FileText, PieChart, Play } from "lucide-react";

export default function InventoryCard({ onClick }) {
  return (
    <div 
      onClick={onClick}
      className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-[#09090b] group cursor-pointer"
    >
      
      {/* 1. GAMBAR MOCKUP RESPONSIVE */}
      <Image
        src="/inventory-mobile.jpg"
        alt="NexusInv Mobile Preview"
        fill
        className="block md:hidden object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        priority
      />

      <Image
        src="/inventory-pc.jpg"
        alt="NexusInv Desktop Preview"
        fill
        className="hidden md:block object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        priority
      />

      {/* Overlay Gelap Tipis */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-[#09090b]/20 to-transparent z-10 pointer-events-none group-hover:opacity-50 transition-opacity duration-300" />

      {/* OVERLAY KLIK LIVE DEMO (NEW) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="bg-[#b300ff] text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-[0_0_30px_rgba(179,0,255,0.4)]">
          <Play size={16} className="fill-white" />
          <span>Klik untuk mencoba Live Demo Project</span>
        </div>
      </div>

      {/* 2. FLOATING PROMOTIONAL BADGES */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-[5%] md:top-[10%] right-[2%] md:-right-[2%] z-20 flex items-center gap-2 bg-[#18181b]/80 border border-[#b300ff]/50 px-3 md:px-4 py-2 rounded-full shadow-[0_0_20px_rgba(179,0,255,0.4)] backdrop-blur-md group-hover:opacity-0 transition-opacity duration-300"
      >
        <Database size={16} className="text-[#b300ff]" />
        <span className="text-[10px] md:text-xs font-semibold text-white tracking-wide">Zustand Storage</span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[10%] md:bottom-[15%] left-[5%] md:left-[2%] z-20 flex items-center gap-2 bg-[#18181b]/80 border border-white/30 px-3 md:px-4 py-2 rounded-full shadow-xl backdrop-blur-md group-hover:opacity-0 transition-opacity duration-300"
      >
        <FileText size={16} className="text-white" />
        <span className="text-[10px] md:text-xs font-semibold text-white tracking-wide">PDF Reporting</span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[20%] md:bottom-[30%] right-[5%] md:right-[2%] z-20 flex items-center gap-2 bg-[#18181b]/80 border border-[#ffa67a]/50 px-3 md:px-4 py-2 rounded-full shadow-[0_0_20px_rgba(255,166,122,0.4)] backdrop-blur-md group-hover:opacity-0 transition-opacity duration-300"
      >
        <PieChart size={16} className="text-[#ffa67a]" />
        <span className="text-[10px] md:text-xs font-semibold text-white tracking-wide">Data Analytics</span>
      </motion.div>

    </div>
  );
}