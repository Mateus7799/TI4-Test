import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Users, BookOpen, ChartBar as BarChart2, LogOut } from 'lucide-react';

export default function ProfessorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        {/* Cabeçalho da página */}
        <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-[hsl(var(--secondary))]">
              Painel do Professor
            </h1>
            <p className="mt-1 text-lg font-medium text-[hsl(var(--muted-foreground))]">
              Bem-vindo, <strong>{user?.nome}</strong>! Gerencie suas turmas e conteúdos.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-2xl border-4 border-[hsl(var(--primary))] px-5 py-3 font-bold text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))]/10"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>

        {/* Cards de acesso rápido */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <DashboardCard
            icon={<Users className="h-10 w-10 text-[hsl(var(--secondary))]" />}
            title="Turmas"
            description="Visualize e gerencie suas turmas de alunos."
            color="border-[hsl(var(--secondary))]"
            bg="bg-[hsl(var(--secondary))]/5"
            onClick={() => navigate('/turmas')}
          />
          <DashboardCard
            icon={<BookOpen className="h-10 w-10 text-[hsl(var(--primary))]" />}
            title="Quizzes"
            description="Crie e acompanhe os quizzes da turma."
            color="border-[hsl(var(--primary))]"
            bg="bg-[hsl(var(--primary))]/5"
            onClick={() => {}}
            disabled
          />
          <DashboardCard
            icon={<BarChart2 className="h-10 w-10 text-[hsl(var(--accent-foreground))]" />}
            title="Desempenho"
            description="Acompanhe o progresso dos alunos."
            color="border-[hsl(var(--accent))]"
            bg="bg-[hsl(var(--accent))]/10"
            onClick={() => {}}
            disabled
          />
        </div>

        {/* Informações do professor */}
        <div className="mt-10 overflow-hidden rounded-[24px] border-4 border-[hsl(var(--border))] bg-white shadow-sm">
          <div className="border-b-4 border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-8 py-5">
            <h2 className="text-xl font-black text-white">Meus dados</h2>
          </div>
          <div className="space-y-4 px-8 py-6">
            <InfoRow label="Nome" value={user?.nome} />
            <InfoRow label="E-mail" value={user?.email} />
            <InfoRow label="Perfil" value="Professor" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DashboardCard({ icon, title, description, color, bg, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-start gap-4 rounded-[24px] border-4 ${color} ${bg} p-6 text-left shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <div className={`rounded-2xl border-4 ${color} bg-white p-3`}>{icon}</div>
      <div>
        <h3 className="text-xl font-black text-[hsl(var(--secondary))]">{title}</h3>
        <p className="mt-1 text-sm font-medium text-[hsl(var(--muted-foreground))]">
          {description}
        </p>
        {disabled && (
          <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-400">
            Em breve
          </span>
        )}
      </div>
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[hsl(var(--border))] pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:gap-0">
      <span className="w-32 text-sm font-extrabold text-[hsl(var(--secondary))]">{label}</span>
      <span className="font-semibold text-[hsl(var(--foreground))]">{value || '—'}</span>
    </div>
  );
}
