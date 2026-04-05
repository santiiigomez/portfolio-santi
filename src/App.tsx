import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Game from './components/Game';
import Contact from './components/Contact';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Game />
        <Contact />
      </main>
    </div>
  );
}
