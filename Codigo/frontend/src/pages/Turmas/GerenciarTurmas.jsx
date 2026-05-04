import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GerenciarTurmas.css";

function GerenciarTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [nome, setNome] = useState("");
  const [serie, setSerie] = useState("");

  const navigate = useNavigate();
  const API = "http://localhost:8080/turmas";

  useEffect(() => {
    carregarTurmas();
  }, []);

  async function carregarTurmas() {
    const resposta = await fetch(API);
    const dados = await resposta.json();
    setTurmas(dados);
  }

  async function criarTurma(e) {
    e.preventDefault();

    const novaTurma = {
      nome,
      serie,
    };

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novaTurma),
    });

    setNome("");
    setSerie("");
    carregarTurmas();
  }

  async function excluirTurma(idTurma) {
    await fetch(`${API}/${idTurma}`, {
      method: "DELETE",
    });

    carregarTurmas();
  }

  function abrirTurma(idTurma) {
    navigate(`/turmas/${idTurma}`);
  }

  return (
    <div className="turmas-page">
      <header className="topbar">
        <div className="logo-area">
          <div className="logo-icon">✧</div>
          <h1>
            NextStep <span>English</span>
          </h1>
        </div>

        <nav>
          <a href="/">Home</a>
          <a href="/games">Games</a>
          <a href="/articles">Articles</a>
          <a className="active" href="/turmas">Classes</a>
          <a className="logout" href="/login">Logout</a>
        </nav>
      </header>

      <main className="turmas-container">
        <section className="hero-professor">
          <div>
            <h2>Manage Classes</h2>
            <p>Create classes, organize students, and manage your groups.</p>
          </div>
          <div className="hero-star">☆</div>
        </section>

        <section className="form-card">
          <h3>New Class</h3>

          <form onSubmit={criarTurma}>
            <div className="input-group">
              <label>Class Name</label>
              <input
                type="text"
                placeholder="e.g. Class A"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Grade</label>
              <input
                type="text"
                placeholder="e.g. 7th Grade"
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Create Class
            </button>
          </form>
        </section>

        <section className="turmas-section">
          <h3>My Classes</h3>

          <div className="turmas-grid">
            {turmas.map((turma) => (
              <div className="turma-card" key={turma.idTurma}>
                <div className="turma-header">
                  <span className="tag-serie">{turma.serie}</span>

                  <button
                    className="btn-delete"
                    onClick={() => excluirTurma(turma.idTurma)}
                  >
                    Delete
                  </button>
                </div>

                <h4>{turma.nome}</h4>

                <p>{turma.alunos?.length || 0} students</p>

                <button
                  className="btn-outline"
                  onClick={() => abrirTurma(turma.idTurma)}
                >
                  Manage Class
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default GerenciarTurmas;