import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function SignupPage() {
  const navigate = useNavigate();
  const { registerUser, loading } = useAuth();

  const [role, setRole] = useState('student');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const createdUser = await registerUser(nome, email, senha, role);
      if (createdUser?.role === 'teacher') {
        navigate('/professor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('e-mail')) {
        setError('Este e-mail já está cadastrado.');
      } else {
        setError('Não foi possível criar a conta. Tente novamente.');
      }
    }
  }

  const isTeacher = role === 'teacher';

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[480px] overflow-hidden rounded-[32px] border-[6px] border-[hsl(var(--primary))] bg-white shadow-2xl"
        >
          {/* Header do card */}
          <div className="bg-[hsl(var(--primary))] px-8 py-10 text-center text-white">
            <h1 className="text-4xl font-black">Criar Conta</h1>
            <p className="mt-2 font-semibold text-white/80">
              {isTeacher
                ? 'Bem-vindo, Professor! Preencha seus dados abaixo.'
                : 'Junte-se à plataforma NextStep English!'}
            </p>
          </div>

          <div className="space-y-5 px-8 py-8">
            {/* Seletor de perfil */}
            <div>
              <p className="mb-3 text-sm font-extrabold text-[hsl(var(--secondary))]">
                Eu sou...
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`h-14 rounded-2xl border-4 font-black transition-colors ${
                    role === 'student'
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                      : 'border-gray-200 text-[hsl(var(--secondary))] hover:border-gray-300'
                  }`}
                >
                  Aluno
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`h-14 rounded-2xl border-4 font-black transition-colors ${
                    role === 'teacher'
                      ? 'border-[hsl(var(--secondary))] bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]'
                      : 'border-gray-200 text-[hsl(var(--secondary))] hover:border-gray-300'
                  }`}
                >
                  Professor
                </button>
              </div>
            </div>

            {/* Nome completo */}
            <div>
              <label className="mb-2 block text-sm font-extrabold text-[hsl(var(--secondary))]">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-14 w-full rounded-2xl border-4 border-gray-200 px-4 font-semibold text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--primary))]"
                required
              />
            </div>

            {/* E-mail */}
            <div>
              <label className="mb-2 block text-sm font-extrabold text-[hsl(var(--secondary))]">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full rounded-2xl border-4 border-gray-200 px-4 font-semibold text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--primary))]"
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label className="mb-2 block text-sm font-extrabold text-[hsl(var(--secondary))]">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="h-14 w-full rounded-2xl border-4 border-gray-200 px-4 font-semibold text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--primary))]"
                required
                minLength={6}
              />
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="mb-2 block text-sm font-extrabold text-[hsl(var(--secondary))]">
                Confirmar senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className={`h-14 w-full rounded-2xl border-4 px-4 font-semibold text-[hsl(var(--foreground))] outline-none transition ${
                  confirmarSenha && senha !== confirmarSenha
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-gray-200 focus:border-[hsl(var(--primary))]'
                }`}
                required
              />
              {confirmarSenha && senha !== confirmarSenha && (
                <p className="mt-1 text-xs font-bold text-red-500">
                  As senhas não coincidem.
                </p>
              )}
            </div>

            {/* Mensagem de erro */}
            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </p>
            )}

            {/* Botão de cadastro */}
            <button
              type="submit"
              disabled={loading}
              className="h-16 w-full rounded-full bg-[hsl(var(--accent))] text-lg font-black text-[hsl(var(--secondary))] shadow-[0_7px_0_hsl(45,60%,40%)] transition hover:translate-y-1 hover:shadow-[0_3px_0_hsl(45,60%,40%)] disabled:opacity-70"
            >
              {loading ? 'Criando conta...' : 'Criar Conta!'}
            </button>

            <p className="text-center text-sm font-semibold text-gray-500">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-black text-[hsl(var(--secondary))] underline">
                Entrar
              </Link>
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
