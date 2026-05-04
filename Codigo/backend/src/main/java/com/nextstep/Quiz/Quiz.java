package com.nextstep.Quiz;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.nextstep.Professor.Professor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Esta é a entidade raiz do sistema de quizzes.
// Representa um quiz completo criado por um professor,
// como um "jogo" do Kahoot com título, descrição e suas perguntas.
@Entity
@Table(name = "quiz")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome do quiz, ex: "Verbos Irregulares - Nível 1"
    private String titulo;

    // Descrição opcional do quiz, ex: "Quiz para praticar os 20 verbos mais comuns"
    private String descricao;

    // @ManyToOne: muitos quizzes podem ser criados pelo mesmo professor.
    // @JoinColumn: cria a coluna "professor_id" na tabela "quiz" no banco.
    // Não usamos @JsonBackReference aqui porque queremos que o JSON do Quiz
    // mostre os dados do professor (nome, email) que o criou.
    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    // @OneToMany: um quiz tem muitas questões.
    // cascade = CascadeType.ALL: ao salvar um Quiz, o Hibernate salva automaticamente
    // todas as Questoes e, por cascata, todas as Alternativas de cada questão.
    // orphanRemoval = true: se uma questão for removida da lista durante um update,
    // ela é deletada do banco. Isso é essencial para o endpoint de atualização funcionar.
    // @JsonManagedReference: é a "frente" do relacionamento — aparece no JSON normalmente.
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "quiz-questoes")
    private List<Questao> questoes = new ArrayList<>();

    // Registra quando o quiz foi criado. Preenchido automaticamente pelo Service.
    private LocalDateTime dataCriacao;

    // Construtor vazio obrigatório pelo JPA.
    public Quiz() {}

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    public List<Questao> getQuestoes() {
        return questoes;
    }

    public void setQuestoes(List<Questao> questoes) {
        this.questoes = questoes;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}
