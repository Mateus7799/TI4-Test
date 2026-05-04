import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Timer, Zap } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const TypingGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isLowTime, setIsLowTime] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const wordBank = [
    'tree', 'leaf', 'wind', 'sun', 'water', 'earth', 'green', 'clean', 'save', 'plant',
    'recycle', 'solar', 'ocean', 'nature', 'forest', 'planet', 'energy', 'reduce', 'reuse',
    'compost', 'organic', 'climate', 'carbon', 'habitat', 'ecology', 'wildlife', 'protect',
    'sustainable', 'conservation', 'biodiversity', 'pollution', 'environment', 'renewable'
  ];

  const getRandomWord = (currentCount) => {
    // Difficulty progression: longer words as count increases
    let availableWords = wordBank;
    if (currentCount < 5) {
      availableWords = wordBank.filter(w => w.length <= 5);
    } else if (currentCount < 15) {
      availableWords = wordBank.filter(w => w.length > 4 && w.length <= 8);
    } else {
      availableWords = wordBank.filter(w => w.length > 6);
    }
    
    if (availableWords.length === 0) availableWords = wordBank;
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(timerRef.current);
            setGameOver(true);
            return 0;
          }
          const newTime = prev - 0.1;
          setIsLowTime(newTime <= 3);
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      inputRef.current?.focus();
    }
  }, [gameStarted, gameOver, currentWord]);

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setUserInput(value);

    if (value === currentWord) {
      const newWordsTyped = wordsTyped + 1;
      
      // Calculate time bonus: starts at +3s, decreases by 0.1s per word, min +0.5s
      const timeBonus = Math.max(0.5, 3 - (newWordsTyped * 0.1));
      
      setTimeLeft(prev => prev + timeBonus);
      setScore(prev => prev + (currentWord.length * 10));
      setWordsTyped(newWordsTyped);
      setUserInput('');
      setCurrentWord(getRandomWord(newWordsTyped));
      
      setFeedback('+Time!');
      setTimeout(() => setFeedback(null), 500);
    }
  };

  const handleStart = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setWordsTyped(0);
    setTimeLeft(10);
    setIsLowTime(false);
    setCurrentWord(getRandomWord(0));
    setUserInput('');
  };

  if (gameOver) {
    return (
      <>
        <Helmet><title>Game Over - Word Climber</title></Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <section className="py-20 px-4">
            <div className="max-w-xl mx-auto">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-10 border-8 border-secondary shadow-2xl text-center">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Trophy className="w-12 h-12 text-secondary" />
                </div>
                <h2 className="text-5xl font-black text-secondary mb-4">Time's Up!</h2>
                <div className="bg-muted rounded-3xl p-6 mb-8">
                  <p className="text-xl font-bold text-secondary/70 mb-2">Final Score</p>
                  <p className="text-6xl font-black text-primary">{score}</p>
                  <p className="text-lg font-bold text-secondary mt-4">Words Typed: {wordsTyped}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleStart} size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xl h-16 px-8 shadow-[0_6px_0_rgb(130,20,20)] active:translate-y-1 active:shadow-none">
                    <RotateCcw className="mr-2 w-6 h-6" /> Play Again
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full border-4 border-secondary text-secondary font-bold text-xl h-16 px-8">
                    <Link to="/games">Exit</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
          <Footer />
        </div>
      </>
    );
  }

  if (!gameStarted) {
    return (
      <>
        <Helmet><title>Word Climber - NextStep English</title></Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <section className="py-20 px-4">
            <div className="max-w-2xl mx-auto">
              <Button asChild variant="ghost" className="mb-8 rounded-full font-bold text-secondary hover:bg-secondary/10">
                <Link to="/games"><ArrowLeft className="w-5 h-5 mr-2" /> Back to Games</Link>
              </Button>
              <Card className="rounded-[3rem] border-8 border-secondary shadow-2xl overflow-hidden">
                <div className="bg-secondary p-8 text-center text-white">
                  <CardTitle className="text-5xl font-black mb-4">Word Climber</CardTitle>
                  <p className="text-xl font-medium opacity-90">Type fast to beat the clock!</p>
                </div>
                <CardContent className="p-10 space-y-8 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-3xl border-4 border-blue-200">
                      <Timer className="w-10 h-10 text-blue-500 mb-4" />
                      <h3 className="font-bold text-xl text-secondary mb-2">Beat the Clock</h3>
                      <p className="text-secondary/80 font-medium">Start with 10 seconds. Game ends when time runs out!</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-3xl border-4 border-green-200">
                      <Zap className="w-10 h-10 text-green-500 mb-4" />
                      <h3 className="font-bold text-xl text-secondary mb-2">Earn Time</h3>
                      <p className="text-secondary/80 font-medium">Every correct word adds bonus time. Type fast!</p>
                    </div>
                  </div>
                  <Button onClick={handleStart} className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-2xl h-20 shadow-[0_8px_0_rgb(130,20,20)] active:translate-y-2 active:shadow-none transition-all">
                    Start Typing!
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Playing Word Climber</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <section className="flex-grow py-12 px-4 flex items-center justify-center">
          <div className="max-w-4xl w-full">
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-3xl border-4 border-secondary shadow-lg">
              <div className="text-2xl font-black text-secondary">Score: <span className="text-primary">{score}</span></div>
              <div className={`text-3xl font-black px-6 py-2 rounded-2xl ${isLowTime ? 'bg-destructive text-white animate-pulse' : 'bg-accent text-secondary'}`}>
                {timeLeft.toFixed(1)}s
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border-8 border-secondary shadow-2xl p-12 text-center relative overflow-hidden">
              <AnimatePresence>
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.5 }}
                    animate={{ opacity: 1, y: -50, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 text-3xl font-black text-green-500 drop-shadow-md z-10"
                  >
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-12">
                <p className="text-xl font-bold text-secondary/50 mb-4 uppercase tracking-widest">Type this word:</p>
                <motion.div 
                  key={currentWord}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl md:text-8xl font-black text-secondary tracking-tight"
                >
                  {currentWord}
                </motion.div>
              </div>

              <Input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className={`text-center text-4xl font-bold h-24 rounded-3xl border-4 shadow-inner focus-visible:ring-0 ${
                  userInput && !currentWord.startsWith(userInput) 
                    ? 'border-destructive bg-destructive/10 text-destructive' 
                    : 'border-secondary bg-muted text-secondary'
                }`}
                placeholder="Type here..."
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TypingGame;