import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Droplets, Sun, Coins, Pause, Play, Sprout } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { GameTutorial } from '@/components/GameTutorial.jsx';
import { Button } from '@/components/ui/button';

const ForestBuilderGame = () => {
  const [gameState, setGameState] = useState('start');
  const [money, setMoney] = useState(50);
  const [selectedTool, setSelectedTool] = useState(null); // 'seed', 'water', 'harvest'
  
  // 8 plots
  const [plots, setPlots] = useState(Array(8).fill({ id: 0, planted: false, stage: 0, water: 0 }));

  const buySeed = () => {
    if (money >= 10) {
      setMoney(m => m - 10);
      setSelectedTool('seed');
    }
  };

  const handlePlotClick = (index) => {
    if (gameState !== 'playing') return;
    
    setPlots(prev => {
      const newPlots = [...prev];
      const plot = { ...newPlots[index] };

      if (selectedTool === 'seed' && !plot.planted) {
        plot.planted = true;
        plot.stage = 0;
        plot.water = 0;
        setSelectedTool(null); // use up seed
      } else if (selectedTool === 'water' && plot.planted) {
        plot.water = Math.min(plot.water + 1, 3);
      } else if (selectedTool === 'harvest' && plot.stage >= 3) {
        plot.planted = false;
        plot.stage = 0;
        plot.water = 0;
        setMoney(m => m + 30); // sell for profit
      }
      
      newPlots[index] = plot;
      return newPlots;
    });
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        setPlots(prev => prev.map(plot => {
          if (plot.planted && plot.stage < 3 && plot.water > 0) {
            // Grow if watered
            return { ...plot, stage: plot.stage + 1, water: plot.water - 1 };
          }
          return plot;
        }));
      }, 3000); // Growth tick every 3s
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const startGame = () => { setGameState('playing'); setMoney(50); setPlots(Array(8).fill({ planted: false, stage: 0, water: 0 })); setSelectedTool(null); };

  const renderPlant = (stage) => {
    if (stage === 0) return <Sprout className="w-8 h-8 text-green-300" />;
    if (stage === 1) return <Sprout className="w-12 h-12 text-green-500" />;
    if (stage === 2) return <Sprout className="w-16 h-16 text-green-600" />;
    return <Sprout className="w-20 h-20 text-emerald-800" />; // Mature
  };

  return (
    <>
      <Helmet><title>Forest Builder - NextStep</title></Helmet>
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="max-w-6xl mx-auto px-4 mt-8 flex justify-between items-center">
          <Button asChild variant="ghost" className="rounded-full font-bold text-secondary">
            <Link to="/student-dashboard"><ArrowLeft className="w-5 h-5 mr-2" /> Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-black text-secondary uppercase tracking-widest">Forest Builder</h1>
          {gameState === 'playing' || gameState === 'paused' ? (
             <Button onClick={() => setGameState(s => s==='playing'?'paused':'playing')} variant="outline" className="rounded-full border-4 border-secondary text-secondary font-bold">
               {gameState === 'playing' ? <Pause className="w-5 h-5 mr-2"/> : <Play className="w-5 h-5 mr-2"/>} {gameState === 'playing' ? 'Pause' : 'Resume'}
             </Button>
          ) : <div></div>}
        </div>

        <div className="max-w-5xl mx-auto mt-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-t-3xl border-4 border-b-0 border-secondary">
             <div className="flex gap-6">
               <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-xl border-2 border-yellow-400">
                 <Coins className="w-6 h-6 text-yellow-600" />
                 <span className="text-2xl font-black text-yellow-700">{money}</span>
               </div>
             </div>
             
             {/* Toolbar */}
             <div className="flex gap-4">
               <Button onClick={buySeed} disabled={money < 10} className={`rounded-xl border-4 border-b-8 active:border-b-4 ${selectedTool==='seed'?'ring-4 ring-primary':''}`} variant="outline">
                 Buy Seed (-10)
               </Button>
               <Button onClick={() => setSelectedTool('water')} className={`rounded-xl bg-blue-100 text-blue-700 border-4 border-b-8 border-blue-400 hover:bg-blue-200 ${selectedTool==='water'?'ring-4 ring-primary':''}`}>
                 <Droplets className="w-5 h-5 mr-2" /> Water Tool
               </Button>
               <Button onClick={() => setSelectedTool('harvest')} className={`rounded-xl bg-green-100 text-green-700 border-4 border-b-8 border-green-400 hover:bg-green-200 ${selectedTool==='harvest'?'ring-4 ring-primary':''}`}>
                 Harvest Tool
               </Button>
             </div>
          </div>
          
          <div className="w-full h-[500px] bg-emerald-50 border-4 border-secondary shadow-2xl relative p-8">
            {gameState === 'start' && (
              <div className="absolute inset-0 bg-secondary/80 z-30 flex items-center justify-center">
                <Button onClick={startGame} className="h-20 px-12 rounded-full text-2xl font-black bg-primary text-white shadow-[0_8px_0_rgb(130,20,20)]">Start Farming!</Button>
              </div>
            )}
            
            <div className="grid grid-cols-4 gap-6 h-full">
              {plots.map((plot, i) => (
                <div 
                  key={i} 
                  onClick={() => handlePlotClick(i)}
                  className="bg-amber-900/40 border-4 border-amber-900/60 rounded-3xl cursor-pointer hover:brightness-110 flex flex-col items-center justify-end p-4 relative"
                >
                  {plot.planted && (
                    <>
                      <div className="absolute top-2 right-2 flex gap-1">
                        {[...Array(plot.water)].map((_, wi) => <Droplets key={wi} className="w-4 h-4 text-blue-400 fill-blue-400" />)}
                      </div>
                      {renderPlant(plot.stage)}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <GameTutorial 
            title="Forest Builder"
            objective="Grow plants from seeds, water them, and harvest to earn coins!"
            controls="Select a tool from the top menu, then click on the dirt plots."
            rules={[
               "1. Buy a seed for 10 coins and click an empty plot to plant it.",
               "2. Select the Water Tool and click the planted seed to water it.",
               "3. Plants only grow if they have water! They take a few seconds to grow.",
               "4. Select the Harvest Tool and click a fully grown plant to earn 30 coins."
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default ForestBuilderGame;