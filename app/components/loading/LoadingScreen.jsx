"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // EFEK 1: Mengatur jalannya persentase loading
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Jika sudah 100, hentikan interval
    if (progress >= 100) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 12) + 2; 
        // Pastikan angka terkunci maksimal di 100
        return next >= 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [progress]);

  // EFEK 2: Menjalankan animasi belah HANYA ketika progress benar-benar sudah 100
  useEffect(() => {
    if (progress === 100) {
      // Jeda 600ms (0.6 detik) di sini berfungsi untuk:
      // 1. Memberi waktu browser merender tulisan "100%"
      // 2. Menunggu animasi putaran garis SVG selesai (karena transisinya memakan 0.2s)
      const timer = setTimeout(() => {
        setIsVisible(false);
        
        // Membuka kembali scroll sesaat setelah pintu terlempar ke samping
        setTimeout(() => {
          document.body.style.overflow = "auto";
        }, 800); 
      }, 600); 

      return () => clearTimeout(timer);
    }
  }, [progress]);

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className={styles.loadingWrapper}>
          
          {/* PINTU KIRI */}
          <motion.div
            className={styles.leftDoor}
            initial={{ x: 0 }}
            exit={{ x: "-100vw" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className={styles.circleContainer}>
              <svg className={styles.svgNeon} viewBox="0 0 240 240">
                <defs>
                  <linearGradient id="loadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b300ff" />
                    <stop offset="100%" stopColor="#ffa67a" />
                  </linearGradient>
                  <filter id="loadGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="120" cy="120" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="none"
                  stroke="url(#loadGrad)"
                  strokeWidth="4"
                  filter="url(#loadGlow)"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
                />
              </svg>

              <div className={styles.textWrap}>
                <span className={styles.loadingText}>Loading Assets</span>
                <span className={styles.progressText}>{progress}%</span>
              </div>
            </div>
          </motion.div>

          {/* PINTU KANAN */}
          <motion.div
            className={styles.rightDoor}
            initial={{ x: 0 }}
            exit={{ x: "100vw" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />
          
        </div>
      )}
    </AnimatePresence>
  );
}