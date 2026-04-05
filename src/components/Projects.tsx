import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, FolderCode, Layout, Database, Globe } from 'lucide-react';

const projects = [
  {
    title: "Sistema de Gestión Académica",
    description: "Una plataforma para gestionar notas, asistencias y horarios, desarrollada como proyecto de facultad.",
    tags: ["React", "Node.js", "PostgreSQL"],
    icon: Layout,
    link: "#",
    github: "#"
  },
  {
    title: "E-commerce Minimalista",
    description: "Tienda online con enfoque en UX/UI, carrito de compras y pasarela de pagos simulada.",
    tags: ["TypeScript", "Tailwind", "Firebase"],
    icon: Globe,
    link: "#",
    github: "#"
  },
  {
    title: "Analizador de Algoritmos",
    description: "Herramienta visual para entender la complejidad temporal de diferentes algoritmos de ordenamiento.",
    tags: ["JavaScript", "D3.js", "HTML5"],
    icon: FolderCode,
    link: "#",
    github: "#"
  },
  {
    title: "API de Microservicios",
    description: "Arquitectura escalable para el manejo de datos en tiempo real usando WebSockets.",
    tags: ["Express", "Redis", "Docker"],
    icon: Database,
    link: "#",
    github: "#"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Proyectos Destacados</h2>
            <p className="text-slate-400 max-w-xl">
              Una selección de mis desarrollos más recientes, combinando lo aprendido en la facultad con mi formación autodidacta.
            </p>
          </div>
          <a href="#" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition-colors">
            Ver todo en GitHub <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group glass rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <project.icon className="w-6 h-6" />
                </div>
                <div className="flex gap-3">
                  <a href={project.github} className="text-slate-500 hover:text-white transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href={project.link} className="text-slate-500 hover:text-white transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-400 mb-6 line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
