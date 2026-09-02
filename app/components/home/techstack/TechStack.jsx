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

  // Tracker memantau scrollTrack yang tinggi (200vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

// Jarak pergerakan diperkecil (-10%) agar terasa lambat meski section-nya pendek
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);

  // Fungsi pembantu agar array di-duplicate (memberi ilusi infinite scroll panjang)
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
      <section className={styles.techSection}>
        
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