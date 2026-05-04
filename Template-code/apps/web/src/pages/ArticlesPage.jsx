import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Sparkles } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const ArticlesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const articles = [
    {
      title: 'Renewable Energy Reaches Record Highs',
      description: 'Solar and wind power are taking over! Learn how clean energy is powering our cities.',
      source: 'Eco News',
      category: 'energy',
      color: 'border-yellow-400',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Ocean Cleanup Removes 2 Million Pounds of Plastic',
      description: 'Giant nets are scooping up trash from the sea. Discover how technology saves marine life.',
      source: 'Marine Today',
      category: 'ocean',
      color: 'border-blue-400',
      bg: 'bg-blue-50'
    },
    {
      title: 'Cities Plant 10 Million Trees Worldwide',
      description: 'Urban forests are growing fast! See how trees make our air cleaner and cities cooler.',
      source: 'Green Earth',
      category: 'nature',
      color: 'border-green-400',
      bg: 'bg-green-50'
    },
    {
      title: 'New Tech Breaks Down All Plastics',
      description: 'Scientists found a super-enzyme that eats plastic waste. Is this the end of pollution?',
      source: 'Science Fun',
      category: 'recycling',
      color: 'border-primary',
      bg: 'bg-red-50'
    },
    {
      title: 'Electric Cars Are Everywhere!',
      description: 'More than half of new cars are electric. Learn how batteries are changing transportation.',
      source: 'Future Ride',
      category: 'energy',
      color: 'border-yellow-400',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Coral Reefs Are Bouncing Back',
      description: 'Underwater gardens are healing thanks to new coral farming tricks. Dive into the details!',
      source: 'Ocean Science',
      category: 'ocean',
      color: 'border-blue-400',
      bg: 'bg-blue-50'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Topics', color: 'bg-secondary text-white' },
    { id: 'energy', label: '⚡ Energy', color: 'bg-yellow-400 text-yellow-950' },
    { id: 'ocean', label: '🌊 Oceans', color: 'bg-blue-400 text-blue-950' },
    { id: 'nature', label: '🌳 Nature', color: 'bg-green-400 text-green-950' },
    { id: 'recycling', label: '♻️ Recycling', color: 'bg-primary text-white' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || article.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Helmet>
        <title>Cool Articles - NextStep English</title>
        <meta name="description" content="Read fun and interesting articles about saving the planet!" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center p-3 bg-accent rounded-full mb-6 shadow-lg transform rotate-2">
                <Sparkles className="w-8 h-8 text-accent-foreground" />
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-secondary mb-6">
                Cool <span className="text-primary">Articles</span>
              </h1>
              <p className="text-xl text-foreground/70 font-medium max-w-2xl mx-auto">
                Read awesome stories about how people are protecting the Earth. Learn new words while you read!
              </p>
            </motion.div>

            {/* Search & Filters */}
            <div className="max-w-4xl mx-auto mb-16 space-y-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary rounded-3xl transform translate-y-2 translate-x-1 opacity-20 group-hover:translate-y-3 transition-transform"></div>
                <div className="relative flex items-center bg-white rounded-3xl border-4 border-secondary p-2 shadow-lg">
                  <Search className="w-8 h-8 text-secondary ml-4" />
                  <Input
                    type="text"
                    placeholder="Search for topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 shadow-none text-xl font-medium focus-visible:ring-0 h-14 px-4"
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-6 py-3 rounded-2xl font-bold text-lg border-4 border-transparent transition-all duration-300 hover:-translate-y-1 shadow-md ${
                      activeFilter === filter.id 
                        ? `${filter.color} border-secondary scale-105` 
                        : 'bg-white text-secondary hover:border-secondary/30'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className={`h-full flex flex-col rounded-[2rem] border-4 ${article.color} ${article.bg} shadow-xl overflow-hidden`}>
                    <CardHeader className="bg-white border-b-4 border-inherit p-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-4 py-1 rounded-full bg-secondary text-white text-sm font-bold uppercase tracking-wider">
                          {article.category}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-black text-secondary leading-tight">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <p className="text-lg font-medium text-foreground/80 mb-6 flex-grow">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-black/10">
                        <span className="font-bold text-secondary/60">{article.source}</span>
                        <button className="flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors">
                          Read <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-20">
                <p className="text-2xl font-bold text-secondary/50">No articles found. Try another search!</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ArticlesPage;