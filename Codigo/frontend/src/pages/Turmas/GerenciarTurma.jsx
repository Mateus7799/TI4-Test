import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./GerenciarTurma.css";

function GerenciarTurma() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [busca, setBusca] = useState("");

  const API_TURMAS = "http://localhost:8080/turmas";
  const API_ALUNOS = "http://localhost:8080/alunos";

  useEffect(() => {
    carregarTurma();
    carregarAlunos();
  }, [id]);

  async function carregarTurma() {
    const res = await fetch(`${API_TURMAS}/${id}`);
    const data = await res.json();
    setTurma(data);
  }

  async function carregarAlunos() {
    const res = await fetch(API_ALUNOS);
    const data = await res.json();
    setAlunos(data);
  }

  async function adicionarAluno(idAluno) {
    await fetch(`${API_TURMAS}/${id}/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idAluno }),
    });

    carregarTurma();
  }

  async function removerAluno(idAluno) {
    await fetch(`${API_TURMAS}/${id}/alunos/${idAluno}`, {
      method: "DELETE",
    });

    carregarTurma();
  }

  function alunoJaNaTurma(idAluno) {
    return turma.alunos?.some((a) => a.id === idAluno);
  }

  const alunosFiltrados = alunos.filter((aluno) => {
    const texto = busca.toLowerCase();
    return (
      aluno.nome?.toLowerCase().includes(texto) ||
      aluno.matricula?.toLowerCase().includes(texto)
    );
  });

  if (!turma) return <p className="loading">Loading...</p>;

  return (
    <div className="gerenciar-turma-page">
      {/* HEADER */}
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

      <main className="turma-container">
        {/* VOLTAR */}
        <button className="btn-voltar" onClick={() => navigate("/turmas")}>
          ← Back
        </button>

        {/* HERO */}
        <section className="turma-hero">
          <div>
            <span className="turma-label">Class</span>
            <h2>{turma.nome}</h2>
            <p>
              Grade: <strong>{turma.serie}</strong>
            </p>
          </div>

          <div className="turma-icon">📚</div>
        </section>

        {/* INFO */}
        <section className="turma-info-grid">
          <div className="info-card">
            <h3>Students</h3>
            <p>{turma.alunos?.length || 0}</p>
          </div>

          <div className="info-card">
            <h3>ID</h3>
            <p>{turma.idTurma}</p>
          </div>

          <div className="info-card">
            <h3>Teacher</h3>
            <p>{turma.professor?.nome || "—"}</p>
          </div>
        </section>

        {/* ALUNOS DA TURMA */}
        <section className="alunos-section">
          <h3>Class Students</h3>

          <div className="alunos-lista">
            {turma.alunos?.length > 0 ? (
              turma.alunos.map((aluno) => (
                <div className="aluno-card" key={aluno.id}>
                  <div>
                    <h4>{aluno.nome}</h4>
                    <p>ID: {aluno.matricula}</p>
                  </div>

                  <button
                    className="btn-remover"
                    onClick={() => removerAluno(aluno.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-card">
                No students in this class yet.
              </div>
            )}
          </div>
        </section>

        {/* BUSCA */}
        <section className="form-card">
          <h3>Add Student</h3>

          <input
            className="input-busca"
            type="text"
            placeholder="Search by name or ID..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </section>

        {/* RESULTADOS */}
        <section className="alunos-section">
          <h3>School Students</h3>

          <div className="alunos-lista">
            {alunosFiltrados.length > 0 ? (
              alunosFiltrados.map((aluno) => {
                const jaTem = alunoJaNaTurma(aluno.id);

                return (
                  <div className="aluno-card" key={aluno.id}>
                    <div>
                      <h4>{aluno.nome}</h4>
                      <p>ID: {aluno.matricula}</p>
                    </div>

                    <button
                      className={jaTem ? "btn-adicionado" : "btn-adicionar"}
                      disabled={jaTem}
                      onClick={() => adicionarAluno(aluno.id)}
                    >
                      {jaTem ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="empty-card">No students found.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default GerenciarTurma;