import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { GameTutorial } from '@/components/GameTutorial.jsx';
// Replaced functionally by ForestBuilderGame, kept for routing compatibility
const EcoChallengeGame = () => {
  return (
    <>
      <Helmet><title>Eco Challenge - NextStep</title></Helmet>
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="max-w-4xl mx-auto px-4 mt-12 text-center">
          <h1 className="text-4xl font-black text-secondary mb-8">Eco Challenge</h1>
          <div className="bg-white p-12 rounded-[3rem] border-8 border-secondary shadow-xl mb-12">
            <p className="text-2xl font-bold text-primary mb-4">Try the new Forest Builder instead!</p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default EcoChallengeGame;