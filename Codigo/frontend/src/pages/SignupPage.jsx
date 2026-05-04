import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { registerUser, loading } = useAuth();

  const [role, setRole] = useState('student');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      await registerUser(nome, email, senha, role);
      navigate('/');
    } catch {
      setError('Could not create account.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[440px] overflow-hidden rounded-[32px] border-[6px] border-[#FF4F8B] bg-white shadow-2xl"
      >
        <div className="bg-[#FF4F8B] px-8 py-10 text-center text-white">
          <h1 className="text-4xl font-black">Join the Team!</h1>
        </div>

        <div className="space-y-5 px-8 py-8">
          <div>
            <p className="mb-3 text-sm font-extrabold text-[#24145F]">
              I am a...
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`h-14 rounded-2xl border-4 font-black ${
                  role === 'student'
                    ? 'border-[#FF4F8B] bg-[#FF4F8B]/10 text-[#FF4F8B]'
                    : 'border-gray-200 text-[#24145F]'
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`h-14 rounded-2xl border-4 font-black ${
                  role === 'teacher'
                    ? 'border-[#5B3DF5] bg-[#5B3DF5]/10 text-[#5B3DF5]'
                    : 'border-gray-200 text-[#24145F]'
                }`}
              >
                Teacher
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-extrabold text-[#24145F]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="h-14 w-full rounded-2xl border-4 border-gray-200 px-4 font-semibold outline-none focus:border-[#FF4F8B]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-extrabold text-[#24145F]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 w-full rounded-2xl border-4 border-gray-200 px-4 font-semibold outline-none focus:border-[#FF4F8B]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-extrabold text-[#24145F]">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="h-14 w-full rounded-2xl border-4 border-gray-200 px-4 font-semibold outline-none focus:border-[#FF4F8B]"
              required
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-16 w-full rounded-full bg-[#FFD23F] text-lg font-black text-[#24145F] shadow-[0_7px_0_#D6A600] transition hover:translate-y-1 hover:shadow-[0_3px_0_#D6A600] disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Create Account!'}
          </button>

          <p className="text-center text-sm font-semibold text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-[#5B3DF5] underline">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}