package com.nextstep.Aluno;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {

    private final AlunoRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AlunoService(AlunoRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Aluno cadastrar(AlunoCadastroDTO dto) {
        if (repository.existsByMatricula(dto.getMatricula())) {
            throw new RuntimeException("Matrícula já cadastrada");
        }

        Aluno aluno = new Aluno();
        aluno.setNome(dto.getNome());
        aluno.setMatricula(dto.getMatricula());
        aluno.setSenha(passwordEncoder.encode(dto.getSenha()));

        return repository.save(aluno);
    }

    public Aluno login(AlunoLoginDTO dto) {
        Aluno aluno = repository.findByMatricula(dto.getMatricula())
                .orElseThrow(() -> new RuntimeException("Matrícula ou senha inválidos"));

        boolean senhaCorreta = passwordEncoder.matches(dto.getSenha(), aluno.getSenha());

        if (!senhaCorreta) {
            throw new RuntimeException("Matrícula ou senha inválidos");
        }

        return aluno;
    }

    public List<Aluno> listarTodos() {
        return repository.findAll();
    }

    public Optional<Aluno> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Aluno atualizar(Long id, AlunoCadastroDTO dto) {
        return repository.findById(id)
                .map(aluno -> {
                    aluno.setNome(dto.getNome());
                    aluno.setMatricula(dto.getMatricula());

                    if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
                        aluno.setSenha(passwordEncoder.encode(dto.getSenha()));
                    }

                    return repository.save(aluno);
                })
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}