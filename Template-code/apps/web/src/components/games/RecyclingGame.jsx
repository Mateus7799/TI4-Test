import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Heart, Pause, Play } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { GameTutorial } from '@/components/GameTutorial.jsx';
import { Button } from '@/components/ui/button';

// Using SVG Icons via Lucide or simple shapes to avoid raw emojis for high quality
import { Milk, FileText, Apple, Box } from 'lucide-react';

const RecyclingGame = () => {
  const [gameState, setGameState] = useState('start'); // start, playing, paused, over
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const requestRef = useRef();
  const lastSpawnRef = useRef(0);

  const bins = [
    { id: 'plastic', color: 'bg-blue-600', label: 'Plastic', border: 'border-blue-800' },
    { id: 'paper', color: 'bg-yellow-500', label: 'Paper', border: 'border-yellow-700' },
    { id: 'organic', color: 'bg-green-600', label: 'Organic', border: 'border-green-800' },
    { id: 'general', color: 'bg-red-600', label: 'General', border: 'border-red-800' }
  ];

  const itemTypes = [
    { type: 'plastic', icon: Milk, points: 10, color: 'text-blue-600' },
    { type: 'paper', icon: FileText, points: 10, color: 'text-yellow-600' },
    { type: 'organic', icon: Apple, points: 10, color: 'text-green-600' },
    { type: 'general', icon: Box, points: 10, color: 'text-red-600' }
  ];

  const spawnItem = (timestamp) => {
    if (timestamp - lastSpawnRef.current > 2000 / speedMultiplier) {
      const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      setItems(prev => [...prev, {
        id: Date.now() + Math.random(),
        ...type,
        y: -10,
        x: Math.random() * 80 + 10,
        speed: (Math.random() * 0.3 + 0.3) * speedMultiplier
      }]);
      lastSpawnRef.current = timestamp;
    }
  };

  const updateGame = (timestamp) => {
    if (gameState !== 'playing') return;
    spawnItem(timestamp);

    setItems(prev => {
      let newLives = lives;
      const updated = prev.map(item => ({ ...item, y: item.y + item.speed })).filter(item => {
        if (item.y > 100) {
          newLives -= 1;
          setFeedback({ id: Date.now(), type: 'miss', x: item.x, y: 90 });
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
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, lives]);

  useEffect(() => {
    // Increase speed every 50 points (10% increase = 1.1 multiplier)
    setSpeedMultiplier(1 + Math.floor(score / 50) * 0.1);
  }, [score]);

  const handleBinClick = (binId) => {
    if (gameState !== 'playing' || items.length === 0) return;
    
    // Sort logic: Clicking a bin attempts to catch the lowest item on screen
    const lowestItem = items.reduce((prev, current) => (prev.y > current.y) ? prev : current);
    
    if (lowestItem.y > 50) { // Only catch if it's somewhat in reach
      if (lowestItem.type === binId) {
        setScore(s => s + 10);
        setFeedback({ id: Date.now(), type: 'success', x: lowestItem.x, y: 80 });
      } else {
        setLives(l => {
          const nl = l - 1;
          if (nl <= 0) setGameState('over');
          return nl;
        });
        setFeedback({ id: Date.now(), type: 'error', x: lowestItem.x, y: 80 });
      }
      setItems(prev => prev.filter(i => i.id !== lowestItem.id));
    }
  };

  const togglePause = () => setGameState(s => s === 'playing' ? 'paused' : 'playing');
  const startGame = () => { setGameState('playing'); setScore(0); setLives(3); setItems([]); setSpeedMultiplier(1); lastSpawnRef.current = performance.now(); };

  return (
    <>
      <Helmet><title>Recycling Master - NextStep</title></Helmet>
      <div className="min-h-screen bg-background pb-20">
        <Header />
        
        <div className="max-w-6xl mx-auto px-4 mt-8 flex justify-between items-center">
          <Button asChild variant="ghost" className="rounded-full font-bold text-secondary">
            <Link to="/student-dashboard"><ArrowLeft className="w-5 h-5 mr-2" /> Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-black text-secondary uppercase tracking-widest">Recycling Master</h1>
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
          
          <div className="relative w-full h-[600px] bg-white border-4 border-secondary shadow-2xl overflow-hidden flex flex-col">
            {/* Game Area */}
            <div className="flex-grow relative bg-slate-50/50">
              {gameState === 'start' && (
                <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm z-30 flex items-center justify-center">
                  <Button onClick={startGame} className="h-20 px-12 rounded-full text-2xl font-black bg-primary hover:bg-primary/90 text-white shadow-[0_8px_0_rgb(130,20,20)] active:translate-y-2 active:shadow-none">
                    Start Sorting!
                  </Button>
                </div>
              )}
              {gameState === 'paused' && (
                <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm z-30 flex items-center justify-center">
                  <h2 className="text-6xl font-black text-white uppercase tracking-widest">Paused</h2>
                </div>
              )}
              {gameState === 'over' && (
                <div className="absolute inset-0 bg-secondary/90 backdrop-blur-md z-30 flex flex-col items-center justify-center">
                  <Trophy className="w-24 h-24 text-accent mb-6" />
                  <h2 className="text-5xl font-black text-white mb-2">Game Over!</h2>
                  <p className="text-2xl font-bold text-accent mb-8">Final Score: {score}</p>
                  <Button onClick={startGame} className="h-16 px-8 rounded-full text-xl font-bold bg-primary hover:bg-primary/90 text-white">Play Again</Button>
                </div>
              )}

              {/* Falling Items */}
              {items.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className={`absolute w-16 h-16 bg-white rounded-2xl shadow-lg border-4 border-muted flex items-center justify-center ${item.color} z-10`} style={{ left: `${item.x}%`, top: `${item.y}%` }}>
                    <Icon className="w-10 h-10" />
                  </div>
                );
              })}

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 1, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: -50, scale: 1.5 }}
                    className={`absolute text-4xl font-black z-20 ${feedback.type === 'success' ? 'text-green-500' : 'text-primary'}`}
                    style={{ left: `${feedback.x}%`, top: `${feedback.y}%` }}
                    onAnimationComplete={() => setFeedback(null)}
                  >
                    {feedback.type === 'success' ? '+10' : feedback.type === 'error' ? '❌' : '⚠️'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bins */}
            <div className="h-48 bg-muted border-t-4 border-secondary p-4 grid grid-cols-4 gap-4">
              {bins.map(bin => (
                <button 
                  key={bin.id} 
                  onClick={() => handleBinClick(bin.id)}
                  disabled={gameState !== 'playing'}
                  className={`w-full h-full rounded-2xl border-4 ${bin.border} ${bin.color} flex flex-col items-center justify-center text-white shadow-lg hover:-translate-y-2 active:translate-y-2 transition-all disabled:opacity-50 disabled:hover:translate-y-0`}
                >
                  <span className="font-black text-xl md:text-2xl tracking-wide uppercase drop-shadow-md">{bin.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <GameTutorial 
            title="Recycling Master"
            objective="Save the planet by sorting falling trash into the correct recycling bins before they hit the ground!"
            controls="Click on the correct colored bin at the bottom when an item falls low enough."
            rules={[
               "Match the item type to the correct bin color.",
               "Green = Organic (Apple), Blue = Plastic (Bottle), Yellow = Paper (Document), Red = General (Box).",
               "You lose a life for sorting incorrectly or letting an item drop.",
               "Speed increases as your score goes up!"
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default RecyclingGame;