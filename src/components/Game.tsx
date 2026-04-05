import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, Terminal, Zap, Trophy, RefreshCw, List } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface BugItem {
  id: number;
  x: number;
  y: number;
  type: 'bug' | 'feature';
}

interface HighScore {
  playerName: string;
  score: number;
  createdAt: any;
}

export default function Game() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bugs, setBugs] = useState<BugItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [leaderboard, setLeaderboard] = useState<HighScore[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch leaderboard
  useEffect(() => {
    const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scores = snapshot.docs.map(doc => doc.data() as HighScore);
      setLeaderboard(scores);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
    });
    return () => unsubscribe();
  }, []);

  const spawnBug = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newBug: BugItem = {
      id: Date.now(),
      x: Math.random() * (rect.width - 40),
      y: Math.random() * (rect.height - 40),
      type: Math.random() > 0.8 ? 'feature' : 'bug',
    };
    setBugs((prev) => [...prev, newBug]);

    setTimeout(() => {
      setBugs((prev) => prev.filter((b) => b.id !== newBug.id));
    }, 1500);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        spawnBug();
      }, 800);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      saveScore();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, spawnBug]);

  const saveScore = async () => {
    if (score === 0) return;
    try {
      await addDoc(collection(db, 'scores'), {
        playerName: 'Santiago (Guest)',
        score: score,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleCatch = (id: number, type: 'bug' | 'feature') => {
    setScore((prev) => (type === 'bug' ? prev + 10 : prev + 50));
    setBugs((prev) => prev.filter((b) => b.id !== id));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setBugs([]);
    setIsPlaying(true);
    setShowLeaderboard(false);
  };

  return (
    <section id="game" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Debug Time!</h2>
          <p className="text-slate-400">Un pequeño descanso: ¡Elimina los bugs antes de que corrompan el código!</p>
        </div>

        <div className="glass rounded-2xl p-6 relative min-h-[400px] flex flex-col items-center justify-center overflow-hidden" ref={containerRef}>
          {!isPlaying ? (
            <div className="text-center z-10 w-full max-w-md">
              {timeLeft === 0 && !showLeaderboard && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-6"
                >
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">¡Tiempo agotado!</h3>
                  <p className="text-slate-400">Tu score final: <span className="text-blue-400 font-bold">{score}</span></p>
                </motion.div>
              )}

              {showLeaderboard ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                    <List className="w-5 h-5 text-blue-400" /> Leaderboard
                  </h3>
                  <div className="space-y-2">
                    {leaderboard.map((entry, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-slate-300">{entry.playerName}</span>
                        <span className="text-blue-400 font-mono font-bold">{entry.score}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={startGame}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 justify-center"
                >
                  {timeLeft === 0 ? <RefreshCw className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  {timeLeft === 0 ? 'Reintentar' : 'Empezar Debugging'}
                </button>
                {!isPlaying && leaderboard.length > 0 && (
                  <button 
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className="glass hover:bg-white/10 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 justify-center"
                  >
                    <List className="w-5 h-5" />
                    {showLeaderboard ? 'Ocultar Scores' : 'Ver Leaderboard'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="absolute top-4 left-6 flex gap-8 z-10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  <span className="font-mono">Score: {score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-mono">Time: {timeLeft}s</span>
                </div>
              </div>

              <AnimatePresence>
                {bugs.map((bug) => (
                  <motion.button
                    key={bug.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => handleCatch(bug.id, bug.type)}
                    className="absolute p-2 cursor-pointer"
                    style={{ left: bug.x, top: bug.y }}
                  >
                    {bug.type === 'bug' ? (
                      <Bug className="w-8 h-8 text-red-500 hover:text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    ) : (
                      <Zap className="w-8 h-8 text-yellow-400 hover:text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </>
          )}

          <div className="absolute inset-0 pointer-events-none opacity-10 font-mono text-xs p-4 overflow-hidden">
            {`function debug(code) {
  while(bugs.length > 0) {
    smash(bugs[0]);
    refactor();
  }
  return "Clean Code";
}
// Santiago Gomez - Dev Portfolio
const projects = ["Landing", "Game", "API"];
console.log("Keep coding...");`.repeat(20)}
          </div>
        </div>
      </div>
    </section>
  );
}
