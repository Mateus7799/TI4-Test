import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Keyboard, Fish, Recycle, TreePine, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GamesPage = () => {
  const games = [
    {
      id: 'quiz',
      title: 'Sustainability Quiz',
      description: 'Test your knowledge about renewable energy, recycling, climate change, and conservation with our interactive multiple-choice quiz.',
      icon: Brain,
      color: 'primary',
      path: '/games/quiz'
    },
    {
      id: 'typing',
      title: 'Climbing the Tree',
      description: 'Type sustainability words correctly to help your character climb higher. Speed and accuracy increase as you progress through the levels.',
      icon: Keyboard,
      color: 'accent',
      path: '/games/typing'
    },
    {
      id: 'fishing',
      title: 'Ocean Cleanup',
      description: 'Use your fishing rod to catch trash floating in the water. Clean up the ocean while learning about marine pollution and conservation.',
      icon: Fish,
      color: 'secondary',
      path: '/games/fishing'
    },
    {
      id: 'recycling',
      title: 'Recycling Master',
      description: 'Sort falling trash items into the correct recycling bins. Learn which materials go where while racing against the clock.',
      icon: Recycle,
      color: 'primary',
      path: '/games/recycling'
    },
    {
      id: 'eco-challenge',
      title: 'Forest Builder',
      description: 'Plant trees and watch your forest grow. Create patterns, earn bonuses, and learn about the impact of reforestation on our planet.',
      icon: TreePine,
      color: 'accent',
      path: '/games/eco-challenge'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary/10 text-primary',
      accent: 'bg-accent/10 text-accent',
      secondary: 'bg-secondary/10 text-secondary'
    };
    return colors[color] || colors.primary;
  };

  return (
    <>
      <Helmet>
        <title>Interactive Games - NextStep English</title>
        <meta name="description" content="Play 5 interactive sustainability games while learning English. Quiz, typing challenges, ocean cleanup, recycling, and tree planting activities." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
                Interactive sustainability games
              </h1>
              <p className="text-base text-muted-foreground max-w-[65ch] mx-auto leading-relaxed">
                Choose a game below to start learning about environmental protection while improving your English skills. Each game offers unique challenges and educational content.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {games.map((game, index) => {
                const Icon = game.icon;
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={`h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 ${index === 0 ? 'md:col-span-2' : ''}`}>
                      <CardHeader>
                        <div className={`w-14 h-14 rounded-2xl ${getColorClasses(game.color)} flex items-center justify-center mb-4`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <CardTitle className="text-2xl text-balance">{game.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">{game.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto">
                        <Button asChild className="w-full transition-all duration-200 active:scale-98">
                          <Link to={game.path}>
                            Play now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 p-8 rounded-2xl bg-muted/50 text-center"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-4">How to play</h2>
              <p className="text-base text-muted-foreground max-w-[65ch] mx-auto leading-relaxed">
                Each game is designed to be intuitive and educational. Follow the on-screen instructions, complete challenges, and track your progress. The more you play, the more you learn about sustainability and English vocabulary.
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default GamesPage;