"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: "Intro", id: "intro" },
    { name: "Project", id: "project" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" }
  ];

  return (
    <nav 
      // PERHATIKAN: border-t-[4px] adalah ketebalan garis putihnya. 
      // Silakan ubah angka 4px menjadi 2px, 6px, dll sesuai selera.
      className={`fixed top-0 left-0 w-full z-[999] bg-[#09090b] border-t-[10px] border-t-white border-b border-white/5 transition-all duration-300 ${
        isScrolled ? "py-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)]" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-center md:justify-between items-center">
        
        {/* LOGO DI KIRI (Sembunyi di Mobile, Tampil di Desktop) */}
        <div 
          className="hidden md:block text-white font-black text-xl cursor-pointer tracking-widest"
          onClick={() => scrollToSection("intro")}
        >
          EKA<span className="text-[#b300ff]">.</span>
        </div>

        {/* MENU TENGAH/KANAN */}
        <div className="flex gap-6 md:gap-10">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.id)}
              className="text-white/80 text-xs md:text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>
        
      </div>
    </nav>
  );
}