import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gamepad2, BookOpen, Brain, Star, ArrowRight } from 'lucide-react';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [myScores, setMyScores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [q, a, s] = await Promise.all([
          pb.collection('quizzes').getFullList({ $autoCancel: false }),
          pb.collection('articles').getFullList({ $autoCancel: false }),
          pb.collection('game_scores').getFullList({ filter: `userId = "${currentUser.id}"`, sort: '-created', $autoCancel: false })
        ]);
        setQuizzes(q);
        setArticles(a);
        setMyScores(s);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentUser.id]);

  const games = [
    { title: "Recycling Master", path: "/games/recycling", icon: "♻️", color: "bg-green-100 border-green-500 text-green-700" },
    { title: "Ocean Cleanup", path: "/games/fishing", icon: "🌊", color: "bg-blue-100 border-blue-500 text-blue-700" },
    { title: "Forest Builder", path: "/games/eco-challenge", icon: "🌳", color: "bg-emerald-100 border-emerald-500 text-emerald-700" },
    { title: "Word Climber", path: "/games/typing", icon: "⌨️", color: "bg-purple-100 border-purple-500 text-purple-700" },
    { title: "Eco Quiz", path: "/games/quiz", icon: "🧠", color: "bg-yellow-100 border-yellow-500 text-yellow-700" }
  ];

  return (
    <>
      <Helmet><title>My Dashboard - NextStep</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-secondary rounded-[3rem] p-10 mb-12 text-white border-8 border-primary shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-20"><Star className="w-64 h-64" /></div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 relative z-10">Welcome, {currentUser.name || 'Student'}!</h1>
            <p className="text-xl font-medium opacity-90 relative z-10">Ready to learn, play, and save the planet?</p>
          </div>

          <Tabs defaultValue="games" className="w-full">
            <TabsList className="mb-8 p-2 bg-white rounded-3xl border-4 border-muted inline-flex h-auto w-full justify-start overflow-x-auto shadow-sm">
              <TabsTrigger value="games" className="rounded-2xl px-6 py-3 text-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-white"><Gamepad2 className="w-5 h-5 mr-2"/> Play Games</TabsTrigger>
              <TabsTrigger value="quizzes" className="rounded-2xl px-6 py-3 text-lg font-bold data-[state=active]:bg-accent data-[state=active]:text-secondary"><Brain className="w-5 h-5 mr-2"/> Quizzes</TabsTrigger>
              <TabsTrigger value="articles" className="rounded-2xl px-6 py-3 text-lg font-bold data-[state=active]:bg-blue-500 data-[state=active]:text-white"><BookOpen className="w-5 h-5 mr-2"/> Reading</TabsTrigger>
              <TabsTrigger value="scores" className="rounded-2xl px-6 py-3 text-lg font-bold data-[state=active]:bg-secondary data-[state=active]:text-white"><Star className="w-5 h-5 mr-2"/> My Trophies</TabsTrigger>
            </TabsList>

            <TabsContent value="games">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((g, i) => (
                  <Card key={i} className={`rounded-[2rem] border-4 ${g.color} shadow-lg hover:-translate-y-2 transition-transform`}>
                    <CardHeader className="text-center"><div className="text-6xl mb-2">{g.icon}</div><CardTitle className="text-2xl font-black">{g.title}</CardTitle></CardHeader>
                    <CardContent>
                      <Button asChild className="w-full rounded-xl bg-white/50 hover:bg-white text-inherit font-bold border-2 border-current"><Link to={g.path}>Play Now</Link></Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quizzes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map(q => (
                  <Card key={q.id} className="rounded-[2rem] border-4 border-accent bg-accent/10 shadow-md">
                    <CardHeader><CardTitle className="text-2xl font-black text-secondary">{q.title}</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-secondary/80 font-medium mb-6">{q.description}</p>
                      <Button asChild className="rounded-xl bg-accent text-secondary hover:bg-accent/80 font-bold"><Link to={`/games/quiz?id=${q.id}`}>Start Quiz</Link></Button>
                    </CardContent>
                  </Card>
                ))}
                {quizzes.length === 0 && <p className="text-muted-foreground font-bold">No quizzes assigned right now.</p>}
              </div>
            </TabsContent>

            <TabsContent value="articles">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map(a => (
                  <Card key={a.id} className="rounded-[2rem] border-4 border-blue-200 bg-blue-50 shadow-md">
                    <CardHeader><CardTitle className="text-xl font-black text-blue-900">{a.title}</CardTitle></CardHeader>
                    <CardContent>
                      <Button asChild className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold">
                        {a.type === 'external_link' ? <a href={a.url} target="_blank" rel="noopener noreferrer">Read Article <ArrowRight className="w-4 h-4 ml-2"/></a> : <Link to={`/articles`}>Read in Library <ArrowRight className="w-4 h-4 ml-2"/></Link>}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {articles.length === 0 && <p className="text-muted-foreground font-bold">No articles assigned right now.</p>}
              </div>
            </TabsContent>

            <TabsContent value="scores">
               <div className="bg-white rounded-[2rem] border-4 border-muted p-8 overflow-x-auto">
                <h2 className="text-2xl font-black text-secondary mb-6">My Recent Scores</h2>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-4 border-muted">
                      <th className="p-4 font-bold text-secondary">Game</th>
                      <th className="p-4 font-bold text-secondary">Score</th>
                      <th className="p-4 font-bold text-secondary">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myScores.map(s => (
                      <tr key={s.id} className="border-b-2 border-muted/50">
                        <td className="p-4 font-bold text-primary">{s.gameName}</td>
                        <td className="p-4 font-black text-secondary">{s.score}</td>
                        <td className="p-4 text-sm text-muted-foreground">{new Date(s.created).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {myScores.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-muted-foreground font-bold">Play some games to earn scores!</td></tr>}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default StudentDashboard;