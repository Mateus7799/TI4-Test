import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Sparkles, LogOut, LayoutDashboard } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games' },
    { path: '/articles', label: 'Articles' }
  ];

  const dashboardLink = currentUser?.role === 'professor' ? '/professor-dashboard' : '/student-dashboard';
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-secondary bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-lg"
            >
              <Sparkles className="w-7 h-7" />
            </motion.div>
            <span className="text-2xl font-extrabold text-secondary tracking-tight group-hover:text-primary transition-colors duration-300">
              NextStep <span className="text-primary">English</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2.5 rounded-2xl text-base font-bold transition-all duration-300 hover:-translate-y-1 ${
                  isActive(link.path)
                    ? 'bg-secondary text-secondary-foreground shadow-md'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="w-px h-8 bg-border mx-2"></div>
            
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground mr-2">
                  Hi, {currentUser.name || currentUser.email.split('@')[0]}
                </span>
                <Button asChild variant="outline" className="rounded-2xl border-2 border-secondary text-secondary font-bold hover:bg-secondary hover:text-white transition-all shadow-sm">
                  <Link to={dashboardLink}>
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="rounded-2xl text-destructive hover:bg-destructive/10 font-bold">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="rounded-2xl font-bold hover:bg-secondary/10 text-secondary">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <Link to="/signup">Sign Up Free</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Nav */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-accent text-secondary">
                <Menu className="w-8 h-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-4 border-secondary bg-background">
              <div className="flex flex-col gap-6 mt-10">
                {currentUser && (
                  <div className="p-4 bg-muted rounded-2xl mb-4">
                    <p className="font-bold text-secondary text-lg">Hi, {currentUser.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{currentUser.role}</p>
                  </div>
                )}
                
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-5 py-4 rounded-2xl text-lg font-bold transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-muted text-foreground hover:bg-accent'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {currentUser ? (
                  <>
                    <Link to={dashboardLink} onClick={() => setIsOpen(false)} className="px-5 py-4 rounded-2xl text-lg font-bold bg-primary text-white hover:bg-primary/90 flex items-center">
                      <LayoutDashboard className="w-5 h-5 mr-3" /> My Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="px-5 py-4 rounded-2xl text-lg font-bold text-destructive text-left flex items-center hover:bg-destructive/10">
                      <LogOut className="w-5 h-5 mr-3" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-4">
                    <Button asChild variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold border-2 border-secondary text-secondary">
                      <Link to="/login" onClick={() => setIsOpen(false)}>Log In</Link>
                    </Button>
                    <Button asChild className="w-full h-14 rounded-2xl text-lg font-bold bg-primary text-white shadow-lg">
                      <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;