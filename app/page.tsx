"use client";

import { Outfit } from "next/font/google";
import LoadingScreen from "./components/loading/LoadingScreen";
import Navbar from "./components/navbar/Navbar"; 
import Hero from "./components/home/hero/Hero";
import TechStack from "./components/home/techstack/TechStack";
import Project from "./components/home/project/ProjectSection";
import About from "./components/home/about/AboutSection";
import Contact from "./components/home/contact/ContactSection";

const outfit = Outfit({ subsets: ["latin"] });

export default function Home() {
  return (
    <main 
      className={outfit.className} 
      style={{ 
        backgroundColor: '#09090b', 
        minHeight: '100vh', 
        color: '#fafafa', 
        padding: '1.5rem',
        /* KUNCI FIX SCROLL SAMPING GLOBAL */
        overflowX: 'clip',
        maxWidth: '100vw'
      }}
    >
      <LoadingScreen />
      <Navbar />
      
      <div id="intro"><Hero /></div>
      <TechStack />
      <div id="project"><Project /></div>
      <div id="about"><About /></div>
      <div id="contact"><Contact /></div>
    </main>
  );
}