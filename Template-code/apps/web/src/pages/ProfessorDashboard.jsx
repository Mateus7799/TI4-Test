import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FileText, BookOpen, Users, BarChart } from 'lucide-react';
import { toast } from 'sonner';

const ProfessorDashboard = () => {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [scores, setScores] = useState([]);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  // Form states
  const [quizForm, setQuizForm] = useState({ title: '', description: '', questions: [] });
  const [articleForm, setArticleForm] = useState({ title: '', content: '', url: '', type: 'original' });

  const fetchData = async () => {
    try {
      const [q, a, s] = await Promise.all([
        pb.collection('quizzes').getFullList({ filter: `professorId = "${currentUser.id}"`, $autoCancel: false }),
        pb.collection('articles').getFullList({ filter: `professorId = "${currentUser.id}"`, $autoCancel: false }),
        pb.collection('game_scores').getFullList({ expand: 'userId', $autoCancel: false, sort: '-created' })
      ]);
      setQuizzes(q);
      setArticles(a);
      setScores(s);
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser.id]);

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    try {
      const data = { ...quizForm, professorId: currentUser.id };
      if (quizForm.id) await pb.collection('quizzes').update(quizForm.id, data, { $autoCancel: false });
      else await pb.collection('quizzes').create(data, { $autoCancel: false });
      toast.success('Quiz saved!');
      setIsQuizModalOpen(false);
      fetchData();
    } catch (err) { toast.error(err.message); }
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    try {
      const data = { ...articleForm, professorId: currentUser.id };
      if (articleForm.id) await pb.collection('articles').update(articleForm.id, data, { $autoCancel: false });
      else await pb.collection('articles').create(data, { $autoCancel: false });
      toast.success('Article saved!');
      setIsArticleModalOpen(false);
      fetchData();
    } catch (err) { toast.error(err.message); }
  };

  const deleteItem = async (collection, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await pb.collection(collection).delete(id, { $autoCancel: false });
      toast.success('Deleted successfully');
      fetchData();
    } catch (err) { toast.error(err.message); }
  };

  const openEditQuiz = (q) => { setQuizForm(q); setIsQuizModalOpen(true); };
  const openNewQuiz = () => { setQuizForm({ title: '', description: '', questions: [{ question: '', options: ['','','',''], correct: 0 }] }); setIsQuizModalOpen(true); };

  const openEditArticle = (a) => { setArticleForm(a); setIsArticleModalOpen(true); };
  const openNewArticle = () => { setArticleForm({ title: '', content: '', url: '', type: 'original' }); setIsArticleModalOpen(true); };

  return (
    <>
      <Helmet><title>Professor Dashboard - NextStep</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-4xl font-black text-secondary mb-2">Teacher Dashboard</h1>
              <p className="text-lg text-muted-foreground font-medium">Manage your classroom content and monitor progress.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="rounded-[2rem] border-4 border-secondary shadow-lg">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-2xl"><FileText className="w-8 h-8 text-blue-600" /></div>
                <div><p className="text-3xl font-black text-secondary">{quizzes.length}</p><p className="text-sm font-bold text-muted-foreground uppercase">Quizzes</p></div>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-4 border-accent shadow-lg">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-yellow-100 rounded-2xl"><BookOpen className="w-8 h-8 text-yellow-600" /></div>
                <div><p className="text-3xl font-black text-secondary">{articles.length}</p><p className="text-sm font-bold text-muted-foreground uppercase">Articles</p></div>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-4 border-primary shadow-lg">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-red-100 rounded-2xl"><BarChart className="w-8 h-8 text-red-600" /></div>
                <div><p className="text-3xl font-black text-secondary">{scores.length}</p><p className="text-sm font-bold text-muted-foreground uppercase">Student Scores</p></div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="quizzes" className="w-full">
            <TabsList className="mb-8 p-1 bg-muted rounded-2xl inline-flex h-auto w-full justify-start overflow-x-auto">
              <TabsTrigger value="quizzes" className="rounded-xl px-8 py-3 text-lg font-bold data-[state=active]:bg-secondary data-[state=active]:text-white">Manage Quizzes</TabsTrigger>
              <TabsTrigger value="articles" className="rounded-xl px-8 py-3 text-lg font-bold data-[state=active]:bg-secondary data-[state=active]:text-white">Manage Articles</TabsTrigger>
              <TabsTrigger value="scores" className="rounded-xl px-8 py-3 text-lg font-bold data-[state=active]:bg-secondary data-[state=active]:text-white">Student Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="quizzes" className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border-4 border-muted">
                <h2 className="text-2xl font-black text-secondary">Your Quizzes</h2>
                <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
                  <DialogTrigger asChild><Button onClick={openNewQuiz} className="rounded-xl font-bold bg-primary text-white"><Plus className="w-5 h-5 mr-2" /> New Quiz</Button></DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] border-4 border-secondary p-8 bg-white">
                    <DialogHeader><DialogTitle className="text-2xl font-black text-secondary">{quizForm.id ? 'Edit Quiz' : 'Create Quiz'}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSaveQuiz} className="space-y-6 mt-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Quiz Title</Label>
                        <Input required value={quizForm.title} onChange={e => setQuizForm({...quizForm, title: e.target.value})} className="border-2 text-foreground bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Description</Label>
                        <Input value={quizForm.description} onChange={e => setQuizForm({...quizForm, description: e.target.value})} className="border-2 text-foreground bg-white" />
                      </div>
                      {/* Simplified Q builder for demo */}
                      <div className="p-4 bg-muted rounded-xl border-2 border-border">
                        <p className="font-bold text-secondary mb-2">Question 1</p>
                        <Input placeholder="Question text" value={quizForm.questions[0]?.question || ''} onChange={e => {
                          const q = [...quizForm.questions]; if(!q[0]) q[0] = {options:['','','',''], correct:0}; q[0].question = e.target.value; setQuizForm({...quizForm, questions: q});
                        }} className="mb-2 text-foreground bg-white" />
                        <div className="grid grid-cols-2 gap-2">
                           {[0,1,2,3].map(i => (
                             <Input key={i} placeholder={`Option ${i+1}`} value={quizForm.questions[0]?.options[i] || ''} onChange={e => {
                               const q = [...quizForm.questions]; q[0].options[i] = e.target.value; setQuizForm({...quizForm, questions: q});
                             }} className="border-2 text-foreground bg-white" />
                           ))}
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-primary font-bold text-white rounded-xl">Save Quiz</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {quizzes.length === 0 ? <p className="text-center p-10 text-muted-foreground font-bold">No quizzes yet. Create one!</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes.map(q => (
                    <Card key={q.id} className="rounded-[2rem] border-4 border-muted shadow-sm hover:shadow-md">
                      <CardHeader><CardTitle className="text-xl font-bold">{q.title}</CardTitle></CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{q.description}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openEditQuiz(q)} className="rounded-xl border-2"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                          <Button variant="destructive" onClick={() => deleteItem('quizzes', q.id)} className="rounded-xl"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="articles" className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border-4 border-muted">
                <h2 className="text-2xl font-black text-secondary">Your Articles</h2>
                <Dialog open={isArticleModalOpen} onOpenChange={setIsArticleModalOpen}>
                  <DialogTrigger asChild><Button onClick={openNewArticle} className="rounded-xl font-bold bg-accent text-secondary"><Plus className="w-5 h-5 mr-2" /> New Article</Button></DialogTrigger>
                  <DialogContent className="max-w-xl rounded-[2rem] border-4 border-secondary p-8 bg-white">
                    <DialogHeader><DialogTitle className="text-2xl font-black text-secondary">{articleForm.id ? 'Edit Article' : 'Create Article'}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSaveArticle} className="space-y-6 mt-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Article Title</Label>
                        <Input required value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} className="border-2 text-foreground bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Type</Label>
                        <select value={articleForm.type} onChange={e => setArticleForm({...articleForm, type: e.target.value})} className="w-full p-3 rounded-xl border-2 bg-white text-foreground">
                          <option value="original">Original Content</option>
                          <option value="external_link">External Link</option>
                        </select>
                      </div>
                      {articleForm.type === 'original' ? (
                        <div className="space-y-2">
                          <Label className="text-foreground">Content</Label>
                          <textarea className="w-full p-3 rounded-xl border-2 bg-white text-foreground min-h-[150px]" value={articleForm.content} onChange={e => setArticleForm({...articleForm, content: e.target.value})} />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label className="text-foreground">URL</Label>
                          <Input type="url" required value={articleForm.url} onChange={e => setArticleForm({...articleForm, url: e.target.value})} className="border-2 text-foreground bg-white" />
                        </div>
                      )}
                      <Button type="submit" className="w-full bg-accent text-secondary font-bold rounded-xl">Save Article</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {articles.length === 0 ? <p className="text-center p-10 text-muted-foreground font-bold">No articles yet.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map(a => (
                    <Card key={a.id} className="rounded-[2rem] border-4 border-muted shadow-sm hover:shadow-md">
                      <CardHeader><CardTitle className="text-xl font-bold">{a.title}</CardTitle></CardHeader>
                      <CardContent>
                        <p className="text-sm uppercase font-bold text-primary mb-4">{a.type.replace('_', ' ')}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openEditArticle(a)} className="rounded-xl border-2"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                          <Button variant="destructive" onClick={() => deleteItem('articles', a.id)} className="rounded-xl"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scores">
              <div className="bg-white rounded-[2rem] border-4 border-muted p-8 overflow-x-auto">
                <h2 className="text-2xl font-black text-secondary mb-6">Recent Student Activity</h2>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-4 border-muted">
                      <th className="p-4 font-bold text-secondary">Student</th>
                      <th className="p-4 font-bold text-secondary">Game / Quiz</th>
                      <th className="p-4 font-bold text-secondary">Score</th>
                      <th className="p-4 font-bold text-secondary">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map(s => (
                      <tr key={s.id} className="border-b-2 border-muted/50 hover:bg-muted/20">
                        <td className="p-4 font-medium text-foreground">{s.expand?.userId?.name || s.expand?.userId?.email}</td>
                        <td className="p-4 font-bold text-primary">{s.gameName}</td>
                        <td className="p-4 font-black text-secondary">{s.score}</td>
                        <td className="p-4 text-sm text-muted-foreground">{new Date(s.created).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {scores.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-muted-foreground font-bold">No scores recorded yet.</td></tr>}
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

export default ProfessorDashboard;