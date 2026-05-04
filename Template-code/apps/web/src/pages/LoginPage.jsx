import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const authData = await login(email, password);
      toast.success('Welcome back!');
      if (authData.record.role === 'professor') {
        navigate('/professor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Log In - NextStep English</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md rounded-[2.5rem] border-8 border-secondary shadow-2xl overflow-hidden">
            <CardHeader className="bg-secondary text-white text-center py-10 relative">
              <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles className="w-20 h-20" /></div>
              <CardTitle className="text-4xl font-black relative z-10">Welcome Back!</CardTitle>
              <p className="text-lg text-secondary-foreground/80 mt-2 font-medium relative z-10">Ready for another adventure?</p>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-lg font-bold text-secondary">Email Address</Label>
                  <Input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-2xl border-4 border-muted focus-visible:border-primary text-lg text-foreground bg-white"
                    placeholder="you@school.edu"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-lg font-bold text-secondary">Password</Label>
                  <Input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 rounded-2xl border-4 border-muted focus-visible:border-primary text-lg text-foreground bg-white"
                    placeholder="••••••••"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xl shadow-[0_6px_0_rgb(130,20,20)] active:translate-y-1 active:shadow-none transition-all"
                >
                  {isLoading ? 'Logging in...' : 'Log In!'}
                </Button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-muted-foreground font-medium">
                  Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up free</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;