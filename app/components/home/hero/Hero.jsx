"use client";

import { useEffect, useRef, useState } from "react"; 
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mail } from "lucide-react";
import { Anton } from "next/font/google";
import styles from "./Hero.module.css";

const anton = Anton({ subsets: ["latin"], weight: "400" });

export default function Hero() {
  const fullText = "HI, I'M EKA";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    if (!isDeleting && displayText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 3000);
    } 
    else if (isDeleting && displayText === "") {
      timer = setTimeout(() => setIsDeleting(false), 500);
    } 
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
        className={`${styles.title} ${anton.className}`}
      >
        {displayText}
        <span className={styles.cursor}>|</span>
      </motion.h1>

      <div className={styles.middleRow}>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={styles.leftContent}
        >
          <div className={styles.infoBlock}>
            <h2 className={styles.role}>Software Developer</h2>
            <div className={styles.divider}></div>
            <p className={styles.description}>
              Membangun ekosistem aplikasi web & mobile dengan performa tinggi.
            </p>
          </div>
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
          <a href="mailto:ekakrisnaferian@gmail.com" className={styles.ctaButton}>
            <div className={styles.ctaIconWrapper}>
              <Mail size={24} />
            </div>
            <div className={styles.ctaTextWrapper}>
              <span className={styles.ctaLabel}>Available for Hire</span>
              <span className={styles.ctaTitle}>Contact Me</span>
            </div>
          </a>
        </motion.div>

      </div>
    </section>
  );
}