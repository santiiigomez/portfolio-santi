import React from 'react';
import { motion } from 'motion/react';
import { Code2, Cpu, Globe2, Layers, Smartphone, Terminal } from 'lucide-react';

const skillGroups = [
  {
    title: "Facultad (Sólido)",
    icon: Terminal,
    skills: ["C++ (Avanzado)", "Algoritmos", "Estructuras de Datos", "POO"]
  },
  {
    title: "Aprendizaje Web",
    icon: Globe2,
    skills: ["HTML5 (En curso)", "CSS3 (En curso)", "JavaScript (En curso)", "TypeScript (En curso)"]
  },
  {
    title: "Explorando",
    icon: Layers,
    skills: ["React", "Tailwind CSS", "Firebase", "Motion"]
  },
  {
    title: "Objetivo",
    icon: Cpu,
    skills: ["Web para Comercios", "Soluciones Digitales", "UI/UX Moderno", "Emprendimientos"]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stack Tecnológico</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Herramientas y tecnologías que utilizo para dar vida a mis ideas y resolver problemas complejos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillGroups.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl glass hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                <group.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.skills.map((skill, i) => (
                  <li key={i} className="text-slate-400 text-sm font-medium">
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
