import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Target, Lightbulb, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Story - NextStep English</title>
        <meta name="description" content="Learn about the creator and mission behind NextStep English." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-24"
            >
              <h1 className="text-5xl md:text-7xl font-black text-secondary mb-6">
                Hi, I'm the <span className="text-primary">Creator!</span> 👋
              </h1>
              <p className="text-2xl text-foreground/80 font-medium max-w-3xl mx-auto leading-relaxed">
                I built NextStep English because I believe learning a language should be fun, and saving the planet is everyone's job!
              </p>
            </motion.div>

            {/* Vision & Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-accent rounded-[3rem] p-10 border-4 border-secondary shadow-[8px_8px_0_rgb(34,66,146)] transform -rotate-2"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 border-4 border-secondary">
                  <Target className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-3xl font-black text-secondary mb-4">The Big Goal</h2>
                <p className="text-xl font-medium text-secondary/90 leading-relaxed">
                  To make environmental education accessible to kids everywhere while helping them master English vocabulary. Two birds, one stone!
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-primary rounded-[3rem] p-10 border-4 border-secondary shadow-[8px_8px_0_rgb(34,66,146)] transform rotate-2"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 border-4 border-secondary">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">The Idea</h2>
                <p className="text-xl font-medium text-white/90 leading-relaxed">
                  Traditional textbooks can be boring. By turning sustainability concepts into interactive games, learning becomes an adventure you actually want to go on.
                </p>
              </motion.div>
            </div>

            {/* Why it matters */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-12 border-4 border-secondary shadow-2xl text-center mb-24 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-accent rounded-br-full opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary rounded-tl-full opacity-20"></div>
              
              <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-4xl font-black text-secondary mb-8">Why Sustainability?</h2>
              <p className="text-2xl text-foreground/80 font-medium max-w-3xl mx-auto leading-relaxed">
                Our planet is our only home. By teaching the next generation about recycling, clean energy, and conservation, we are planting the seeds for a greener, healthier future.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-4xl font-black text-secondary mb-8">Join the Adventure!</h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" className="h-16 px-10 rounded-full bg-primary hover:bg-primary/90 text-white text-xl font-bold shadow-[0_8px_0_rgb(130,20,20)] hover:translate-y-1 hover:shadow-[0_4px_0_rgb(130,20,20)] active:translate-y-2 active:shadow-none transition-all">
                  <Link to="/games">
                    Play Games <ArrowRight className="ml-2 w-6 h-6" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;