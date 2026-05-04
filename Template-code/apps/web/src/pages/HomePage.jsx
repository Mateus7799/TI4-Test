import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, BookOpen, ArrowRight, Globe2, Recycle, Zap } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>NextStep English - Fun Sustainability Learning!</title>
        <meta name="description" content="Learn English and save the planet with fun, interactive games and cool articles!" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden px-4 py-20">
          <div className="absolute inset-0 z-0 m-4 rounded-[3rem] overflow-hidden border-8 border-secondary shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1678690832311-bb6e361989ca" 
              alt="Kids learning about nature"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 1, bounce: 0.4 }}
            >
              <div className="inline-block mb-6 px-6 py-2 rounded-full bg-accent text-accent-foreground font-bold text-lg transform -rotate-2 shadow-lg">
                🌍 Welcome to the future!
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 text-balance drop-shadow-xl" style={{ letterSpacing: '-0.03em' }}>
                Learn English.<br/>
                <span className="text-accent">Save the Planet.</span>
              </h1>
              <p className="text-xl md:text-3xl text-white/90 mb-10 max-w-[40ch] mx-auto font-medium drop-shadow-md">
                Play awesome games, read cool stories, and discover how you can be an Earth Hero!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button asChild size="lg" className="h-16 px-10 rounded-full bg-primary hover:bg-primary/90 text-white text-xl font-bold shadow-[0_8px_0_rgb(130,20,20)] hover:translate-y-1 hover:shadow-[0_4px_0_rgb(130,20,20)] active:translate-y-2 active:shadow-none transition-all">
                  <Link to="/games">
                    <Gamepad2 className="w-6 h-6 mr-3" />
                    Play Games
                  </Link>
                </Button>
                <Button asChild size="lg" className="h-16 px-10 rounded-full bg-white hover:bg-gray-100 text-secondary text-xl font-bold shadow-[0_8px_0_rgb(200,200,200)] hover:translate-y-1 hover:shadow-[0_4px_0_rgb(200,200,200)] active:translate-y-2 active:shadow-none transition-all">
                  <Link to="/articles">
                    <BookOpen className="w-6 h-6 mr-3" />
                    Learn More
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-accent rounded-[3rem] transform rotate-3 opacity-20"></div>
                <div className="relative bg-white p-10 rounded-[3rem] border-4 border-secondary shadow-xl">
                  <h2 className="text-4xl md:text-5xl font-black text-secondary mb-6 leading-tight">
                    Why <span className="text-primary">NextStep</span> English?
                  </h2>
                  <p className="text-xl text-foreground/80 font-medium leading-relaxed mb-6">
                    We believe learning should be an adventure! Our platform mixes English vocabulary with real-world environmental missions.
                  </p>
                  <p className="text-xl text-foreground/80 font-medium leading-relaxed">
                    Whether you're sorting recycling or planting virtual trees, every word you learn helps you understand how to protect our amazing planet.
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Globe2, title: "Global Topics", color: "bg-blue-100 text-secondary border-secondary" },
                  { icon: Recycle, title: "Eco Habits", color: "bg-green-100 text-green-700 border-green-600" },
                  { icon: Zap, title: "Clean Energy", color: "bg-yellow-100 text-yellow-700 border-yellow-500" },
                  { icon: Gamepad2, title: "Fun Games", color: "bg-red-100 text-primary border-primary" }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className={`h-full rounded-3xl border-4 ${feature.color} shadow-lg hover:-translate-y-2 transition-transform duration-300`}>
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm">
                          <feature.icon className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Games Showcase */}
        <section className="py-24 bg-secondary text-secondary-foreground rounded-[3rem] mx-4 border-8 border-primary shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-md">
                Ready to Play?
              </h2>
              <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto">
                Jump into our most popular games and start your eco-adventure today!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Ocean Cleanup", desc: "Catch trash before it pollutes the sea!", path: "/games/fishing", color: "bg-blue-400" },
                { title: "Recycling Master", desc: "Sort the falling items into the right bins!", path: "/games/recycling", color: "bg-green-400" },
                { title: "Word Climber", desc: "Type fast to climb the giant tree!", path: "/games/typing", color: "bg-accent" }
              ].map((game, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 2 : -2 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 ${game.color} rounded-[2.5rem] transform translate-y-4 translate-x-2 opacity-50 group-hover:translate-y-6 transition-transform`}></div>
                  <Card className="relative h-full rounded-[2.5rem] border-4 border-white bg-white text-secondary p-6 shadow-xl flex flex-col">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-3xl font-black">{game.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow">
                      <p className="text-lg font-medium text-secondary/70 mb-8">{game.desc}</p>
                      <Button asChild className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg h-14 mt-auto shadow-[0_4px_0_rgb(130,20,20)] active:translate-y-1 active:shadow-none transition-all">
                        <Link to={game.path}>Play Now!</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Button asChild variant="outline" size="lg" className="rounded-full border-4 border-white text-white hover:bg-white hover:text-secondary font-bold text-xl h-16 px-10 transition-all">
                <Link to="/games">
                  See All Games <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;