import LoadingScreen from "./components/loading/LoadingScreen";
import Hero from "./components/home/hero/Hero";
import TechStack from "./components/home/techstack/TechStack"; // Import baru
import Project from "./components/home/project/ProjectSection"; // Import baru
import About from "./components/home/about/AboutSection"; // Import baru
import Contact from "./components/home/contact/ContactSection"; // Import baru

export default function Home() {
  return (
// SESUDAHNYA
<main style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#fafafa', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <LoadingScreen />
      <Hero />
      <TechStack />
      <Project />
      <About />
      <Contact />
    </main>
  );
}