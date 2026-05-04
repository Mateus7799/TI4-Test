package com.nextstep.Quiz;

import com.nextstep.Professor.Professor;
import com.nextstep.Professor.ProfessorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// @Service informa ao Spring que esta classe é um componente de serviço.
// O Spring a registra no "container de inversão de controle" (IoC Container),
// permitindo que seja injetada automaticamente onde necessário (@Autowired ou construtor).
// Esta camada contém as REGRAS DE NEGÓCIO — o que fazer com os dados antes de salvar/retornar.
@Service
public class QuizService {

    // Injeção de dependência via construtor:
    // O Spring injeta automaticamente QuizRepository e ProfessorRepository.
    // ProfessorRepository é necessário para buscar o Professor real do banco
    // antes de salvar o Quiz (evita o erro TransientPropertyValueException).
    private final QuizRepository quizRepository;
    private final ProfessorRepository professorRepository;

    public QuizService(QuizRepository quizRepository, ProfessorRepository professorRepository) {
        this.quizRepository = quizRepository;
        this.professorRepository = professorRepository;
    }

    // =====================================================================
    // CREATE — Criar um novo quiz completo (com questões e alternativas)
    // =====================================================================
    // @Transactional garante que toda a operação ocorre dentro de uma única
    // transação do banco de dados. Se qualquer passo falhar, tudo é revertido
    // (rollback automático). Também mantém o contexto de persistência ativo,
    // evitando LazyInitializationException ao acessar coleções JPA.
    @Transactional
    public Quiz salvar(Quiz quiz) {
        // Define automaticamente a data e hora de criação.
        // LocalDateTime.now() captura o momento exato do servidor.
        quiz.setDataCriacao(LocalDateTime.now());

        // CORREÇÃO DO ERRO 500 — TransientPropertyValueException:
        // Quando o JSON chega com "professor": { "id": 1 }, o Jackson cria um
        // objeto Professor em memória com apenas o ID preenchido. Para o JPA,
        // esse objeto é "transiente" (desconhecido — não carregado do banco).
        // Ao tentar salvar o Quiz referenciando um Professor transiente sem
        // cascade, o Hibernate lança TransientPropertyValueException.
        //
        // A solução é buscar o Professor real do banco pelo ID antes de salvar.
        // professorRepository.findById() retorna uma entidade "gerenciada" (managed)
        // pelo JPA — aí o Hibernate sabe exatamente qual registro referenciar.
        if (quiz.getProfessor() != null && quiz.getProfessor().getId() != null) {
            Professor professor = professorRepository.findById(quiz.getProfessor().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Professor não encontrado com id: " + quiz.getProfessor().getId()));
            quiz.setProfessor(professor);
        }

        // PROBLEMA DO CASCADE:
        // Quando o JSON chega do frontend, o Jackson (biblioteca de serialização)
        // cria os objetos Questao e Alternativa, mas NÃO preenche as referências
        // bidirecionais — ou seja, Questao.quiz fica null e Alternativa.questao fica null.
        // O banco de dados precisa dessas referências para saber em qual quiz/questão
        // cada registro pertence (as colunas "quiz_id" e "questao_id").
        // Por isso percorremos manualmente e setamos as referências:
        if (quiz.getQuestoes() != null) {
            for (Questao questao : quiz.getQuestoes()) {
                // Liga cada questão ao seu quiz pai.
                questao.setQuiz(quiz);

                // Aplica os pontos automaticamente com base na dificuldade informada.
                aplicarPontosPorDificuldade(questao);

                if (questao.getAlternativas() != null) {
                    for (Alternativa alternativa : questao.getAlternativas()) {
                        // Liga cada alternativa à sua questão pai.
                        alternativa.setQuestao(questao);
                    }
                }
            }
        }

        // repository.save() dispara o INSERT no banco.
        // Graças ao CascadeType.ALL nas entidades, um único save() no Quiz
        // salva automaticamente todas as Questoes e todas as Alternativas.
        return quizRepository.save(quiz);
    }

    // =====================================================================
    // READ — Listar todos os quizzes
    // =====================================================================
    public List<Quiz> listarTodos() {
        // findAll() gera: SELECT * FROM quiz (com joins para buscar professor também)
        return quizRepository.findAll();
    }

    // =====================================================================
    // READ — Buscar um quiz específico por ID
    // =====================================================================
    public Optional<Quiz> buscarPorId(Long id) {
        // Optional<Quiz> significa que o resultado pode existir ou não.
        // Evita NullPointerException — quem chama decide o que fazer se não encontrar.
        return quizRepository.findById(id);
    }

    // =====================================================================
    // READ — Listar quizzes criados por um professor específico
    // =====================================================================
    public List<Quiz> listarPorProfessor(Long professorId) {
        // Usa o método customizado definido no Repository.
        // Gerado automaticamente: SELECT * FROM quiz WHERE professor_id = ?
        return quizRepository.findByProfessorId(professorId);
    }

    // =====================================================================
    // UPDATE — Atualizar um quiz existente (substituição completa)
    // =====================================================================
    // @Transactional é OBRIGATÓRIO aqui porque usamos clear() + add() em uma
    // coleção JPA gerenciada. Sem transação ativa, o Hibernate descarregaria
    // a coleção da memória ao final do método, causando LazyInitializationException.
    @Transactional
    public Quiz atualizar(Long id, Quiz quizAtualizado) {
        return quizRepository.findById(id)
                .map(quizExistente -> {
                    // Atualiza os campos simples do quiz.
                    quizExistente.setTitulo(quizAtualizado.getTitulo());
                    quizExistente.setDescricao(quizAtualizado.getDescricao());

                    // Mesma correção do salvar(): busca o professor gerenciado pelo JPA.
                    if (quizAtualizado.getProfessor() != null && quizAtualizado.getProfessor().getId() != null) {
                        Professor professor = professorRepository.findById(quizAtualizado.getProfessor().getId())
                                .orElseThrow(() -> new RuntimeException(
                                        "Professor não encontrado com id: " + quizAtualizado.getProfessor().getId()));
                        quizExistente.setProfessor(professor);
                    }

                    // ESTRATÉGIA DE ATUALIZAÇÃO DAS QUESTÕES:
                    // Não fazemos um simples setQuestoes() porque a lista existente
                    // está sendo monitorada pelo JPA (é uma "coleção persistida").
                    // Precisamos limpar a lista atual e adicionar as novas.
                    //
                    // O clear() remove todas as questões da lista em memória.
                    // Como orphanRemoval=true nas entidades, o Hibernate vai gerar
                    // DELETE automaticamente para as questões removidas no banco.
                    quizExistente.getQuestoes().clear();

                    if (quizAtualizado.getQuestoes() != null) {
                        for (Questao questao : quizAtualizado.getQuestoes()) {
                            // Reconecta cada questão nova ao quiz existente.
                            questao.setQuiz(quizExistente);

                            // Recalcula os pontos caso a dificuldade tenha sido alterada.
                            aplicarPontosPorDificuldade(questao);

                            if (questao.getAlternativas() != null) {
                                for (Alternativa alternativa : questao.getAlternativas()) {
                                    // Reconecta cada alternativa à sua questão.
                                    alternativa.setQuestao(questao);
                                }
                            }
                            // Adiciona a questão nova na lista monitorada pelo JPA.
                            quizExistente.getQuestoes().add(questao);
                        }
                    }

                    return quizRepository.save(quizExistente);
                })
                .orElseThrow(() -> new RuntimeException("Quiz não encontrado com id: " + id));
    }

    // =====================================================================
    // DELETE — Deletar um quiz por ID
    // =====================================================================
    public void deletar(Long id) {
        // deleteById() gera: DELETE FROM quiz WHERE id = ?
        // Graças ao cascade e orphanRemoval, o banco também deleta
        // automaticamente todas as Questoes e Alternativas relacionadas.
        quizRepository.deleteById(id);
    }

    // =====================================================================
    // MÉTODO PRIVADO AUXILIAR — Atribuir pontos com base na dificuldade
    // =====================================================================
    // Método privado: só existe dentro desta classe, ninguém de fora chama.
    // É chamado nos métodos salvar() e atualizar() para centralizar a regra:
    // "os pontos nunca são definidos pelo frontend — só pela dificuldade".
    // Isso é uma REGRA DE NEGÓCIO: independente do que o professor envie no JSON,
    // o sistema sempre sobrescreve os pontos pelo valor correto do enum.
    private void aplicarPontosPorDificuldade(Questao questao) {
        if (questao.getDificuldade() != null) {
            // questao.getDificuldade()           → retorna a constante do enum (ex: DIFICIL)
            // .getValorPontos()                  → retorna o int associado (ex: 3)
            // questao.setPontos(...)             → salva esse valor no campo pontos
            questao.setPontos(questao.getDificuldade().getValorPontos());
        }
    }
}
