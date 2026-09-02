"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Memperbarui koordinat kursor
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Mengecek apakah kursor sedang berada di atas elemen yang bisa diklik
    const handleMouseOver = (e) => {
      // Cari jika target adalah link (a) atau tombol (button)
      if (e.target.closest("a") || e.target.closest("button")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* 1. TITIK INTI (Putih, Instan) */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          pointerEvents: "none", /* Penting agar tidak menghalangi klik */
          zIndex: 999999,
        }}
        animate={{
          x: mousePosition.x - 4, // -4 agar titik tepat berada di ujung kursor
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1, // Lenyap saat hover tombol
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />

      {/* 2. LINGKARAN LUAR (Neon Ungu, Trailing Effect) */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "36px",
          height: "36px",
          border: "2px solid #b300ff",
          boxShadow: "0 0 15px rgba(179, 0, 255, 0.5)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999998,
        }}
        animate={{
          x: mousePosition.x - 18,
          y: mousePosition.y - 18,
          scale: isHovering ? 1.5 : 1, // Membesar saat hover tombol
          backgroundColor: isHovering ? "rgba(179, 0, 255, 0.15)" : "transparent",
        }}
        // Efek spring agar ada pantulan organik saat digerakkan
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      />
    </>
  );
}