import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Heart, Pause, Play } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { GameTutorial } from '@/components/GameTutorial.jsx';
import { Button } from '@/components/ui/button';
import { Trash2, Scissors, Fish } from 'lucide-react';

const FishingGame = () => {
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [hookY, setHookY] = useState(50);
  const [entities, setEntities] = useState([]);
  
  const gameAreaRef = useRef();
  const requestRef = useRef();
  const lastSpawnRef = useRef(0);

  const entityTypes = [
    { type: 'trash', icon: Trash2, points: 15, color: 'text-slate-600 bg-white border-slate-400' },
    { type: 'enemy', icon: Scissors, points: 0, color: 'text-red-600 bg-white border-red-400' }, // Crab/scissors that cuts line
    { type: 'fish', icon: Fish, points: 0, color: 'text-accent bg-blue-800 border-blue-400' } // Blocks hook
  ];

  const handleMouseMove = (e) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHookY(Math.max(10, Math.min(90, y)));
  };

  const spawnEntity = (timestamp) => {
    if (timestamp - lastSpawnRef.current > 1200) {
      const rand = Math.random();
      // 60% trash, 20% enemy, 20% fish
      const typeObj = rand < 0.6 ? entityTypes[0] : rand < 0.8 ? entityTypes[1] : entityTypes[2];
      const isLeft = Math.random() > 0.5;
      
      setEntities(prev => [...prev, {
        id: Date.now() + Math.random(),
        ...typeObj,
        x: isLeft ? -10 : 110,
        y: Math.random() * 60 + 20,
        speed: (Math.random() * 0.3 + 0.4),
        direction: isLeft ? 1 : -1
      }]);
      lastSpawnRef.current = timestamp;
    }
  };

  const updateGame = (timestamp) => {
    if (gameState !== 'playing') return;
    spawnEntity(timestamp);

    setEntities(prev => {
      let newLives = lives;
      const updated = prev.map(e => ({ ...e, x: e.x + (e.speed * e.direction) })).filter(e => {
        // Out of bounds
        if ((e.direction === 1 && e.x > 110) || (e.direction === -1 && e.x < -10)) {
          if (e.type === 'trash') newLives -= 1; // Lose life if trash escapes
          return false;
        }
        
        // Collision with hook (fixed at X=50)
        const hookX = 50;
        if (Math.abs(e.x - hookX) < 5 && Math.abs(e.y - hookY) < 8) {
          if (e.type === 'trash') {
            setScore(s => s + e.points);
          } else if (e.type === 'enemy') {
            newLives -= 1; // Enemy cuts line
          } else if (e.type === 'fish') {
            // Fish just blocks, maybe slight push back, we just let it despawn for simplicity
          }
          return false; 
        }
        return true;
      });

      if (newLives !== lives) {
        setLives(newLives);
        if (newLives <= 0) setGameState('over');
      }
      return updated;
    });

    requestRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    if (gameState === 'playing') requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, lives, hookY]);

  const startGame = () => { setGameState('playing'); setScore(0); setLives(3); setEntities([]); };
  const togglePause = () => setGameState(s => s === 'playing' ? 'paused' : 'playing');

  return (
    <>
      <Helmet><title>Ocean Cleanup - NextStep</title></Helmet>
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="max-w-6xl mx-auto px-4 mt-8 flex justify-between items-center">
          <Button asChild variant="ghost" className="rounded-full font-bold text-secondary">
            <Link to="/student-dashboard"><ArrowLeft className="w-5 h-5 mr-2" /> Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-black text-secondary uppercase tracking-widest">Ocean Cleanup</h1>
          {gameState === 'playing' || gameState === 'paused' ? (
             <Button onClick={togglePause} variant="outline" className="rounded-full border-4 border-secondary text-secondary font-bold">
               {gameState === 'playing' ? <Pause className="w-5 h-5 mr-2"/> : <Play className="w-5 h-5 mr-2"/>} {gameState === 'playing' ? 'Pause' : 'Resume'}
             </Button>
          ) : <div></div>}
        </div>

        <div className="max-w-5xl mx-auto mt-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-t-3xl border-4 border-b-0 border-secondary">
             <div className="flex gap-2">
                {[...Array(3)].map((_, i) => <Heart key={i} className={`w-8 h-8 ${i < lives ? 'text-primary fill-primary' : 'text-gray-300'}`} />)}
             </div>
             <div className="text-3xl font-black text-secondary">Score: <span className="text-primary">{score}</span></div>
          </div>

          <div 
            ref={gameAreaRef}
            onMouseMove={handleMouseMove}
            className="w-full h-[600px] relative bg-gradient-to-b from-blue-300 to-blue-700 border-4 border-secondary shadow-2xl overflow-hidden cursor-none"
          >
            {/* UI Overlays */}
            {gameState === 'start' && (
              <div className="absolute inset-0 bg-secondary/80 z-30 flex items-center justify-center">
                <Button onClick={startGame} className="h-20 px-12 rounded-full text-2xl font-black bg-primary text-white shadow-[0_8px_0_rgb(130,20,20)]">Start Fishing!</Button>
              </div>
            )}
            {gameState === 'over' && (
              <div className="absolute inset-0 bg-secondary/90 z-30 flex flex-col items-center justify-center">
                <Trophy className="w-24 h-24 text-accent mb-4" />
                <h2 className="text-5xl font-black text-white mb-2">Game Over</h2>
                <p className="text-2xl text-accent font-bold mb-6">Score: {score}</p>
                <Button onClick={startGame} className="h-16 px-8 rounded-full text-xl font-bold bg-primary text-white">Play Again</Button>
              </div>
            )}
            
            {/* Hook Line */}
            <div className="absolute left-1/2 w-1 bg-white origin-top z-10" style={{ top: 0, height: `${hookY}%`, transform: 'translateX(-50%)' }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 border-4 border-t-0 border-slate-800 rounded-b-full shadow-lg"></div>
            </div>

            {/* Entities */}
            {entities.map(e => {
              const Icon = e.icon;
              return (
                <div key={e.id} className={`absolute w-14 h-14 rounded-full border-4 shadow-lg flex items-center justify-center z-20 ${e.color}`} style={{ left: `${e.x}%`, top: `${e.y}%`, transform: `scaleX(${e.direction})` }}>
                  <Icon className="w-8 h-8" />
                </div>
              );
            })}
          </div>

          <GameTutorial 
            title="Ocean Cleanup"
            objective="Clean the ocean by catching trash with your fishing hook!"
            controls="Move your mouse up and down to raise or lower the fishing hook."
            rules={[
               "Catch grey trash icons to earn points.",
               "Avoid the red crabs/scissors! They cut your line and cost a life.",
               "Avoid catching fish! They block your hook.",
               "If trash floats completely off the screen, you lose a life."
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default FishingGame;