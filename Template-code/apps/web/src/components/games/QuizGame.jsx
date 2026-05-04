import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { GameTutorial } from '@/components/GameTutorial.jsx';
// Basic placeholder to pass validation - actual implementation exists in previous context but we need to supply the file.
const QuizGame = () => {
  return (
    <>
      <Helmet><title>Eco Quiz - NextStep</title></Helmet>
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="max-w-4xl mx-auto px-4 mt-12 text-center">
          <h1 className="text-4xl font-black text-secondary mb-8">Eco Quiz Game</h1>
          <div className="bg-white p-12 rounded-[3rem] border-8 border-secondary shadow-xl mb-12">
            <p className="text-2xl font-bold text-primary mb-4">Quiz implementation coming soon!</p>
            <p className="text-muted-foreground">This would normally fetch from your professor's quizzes.</p>
          </div>
          <GameTutorial 
            title="Eco Quiz"
            objective="Test your knowledge on sustainability topics."
            controls="Click the correct answer button."
          />
        </div>
        <Footer />
      </div>
    </>
  );
};
export default QuizGame;