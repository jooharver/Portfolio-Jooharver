"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./AboutSection.module.css";

// Posisi gambar melayang (Sudah disesuaikan agar aman di mobile)
const floatingImages = [
  { id: 1, src: "/gambar1.png", className: styles.asset1, initialX: -30, initialY: -30, rotate: -15, delay: 0.1 },
  { id: 2, src: "/gambar2.png", className: styles.asset2, initialX: 30, initialY: -15, rotate: 20, delay: 0.2 },
  { id: 3, src: "/gambar3.png", className: styles.asset3, initialX: -40, initialY: 15, rotate: -10, delay: 0.2 },
  { id: 4, src: "/gambar4.png", className: styles.asset4, initialX: 40, initialY: 30, rotate: 15, delay: 0.25 },
  { id: 5, src: "/gambar5.png", className: styles.asset5, initialX: -30, initialY: 40, rotate: -25, delay: 0.25 },
  { id: 6, src: "/gambar6.png", className: styles.asset6, initialX: 30, initialY: 40, rotate: 10, delay: 0.3 },
];

export default function AboutSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"], 
  });

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

  const lineLength = useTransform(scrollYProgress, [0.1, 0.35, 0.5, 0.75], [0, 0.5, 0.5, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.09, 0.1], [0, 0, 1]);

  const card1Opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const card1X = useTransform(scrollYProgress, [0, 0.1], [-100, 0]);

  const card2Opacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);
  const card2X = useTransform(scrollYProgress, [0.25, 0.35], [100, 0]);

  // Card 3 Opacity & X position (Shadow & Border dihapus karena akan diganti efek Neon CSS murni)
  const card3Opacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const card3X = useTransform(scrollYProgress, [0.65, 0.75], [-100, 0]);

  const card1Border = useTransform(scrollYProgress, [0, 0.34, 0.35], ["rgba(179, 0, 255, 1)", "rgba(179, 0, 255, 1)", "rgba(255, 255, 255, 0.3)"]);
  const card1Shadow = useTransform(scrollYProgress, [0, 0.34, 0.35], ["0px 0px 30px rgba(179, 0, 255, 0.6)", "0px 0px 30px rgba(179, 0, 255, 0.6)", "0px 10px 30px rgba(0, 0, 0, 0.5)"]);

  const card2Border = useTransform(scrollYProgress, [0.34, 0.35, 0.74, 0.75], ["rgba(255, 255, 255, 0.3)", "rgba(179, 0, 255, 1)", "rgba(179, 0, 255, 1)", "rgba(255, 255, 255, 0.3)"]);
  const card2Shadow = useTransform(scrollYProgress, [0.34, 0.35, 0.74, 0.75], ["0px 10px 30px rgba(0, 0, 0, 0.5)", "0px 0px 30px rgba(179, 0, 255, 0.6)", "0px 0px 30px rgba(179, 0, 255, 0.6)", "0px 10px 30px rgba(0, 0, 0, 0.5)"]);

  return (
    <section className={styles.aboutSection}>
      
      <div className={styles.headerWrapper} ref={headerRef}>
        {floatingImages.map((img) => (
          <motion.div
            key={img.id}
            className={`${styles.floatingAsset} ${img.className}`}
            initial={{ opacity: 0, x: img.initialX, y: img.initialY, rotate: img.rotate - 30 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: img.rotate }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "200px" }}
          >
            <motion.div animate={{ y: [0, -15, 0], rotate: [img.rotate, img.rotate + 5, img.rotate] }} transition={{ repeat: Infinity, duration: 4 + img.delay, ease: "easeInOut" }}>
              <Image src={img.src} alt={`Floating Asset ${img.id}`} width={200} height={200} className={styles.img} unoptimized priority />
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
        <div className={styles.svgWrapper}>
          <svg viewBox="0 0 1000 800" preserveAspectRatio="none" className={styles.svgLine} style={{ width: '100%', height: '100%' }}>
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
              d="M 380 150 L 450 150 L 550 380 L 620 380 L 620 420 L 550 420 L 450 650 L 380 650"
              fill="none"
              stroke="url(#neonGradient)"
              filter="url(#neonGlow)"
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: lineLength, opacity: lineOpacity }} 
            />
          </svg>
        </div>

        {/* KARTU 1: Sarastya */}
        <div className={`${styles.cardRow} ${styles.leftAlign}`}>
          <motion.div 
            className={styles.card}
            style={{ opacity: card1Opacity, x: card1X, borderColor: card1Border, boxShadow: card1Shadow }}
          >
            <span className={styles.cardCompany}>Sarastya Agility Innovations</span>
            <h3 className={styles.cardRole}>Software Developer - Intern</h3>
            <p className={styles.cardDesc}>
              Mengembangkan full-stack website ERP untuk manajemen bisnis. Membangun REST API menggunakan .NET dan antarmuka Frontend dengan React.js.
            </p>
          </motion.div>
        </div>

        {/* KARTU 2: Polinema */}
        <div className={`${styles.cardRow} ${styles.rightAlign}`}>
          <motion.div 
            className={styles.card}
            style={{ opacity: card2Opacity, x: card2X, borderColor: card2Border, boxShadow: card2Shadow }}
          >
            <span className={styles.cardCompany}>Politeknik Negeri Malang</span>
            <h3 className={styles.cardRole}>Blockchain Developer - Remote</h3>
            <p className={styles.cardDesc}>
              Melakukan optimalisasi, tuning, dan testing arsitektur jaringan Cosmos menggunakan node dari berbagai benua.
            </p>
          </motion.div>
        </div>

        {/* KARTU 3: Open to Work (Desain Neon Khusus) */}
        <div className={`${styles.cardRow} ${styles.leftAlign}`}>
          <motion.div 
            // Menggabungkan kelas default .card dengan .cardNeon
            className={`${styles.card} ${styles.cardNeon}`}
            style={{ opacity: card3Opacity, x: card3X }}
          >
            <span className={styles.cardCompany}>Current Status</span>
            <h3 className={styles.cardRole}>Open to Work 🚀</h3>
            <p className={styles.cardDesc}>
              Siap berkolaborasi untuk peluang pengembangan Full-stack Website, aplikasi Mobile, dan Web3.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}