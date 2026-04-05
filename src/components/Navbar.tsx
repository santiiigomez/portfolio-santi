import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Code2 } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Proyectos', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Game', href: '#game' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline">Santiago<span className="text-blue-500">.dev</span></span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-white text-slate-950 px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Hablemos
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-slate-400 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
