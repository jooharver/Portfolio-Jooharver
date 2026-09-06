"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import styles from "./ProjectSection.module.css";

// Import Kartu Mockup
import InventoryCard from "./inventory/InventoryCard";
import AttendanceCard from "./attendance/AttendanceCard";
import RentalCard from "./rental/RentalCard";
import ErpCard from "./erp/ErpCard";
import MarketplaceCard from "./marketplace/MarketplaceCard"; 

// Import Live Demo Project
import InventoryApp from "./inventory/InventoryApp";
import AttendanceApp from "./attendance/AttendanceApp";
import RentalApp from "./rental/RentalApp";
import ErpApp from "./erp/ErpApp"; 
import MarketplaceApp from "./marketplace/MarketplaceApp"; 

const projects = [
  { id: "01", label: "PROJECT", title: "Inventory - Sistem Pengelolaan Stok Barang", Component: InventoryCard },
  { id: "02", label: "PROJECT", title: "Attendance - Aplikasi Absensi dan Perizinan Mobile", Component: AttendanceCard },
  { id: "03", label: "PROJECT", title: "Rental - Platform Sewa Lapangan", Component: RentalCard },
  { id: "04", label: "PROJECT", title: "ERP - Sistem Manajemen Logistik", Component: ErpCard },
  { id: "05", label: "PROJECT", title: "Marketplace - Platform Jual Beli Online", Component: MarketplaceCard },
];

const floatingImages = [
  { id: 1, src: "/gambar1.png", className: styles.asset1, initialX: -30, initialY: -30, rotate: -15, delay: 0.1 },
  { id: 2, src: "/gambar2.png", className: styles.asset2, initialX: 30, initialY: -15, rotate: 20, delay: 0.2 },
  { id: 3, src: "/gambar3.png", className: styles.asset3, initialX: -40, initialY: 15, rotate: -10, delay: 0.2 },
  { id: 4, src: "/gambar4.png", className: styles.asset4, initialX: 40, initialY: 30, rotate: 15, delay: 0.25 },
  { id: 5, src: "/gambar5.png", className: styles.asset5, initialX: -30, initialY: 40, rotate: -25, delay: 0.25 },
  { id: 6, src: "/gambar6.png", className: styles.asset6, initialX: 30, initialY: 40, rotate: 10, delay: 0.3 },
];

export default function ProjectSection() {
  const [activeProject, setActiveProject] = useState(null);
  const [pendingProject, setPendingProject] = useState(null);
  
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

  return (
    <>
      <AnimatePresence>
        {pendingProject && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
            >
              <button className={styles.closeModalBtn} onClick={() => setPendingProject(null)}>
                <X size={20} />
              </button>
              
              <h3 className={styles.modalTitle}>Peringatan Live Demo</h3>
              <p className={styles.modalDesc}>
                Semua interaksi dan data yang Anda masukkan bersifat offline, hanya disimpan sementara di perangkat lokal Anda, tidak akan disalahgunakan, dan dijamin <strong>100% aman</strong>.
              </p>
              
              <div className={styles.modalActions}>
                <button className={styles.btnUnderstand} onClick={() => {
                  setActiveProject(pendingProject);
                  setPendingProject(null);
                }}>Mengerti</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeProject === "01" && <InventoryApp onClose={() => setActiveProject(null)} />}
        {activeProject === "02" && <AttendanceApp onClose={() => setActiveProject(null)} />}
        {activeProject === "03" && <RentalApp onClose={() => setActiveProject(null)} />}
        {activeProject === "04" && <ErpApp onClose={() => setActiveProject(null)} />}
        {activeProject === "05" && <MarketplaceApp onClose={() => setActiveProject(null)} />}
      </AnimatePresence>

      <section className={styles.projectSection}>
        
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
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [img.rotate, img.rotate + 5, img.rotate] }}
                transition={{ repeat: Infinity, duration: 4 + img.delay, ease: "easeInOut" }}
              >
                <Image src={img.src} alt={`Asset`} width={200} height={200} className={styles.img} unoptimized priority />
              </motion.div>
            </motion.div>
          ))}

          <div className={styles.headerContent}>
            <div className={styles.titleContainer}>
              <h2 className={`${styles.title} ${styles.outlineText}`}>MY PROJECTS</h2>
              <motion.h2 
                className={`${styles.title} ${styles.fillText}`}
                style={{ clipPath: titleClipPath }}
              >
                MY PROJECTS
              </motion.h2>
            </div>
            
            <p className={styles.description}>
              Kumpulan proyek yang telah saya kerjakan. Klik Live Project untuk mencoba demo langsung.
            </p>
          </div>
        </div>

        <div className={styles.cardsContainer}>
          {projects.map((project, index) => {
            const stickyTop = `calc(10svh + ${index * 24}px)`;

            return (
              <div 
                key={project.id} 
                className={styles.cardStickyWrapper} 
                style={{ 
                  top: stickyTop, 
                  zIndex: index + 1 
                }}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardHeader}>
                    <div className={styles.headerInfo}>
                      <span className={styles.cardNumber}>{project.id}</span>
                      <div className={styles.titleGroup}>
                        <span className={styles.cardLabel}>{project.label}</span>
                        <span className={styles.cardTitle}>{project.title}</span>
                      </div>
                    </div>
                    <button className={styles.tryButton} onClick={() => setPendingProject(project.id)}>
                      LIVE PROJECT
                    </button>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.mockupWrapper}>
                      <project.Component onClick={() => setPendingProject(project.id)} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}