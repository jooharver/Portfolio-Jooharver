"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./AboutSection.module.css";

const floatingImages = [
  { id: 1, src: "/gambar1.png", className: styles.asset1, initialX: -150, initialY: -100, rotate: -15, delay: 0.1 },
  { id: 2, src: "/gambar2.png", className: styles.asset2, initialX: 150, initialY: -50, rotate: 20, delay: 0.3 },
  { id: 3, src: "/gambar3.png", className: styles.asset3, initialX: -200, initialY: 50, rotate: -10, delay: 0.2 },
  { id: 4, src: "/gambar4.png", className: styles.asset4, initialX: 200, initialY: 100, rotate: 15, delay: 0.4 },
  { id: 5, src: "/gambar5.png", className: styles.asset5, initialX: -100, initialY: 150, rotate: -25, delay: 0.3 },
  { id: 6, src: "/gambar6.png", className: styles.asset6, initialX: 150, initialY: 150, rotate: 10, delay: 0.5 },
];

export default function AboutSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"], 
  });

  // ANIMASI SCROLL UNTUK JUDUL
  const headerRef = useRef(null);
  const { scrollYProgress: headerScrollProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"]
  });

  const titleClipPath = useTransform(
    headerScrollProgress,
    [0.2, 0.6],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  // 1. KONTROL GARIS DINAMIS
  const lineLength = useTransform(scrollYProgress, [0.1, 0.35, 0.5, 0.75], [0, 0.5, 0.5, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.09, 0.1], [0, 0, 1]);

  // 2. KOREOGRAFI KEMUNCULAN KARTU
  const card1Opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const card1X = useTransform(scrollYProgress, [0, 0.1], [-100, 0]);

  const card2Opacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);
  const card2X = useTransform(scrollYProgress, [0.25, 0.35], [100, 0]);

  const card3Opacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const card3X = useTransform(scrollYProgress, [0.65, 0.75], [-100, 0]);

  // 3. EFEK "TRANSFER KEKUATAN" (Warna Neon Bergantian)
  const card1Border = useTransform(scrollYProgress, [0, 0.34, 0.35], ["rgba(179, 0, 255, 1)", "rgba(179, 0, 255, 1)", "rgba(255, 255, 255, 0.3)"]);
  const card1Shadow = useTransform(scrollYProgress, [0, 0.34, 0.35], ["0px 0px 30px rgba(179, 0, 255, 0.6)", "0px 0px 30px rgba(179, 0, 255, 0.6)", "0px 10px 30px rgba(0, 0, 0, 0.5)"]);

  const card2Border = useTransform(scrollYProgress, [0.34, 0.35, 0.74, 0.75], ["rgba(255, 255, 255, 0.3)", "rgba(179, 0, 255, 1)", "rgba(179, 0, 255, 1)", "rgba(255, 255, 255, 0.3)"]);
  const card2Shadow = useTransform(scrollYProgress, [0.34, 0.35, 0.74, 0.75], ["0px 10px 30px rgba(0, 0, 0, 0.5)", "0px 0px 30px rgba(179, 0, 255, 0.6)", "0px 0px 30px rgba(179, 0, 255, 0.6)", "0px 10px 30px rgba(0, 0, 0, 0.5)"]);

  const card3Border = useTransform(scrollYProgress, [0.74, 0.75], ["rgba(255, 255, 255, 0.3)", "rgba(179, 0, 255, 1)"]);
  const card3Shadow = useTransform(scrollYProgress, [0.74, 0.75], ["0px 10px 30px rgba(0, 0, 0, 0.5)", "0px 0px 30px rgba(179, 0, 255, 0.6)"]);

  return (
    <section className={styles.aboutSection}>
      
      <div className={styles.headerWrapper} ref={headerRef}>
        {floatingImages.map((img) => (
          <motion.div
            key={img.id}
            className={`${styles.floatingAsset} ${img.className}`}
            initial={{ opacity: 0, x: img.initialX, y: img.initialY, rotate: img.rotate - 30 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: img.rotate }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div animate={{ y: [0, -15, 0], rotate: [img.rotate, img.rotate + 5, img.rotate] }} transition={{ repeat: Infinity, duration: 4 + img.delay, ease: "easeInOut" }}>
              <Image src={img.src} alt={`Floating Asset ${img.id}`} width={200} height={200} className={styles.img} unoptimized />
            </motion.div>
          </motion.div>
        ))}

        <div className={styles.headerContent}>
          <div className={styles.titleContainer}>
            <h2 className={`${styles.title} ${styles.outlineText}`}>ABOUT ME</h2>
            <motion.h2 
              className={`${styles.title} ${styles.fillText}`}
              style={{ clipPath: titleClipPath }}
            >
              ABOUT ME
            </motion.h2>
          </div>
        </div>
      </div>

      <div className={styles.timelineContainer} ref={containerRef}>
        
        {/* SVG GARIS PENGHUBUNG BERBENTUK SIKU (CIRCUIT STYLE) */}
        <div className={styles.svgWrapper}>
          <svg 
            viewBox="0 0 1000 800" 
            preserveAspectRatio="none"
            className={styles.svgLine} 
            style={{ width: '100%', height: '100%' }}
          >
            <defs>
              <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b300ff" />
                <stop offset="100%" stopColor="#ffa67a" />
              </linearGradient>
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <motion.path
              // KOREOGRAFI JALUR SIKU
              d="M 380 150 L 450 150 L 550 380 L 620 380 L 620 420 L 550 420 L 450 650 L 380 650"
              fill="none"
              stroke="url(#neonGradient)"
              filter="url(#neonGlow)"
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ 
                pathLength: lineLength,
                opacity: lineOpacity 
              }} 
            />
          </svg>
        </div>

        {/* KARTU 1: Magang */}
        <div className={`${styles.cardRow} ${styles.leftAlign}`}>
          <motion.div 
            className={styles.card}
            style={{ 
              opacity: card1Opacity, 
              x: card1X, 
              borderColor: card1Border, 
              boxShadow: card1Shadow 
            }}
          >
            <span className={styles.cardCompany}>Sarastya Agility Innovations</span>
            <h3 className={styles.cardRole}>Software Developer Intern</h3>
            <p className={styles.cardDesc}>
              Mengembangkan komponen perangkat lunak dan mengintegrasikan REST API dalam lingkungan kerja yang agile. Fokus pada performa dan skalabilitas sistem backend.
            </p>
          </motion.div>
        </div>

        {/* KARTU 2: Freelance */}
        <div className={`${styles.cardRow} ${styles.rightAlign}`}>
          <motion.div 
            className={styles.card}
            style={{ 
              opacity: card2Opacity, 
              x: card2X,
              borderColor: card2Border, 
              boxShadow: card2Shadow 
            }}
          >
            <span className={styles.cardCompany}>Freelance</span>
            <h3 className={styles.cardRole}>Cosmos Blockchain Developer</h3>
            <p className={styles.cardDesc}>
              Merancang dan mengimplementasikan solusi desentralisasi berbasis ekosistem Cosmos. Mengerjakan arsitektur jaringan yang aman dan efisien.
            </p>
          </motion.div>
        </div>

        {/* KARTU 3: Open to Work */}
        <div className={`${styles.cardRow} ${styles.leftAlign}`}>
          <motion.div 
            className={styles.card}
            style={{ 
              opacity: card3Opacity, 
              x: card3X,
              borderColor: card3Border, 
              boxShadow: card3Shadow 
            }}
          >
            <span className={styles.cardCompany}>Current Status</span>
            <h3 className={styles.cardRole}>Open to Work 🚀</h3>
            <p className={styles.cardDesc}>
              Siap untuk peluang baru dalam pengembangan Full-stack Web3 maupun Web2. Mencari lingkungan yang menantang batas teknis dan inovasi produk.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}