import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';
import { toast } from 'sonner';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    setIsLoading(true);
    try {
      await signup(formData.email, formData.password, formData.role, formData.name);
      toast.success('Account created successfully!');
      if (formData.role === 'professor') navigate('/professor-dashboard');
      else navigate('/student-dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Sign Up - NextStep English</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-lg rounded-[2.5rem] border-8 border-primary shadow-2xl overflow-hidden">
            <CardHeader className="bg-primary text-white text-center py-8 relative">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <Rocket className="w-8 h-8" />
              </div>
              <CardTitle className="text-4xl font-black relative z-10">Join the Team!</CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-secondary">I am a...</Label>
                  <RadioGroup 
                    defaultValue={formData.role} 
                    onValueChange={(val) => setFormData({...formData, role: val})}
                    className="flex gap-4"
                  >
                    <div className="flex-1">
                      <RadioGroupItem value="student" id="student" className="peer sr-only" />
                      <Label htmlFor="student" className="flex items-center justify-center h-14 rounded-2xl border-4 border-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 text-lg font-bold cursor-pointer text-foreground">
                        👨‍🎓 Student
                      </Label>
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value="professor" id="professor" className="peer sr-only" />
                      <Label htmlFor="professor" className="flex items-center justify-center h-14 rounded-2xl border-4 border-muted peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/5 text-lg font-bold cursor-pointer text-foreground">
                        👩‍🏫 Teacher
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-bold text-secondary">Full Name</Label>
                  <Input name="name" required value={formData.name} onChange={handleChange} className="h-14 rounded-2xl border-4 border-muted text-lg text-foreground bg-white" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label className="text-lg font-bold text-secondary">Email Address</Label>
                  <Input name="email" type="email" required value={formData.email} onChange={handleChange} className="h-14 rounded-2xl border-4 border-muted text-lg text-foreground bg-white" placeholder="jane@school.edu" />
                </div>
                <div className="space-y-2">
                  <Label className="text-lg font-bold text-secondary">Password (min 8 chars)</Label>
                  <Input name="password" type="password" required minLength={8} value={formData.password} onChange={handleChange} className="h-14 rounded-2xl border-4 border-muted text-lg text-foreground bg-white" placeholder="••••••••" />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-16 rounded-full bg-accent hover:bg-accent/90 text-secondary font-black text-xl shadow-[0_6px_0_rgb(200,160,0)] active:translate-y-1 active:shadow-none transition-all">
                  {isLoading ? 'Creating Account...' : "Let's Go! 🚀"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-muted-foreground font-medium">
                  Already have an account? <Link to="/login" className="text-secondary font-bold hover:underline">Log in</Link>
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

export default SignupPage;