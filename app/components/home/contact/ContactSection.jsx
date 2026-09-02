"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./ContactSection.module.css";

const floatingImages = [
  { id: 1, src: "/gambar1.png", className: styles.asset1, initialX: -150, initialY: -100, rotate: -15, delay: 0.1 },
  { id: 2, src: "/gambar2.png", className: styles.asset2, initialX: 150, initialY: -50, rotate: 20, delay: 0.3 },
  { id: 3, src: "/gambar3.png", className: styles.asset3, initialX: -200, initialY: 50, rotate: -10, delay: 0.2 },
  { id: 4, src: "/gambar4.png", className: styles.asset4, initialX: 200, initialY: 100, rotate: 15, delay: 0.4 },
  { id: 5, src: "/gambar5.png", className: styles.asset5, initialX: -100, initialY: 150, rotate: -25, delay: 0.3 },
  { id: 6, src: "/gambar6.png", className: styles.asset6, initialX: 150, initialY: 150, rotate: 10, delay: 0.5 },
];

export default function ContactSection() {
  return (
    <section className={styles.contactSection}>
      
      <div className={styles.headerWrapper}>
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

        <motion.div 
          className={styles.headerContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>LET&apos;S CONNECT</h2>
          <p className={styles.subtitle}>
            Punya ide proyek, tawaran kolaborasi, atau sekadar ingin menyapa? Jangan ragu untuk menghubungi saya.
          </p>
        </motion.div>
      </div>

      <div className={styles.grid}>
        
        {/* KARTU KIRI: Pesan Utama & CTA Email */}
        <motion.div 
          className={styles.card}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className={styles.cardTitle}>Mari bangun ekosistem digital bersama.</h3>
          <p className={styles.cardDesc}>
            Saya selalu terbuka untuk mendiskusikan peluang baru dalam pengembangan web modern dan arsitektur sistem skala besar.
          </p>
          
          <a href="mailto:ekakrisnaferian@example.com" className={styles.neonButton}>
            Kirim Email 
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </a>
        </motion.div>

        {/* KARTU KANAN: Social Links & Lokasi */}
        <motion.div 
          className={styles.card}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className={styles.socialList}>
            {/* GitHub */}
            <a href="https://github.com/jooharver" target="_blank" rel="noreferrer" className={styles.socialItem}>
              <div className={styles.iconBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </div>
              github.com/jooharver
            </a>

            {/* X / Twitter */}
            <a href="https://twitter.com/joo_harver" target="_blank" rel="noreferrer" className={styles.socialItem}>
              <div className={styles.iconBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                </svg>
              </div>
              @joo_harver
            </a>
          </div>

          <div className={styles.locationBadge}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Berdasarkan di Malang, Indonesia
          </div>
        </motion.div>

      </div>
    </section>
  );
}