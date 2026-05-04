import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Gamepad2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const GameTutorial = ({ title, objective, controls, rules }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white rounded-[2rem] border-4 border-secondary shadow-lg overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-secondary text-white hover:bg-secondary/90 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Info className="w-6 h-6 text-accent" />
          <h3 className="text-2xl font-black">How to Play: {title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t-4 border-secondary"
          >
            <div className="p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <h4 className="text-xl font-bold text-primary uppercase tracking-wide">Objective</h4>
                  <p className="text-lg font-medium text-foreground/80 leading-relaxed bg-muted p-4 rounded-xl border-l-4 border-primary">
                    {objective}
                  </p>
                </div>
                <div className="flex-1 space-y-4">
                  <h4 className="text-xl font-bold text-accent text-secondary uppercase tracking-wide">Controls</h4>
                  <div className="flex items-center gap-4 bg-muted p-4 rounded-xl border-l-4 border-accent">
                    <Gamepad2 className="w-8 h-8 text-secondary" />
                    <p className="text-lg font-medium text-foreground/80 leading-relaxed">
                      {controls}
                    </p>
                  </div>
                </div>
              </div>
              
              {rules && (
                <div className="space-y-4 pt-4 border-t-2 border-muted">
                  <h4 className="text-xl font-bold text-secondary uppercase tracking-wide">Rules & Tips</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border-2 border-blue-100">
                        <span className="text-blue-500 font-black">{idx + 1}.</span>
                        <span className="font-medium text-secondary">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};