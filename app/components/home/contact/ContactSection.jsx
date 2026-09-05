"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./ContactSection.module.css";

const floatingImages = [
  { id: 1, src: "/gambar1.png", className: styles.asset1, initialX: -50, initialY: -50, rotate: -15, delay: 0.1 },
  { id: 2, src: "/gambar2.png", className: styles.asset2, initialX: 50, initialY: -20, rotate: 20, delay: 0.2 },
  { id: 3, src: "/gambar3.png", className: styles.asset3, initialX: -100, initialY: 20, rotate: -10, delay: 0.2 },
  { id: 4, src: "/gambar4.png", className: styles.asset4, initialX: 100, initialY: 50, rotate: 15, delay: 0.25 },
  { id: 5, src: "/gambar5.png", className: styles.asset5, initialX: -50, initialY: 80, rotate: -25, delay: 0.25 },
  { id: 6, src: "/gambar6.png", className: styles.asset6, initialX: 50, initialY: 80, rotate: 10, delay: 0.3 },
];

export default function ContactSection() {
  const headerRef = useRef(null);

  const { scrollYProgress: headerScrollProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });

  const titleClipPath = useTransform(
    headerScrollProgress,
    [0.2, 0.6],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  return (
    <section className={styles.contactSection}>
      
      <div className={styles.headerWrapper} ref={headerRef}>
        {floatingImages.map((img) => (
          <motion.div
            key={img.id}
            className={`${styles.floatingAsset} ${img.className}`}
            initial={{ opacity: 0, x: img.initialX, y: img.initialY, rotate: img.rotate - 30 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: img.rotate }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }} 
          >
            <motion.div animate={{ y: [0, -15, 0], rotate: [img.rotate, img.rotate + 5, img.rotate] }} transition={{ repeat: Infinity, duration: 4 + img.delay, ease: "easeInOut" }}>
              <Image src={img.src} alt={`Floating Asset ${img.id}`} width={200} height={200} className={styles.img} unoptimized priority />
            </motion.div>
          </motion.div>
        ))}

        <div className={styles.headerContent}>
          <div className={styles.titleContainer}>
            <h2 className={`${styles.title} ${styles.outlineText}`}>LET&apos;S CONNECT</h2>
            <motion.h2 
              className={`${styles.title} ${styles.fillText}`}
              style={{ clipPath: titleClipPath }}
            >
              LET&apos;S CONNECT
            </motion.h2>
          </div>
          <p className={styles.subtitle}>
            Punya ide proyek, tawaran kolaborasi, atau sekadar ingin menyapa? Jangan ragu untuk menghubungi saya.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        
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
          
          <a href="mailto:ekakrisnaferian@gmail.com" className={styles.hireButton}>
            <div className={styles.hireIconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <div className={styles.hireTextWrapper}>
              <span className={styles.hireLabel}>AVAILABLE FOR HIRE</span>
              <span className={styles.hireTitle}>Contact Me</span>
            </div>
          </a>
        </motion.div>

        <motion.div 
          className={styles.card}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className={styles.socialList}>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/eka-krisna-ferian-840a22385/" target="_blank" rel="noreferrer" className={styles.socialItem}>
              <div className={styles.iconBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </div>
              Eka Krisna Ferian
            </a>

            {/* GitHub */}
            <a href="https://github.com/jooharver" target="_blank" rel="noreferrer" className={styles.socialItem}>
              <div className={styles.iconBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </div>
              jooharver
            </a>

            {/* Instagram */}
            <a href="https://instagram.com/jooharver" target="_blank" rel="noreferrer" className={styles.socialItem}>
              <div className={styles.iconBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              @jooharver
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/6287870463683?text=Halo%20Eka%2C%20aku%20baru%20saja%20melihat%20portofolio%20mu%20dan%20tertarik%20untuk%20berdiskusi%20lebih%20lanjut..." target="_blank" rel="noreferrer" className={styles.socialItem}>
              <div className={styles.iconBox}>
                {/* Logo WhatsApp Resmi */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              +62 878-7046-3683
            </a>
          </div>

          <div className={styles.locationBadge}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Malang, Jawa Timur, Indonesia
          </div>
        </motion.div>

      </div>
    </section>
  );
}