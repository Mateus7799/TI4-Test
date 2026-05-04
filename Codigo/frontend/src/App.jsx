import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext.jsx';

import HomePage from '@/pages/HomePage.jsx';
import GerenciarTurmas from "./pages/Turmas/GerenciarTurmas";
import GerenciarTurma from "./pages/Turmas/GerenciarTurma";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* TURMAS */}
          <Route path="/turmas" element={<GerenciarTurmas />} />
          <Route path="/turmas/:id" element={<GerenciarTurma />} />

          {/* AUTH */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}