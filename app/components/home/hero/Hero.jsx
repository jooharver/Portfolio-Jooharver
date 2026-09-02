"use client";

import { useEffect, useRef, useState } from "react"; 
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./Hero.module.css";

export default function Hero() {
  // 1. STATE UNTUK EFEK TYPEWRITER
  const fullText = "HI, IM EKA";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    // Jika teks utuh dan tidak sedang menghapus -> Jeda 2 detik lalu hapus
    if (!isDeleting && displayText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 3000);
    } 
    // Jika teks habis dan sedang menghapus -> Jeda 0.5 detik lalu ngetik lagi
    else if (isDeleting && displayText === "") {
      timer = setTimeout(() => setIsDeleting(false), 500);
    } 
    // Proses ngetik (150ms) atau menghapus (100ms)
    else {
      const typingSpeed = isDeleting ? 100 : 150;
      timer = setTimeout(() => {
        setDisplayText(
          fullText.substring(0, displayText.length + (isDeleting ? -1 : 1))
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting]);

  // 2. SETUP EFEK PARALAKS
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });
  const moveX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const moveY = useTransform(springY, [-0.5, 0.5], [-30, 30]);

  const avatarRef = useRef(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [mouseX, mouseY]);

  // 3. FUNGSI UNTUK MELACAK KURSOR X-RAY
  const handleAvatarMouseMove = (e) => {
    if (!avatarRef.current) return;
    const rect = avatarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    avatarRef.current.style.setProperty("--x", `${x}px`);
    avatarRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleAvatarMouseLeave = () => {
    if (!avatarRef.current) return;
    avatarRef.current.style.setProperty("--x", `-9999px`);
    avatarRef.current.style.setProperty("--y", `-9999px`);
  };

  return (
    <section className={styles.heroSection}>
      
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={styles.title}
      >
        {displayText}
        {/* Pastikan class .cursor sudah ditambahkan di Hero.module.css */}
        <span className={styles.cursor}>|</span>
      </motion.h1>

      <div className={styles.middleRow}>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={styles.leftContent}
        >
          <h2 className={styles.role}>Software Developer</h2>
          <p className={styles.description}>
            Membangun ekosistem aplikasi web & mobile dengan performa tinggi.
          </p>
        </motion.div>

        <motion.div style={{ x: moveX, y: moveY }} className={styles.centerContent}>
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className={styles.imageFloating}
          >
            <div 
              ref={avatarRef}
              onMouseMove={handleAvatarMouseMove}
              onMouseLeave={handleAvatarMouseLeave}
              className={styles.avatarContainer}
            >
              <Image 
                src="/wajahku.png" 
                alt="Eka 3D Avatar" 
                width={500} 
                height={500} 
                className={styles.imageBase}
                priority
              />
              <Image 
                src="/wajahku-robottt.png" 
                alt="Eka Robot Avatar" 
                width={500} 
                height={500} 
                className={styles.imageOverlay}
                priority
              />
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className={styles.shadow}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={styles.rightContent}
        >
          <button className={styles.ctaButton}>Contact Me</button>
        </motion.div>

      </div>
    </section>
  );
}