import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function Header() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-[5px] border-secondary bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          <Link to={user?.role === 'teacher' ? '/' : '/'} className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg"
            >
              <Sparkles className="h-7 w-7 text-white" />
            </motion.div>
            <span className="text-2xl font-black tracking-tight text-secondary group-hover:text-primary transition-colors">
              NextStep <span className="text-primary">English</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link
              to={user?.role === 'teacher' ? '/' : '/'}
              className={`rounded-2xl px-5 py-2.5 text-base font-bold transition-all hover:-translate-y-0.5 ${
                pathname === '/'
                  ? 'bg-secondary text-white shadow-md'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              Home
            </Link>
            <div className="mx-3 h-7 w-px bg-border" />
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground">
                  Hello, <strong>{user.nome}</strong>!
                </span>
                <Button variant="ghost" size="sm" onClick={logout}
                  className="rounded-2xl text-destructive hover:bg-destructive/10 font-bold">
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="rounded-2xl font-bold text-secondary hover:bg-secondary/10">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild className="rounded-2xl bg-primary text-white font-bold shadow-[0_4px_0_hsl(var(--primary-dark))] hover:translate-y-0.5 hover:shadow-[0_2px_0_hsl(var(--primary-dark))] transition-all">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>

          <button className="md:hidden rounded-xl p-2 text-secondary" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-secondary/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-72 flex-col gap-3 border-l-4 border-secondary bg-background p-6"
            >
              <button className="self-end" onClick={() => setOpen(false)}>
                <X className="h-7 w-7 text-secondary" />
              </button>
              <Link to="/" className="rounded-2xl px-4 py-3 font-bold text-lg hover:bg-accent" onClick={() => setOpen(false)}>Home</Link>
              {user ? (
                <button onClick={() => { logout(); setOpen(false); }}
                  className="rounded-2xl px-4 py-3 font-bold text-lg text-left text-destructive hover:bg-destructive/10">
                  <LogOut className="inline h-5 w-5 mr-2" /> Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login"  className="rounded-2xl px-4 py-3 font-bold text-lg hover:bg-accent" onClick={() => setOpen(false)}>Log In</Link>
                  <Link to="/signup" className="rounded-2xl px-4 py-3 font-bold text-lg text-center bg-primary text-white" onClick={() => setOpen(false)}>Sign Up Free</Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
