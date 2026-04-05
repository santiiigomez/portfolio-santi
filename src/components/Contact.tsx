import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: 'anonymous', // For now, since we don't have auth fully integrated in UI
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    const path = 'messages';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">¿Hablamos?</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Siempre estoy abierto a charlar sobre tecnología, nuevos proyectos o simplemente para conectar. ¡No dudes en escribirme!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono">Email</p>
                    <p className="text-slate-200">sg8436064@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono">Social</p>
                    <p className="text-slate-200">@santi_gomez_dev</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nombre</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Mensaje</label>
                <textarea 
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="¿En qué puedo ayudarte?"
                ></textarea>
              </div>
              <button 
                disabled={status === 'sending'}
                className={`w-full font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  status === 'success' ? 'bg-green-600' : 
                  status === 'error' ? 'bg-red-600' : 
                  'bg-blue-600 hover:bg-blue-500'
                } text-white disabled:opacity-50`}
              >
                {status === 'sending' ? 'Enviando...' : 
                 status === 'success' ? <><CheckCircle2 className="w-4 h-4" /> ¡Enviado!</> :
                 status === 'error' ? <><AlertCircle className="w-4 h-4" /> Error</> :
                 <><Send className="w-4 h-4" /> Enviar Mensaje</>}
              </button>
            </form>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Santiago Gomez. Hecho con React & Tailwind.</p>
        </footer>
      </div>
    </section>
  );
}
