"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./TechStack.module.css";

// Data Logo menggunakan CDN open-source Devicon
const row1 = [
  { name: "PHP", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" },
  { name: "Laravel", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" },
  { name: "HTML", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
  { name: "CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  { name: "Tailwind", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg" },
  { name: "PostgreSQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: ".NET", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg" }
];

const row2 = [
  { name: "Flutter", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg" },
  { name: "Next.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", invert: true },
  { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" },
  { name: "FastAPI", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg" },
  { name: "C#", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" }
];

export default function TechStack() {
  const containerRef = useRef(null);

  // Memantau scroll pada container utama
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Slider Logo
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);

  // Efek Fill Text: mengubah clip-path berdasarkan scroll
  // Saat elemen mulai terlihat (0.2), fill 0%. Saat hampir di tengah (0.5), fill 100%.
  const clipPathValue = useTransform(
    scrollYProgress,
    [0.2, 0.5],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  const renderLogos = (items) => {
    return [...items, ...items, ...items].map((item, index) => (
      <div key={index} className={styles.logoCard}>
        <Image 
          src={item.src} 
          alt={item.name} 
          width={45} 
          height={45} 
          className={`${styles.logoIcon} ${item.invert ? styles.invertDark : ""}`}
          unoptimized
        />
        <span className={styles.logoName}>{item.name}</span>
      </div>
    ));
  };

  return (
    <div ref={containerRef} className={styles.scrollTrack}>
      <div className={styles.ambientGlow}></div>
      
      <section className={styles.techSection}>
        
        {/* JUDUL TECHSTACK DENGAN EFEK FILL */}
        <div className={styles.titleContainer}>
          
          {/* Layer 1: Outline Putih (Selalu terlihat) */}
          <h2 className={`${styles.techTitle} ${styles.outlineText}`}>
            TECHSTACK
          </h2>
          
          {/* Layer 2: Fill Putih (Dipotong oleh clip-path Framer Motion) */}
          <motion.h2 
            className={`${styles.techTitle} ${styles.fillText}`}
            style={{ clipPath: clipPathValue }}
          >
            TECHSTACK
          </motion.h2>

          {/* Garis bawah dekoratif */}
          <div className={styles.titleDivider}></div>
        </div>

        <motion.div style={{ x: x1 }} className={styles.sliderContainer}>
          {renderLogos(row1)}
        </motion.div>

        <motion.div style={{ x: x2 }} className={styles.sliderContainer}>
          {renderLogos(row2)}
        </motion.div>

      </section>
    </div>
  );
}