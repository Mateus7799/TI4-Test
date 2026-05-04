import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20 rounded-t-[3rem] border-t-8 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent text-accent-foreground shadow-lg transform -rotate-6">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight">NextStep English</span>
            </div>
            <p className="text-lg text-secondary-foreground/80 leading-relaxed font-medium max-w-[35ch]">
              Learning English and saving the planet, one game at a time! 🌍✨
            </p>
          </div>

          <div className="space-y-6">
            <span className="text-xl font-bold text-accent tracking-wide uppercase">Explore</span>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-lg font-medium text-secondary-foreground/90 hover:text-accent hover:translate-x-2 transition-all duration-300 w-fit">Home Base</Link>
              <Link to="/games" className="text-lg font-medium text-secondary-foreground/90 hover:text-accent hover:translate-x-2 transition-all duration-300 w-fit">Fun Games</Link>
              <Link to="/articles" className="text-lg font-medium text-secondary-foreground/90 hover:text-accent hover:translate-x-2 transition-all duration-300 w-fit">Cool Articles</Link>
            </nav>
          </div>

          <div className="space-y-6">
            <span className="text-xl font-bold text-accent tracking-wide uppercase">Say Hello!</span>
            <p className="text-lg text-secondary-foreground/80 font-medium">Got ideas? Let us know!</p>
            <div className="flex gap-4">
              <a href="mailto:hello@nextstep.edu" className="w-12 h-12 rounded-2xl bg-primary hover:bg-accent hover:text-accent-foreground text-white flex items-center justify-center transition-all duration-300 shadow-lg"><Mail className="w-6 h-6" /></a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-primary hover:bg-accent hover:text-accent-foreground text-white flex items-center justify-center transition-all duration-300 shadow-lg"><Github className="w-6 h-6" /></a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t-2 border-secondary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-base font-medium text-secondary-foreground/70 flex items-center gap-2">
            Made with <Heart className="w-5 h-5 text-primary fill-primary" /> for the Earth
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;