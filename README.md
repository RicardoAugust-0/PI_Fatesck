# Fatesck

Portal acadêmico em **HTML, CSS e JavaScript puro**, com **Firebase** (Authentication + Firestore) como banco.

## Rodar

```bash
npm install
npm start        # abre com live-server em http://127.0.0.1:8080
```

> Os scripts usam `type="module"`, então as páginas precisam ser servidas por HTTP (não funciona abrindo o arquivo direto com duplo clique).

## Estrutura

```
inicio/               tela de escolha (Aluno / Professor)
login_aluno/          login e cadastro do aluno
login_professor/      login e cadastro do professor
inicial_aluno/        área do aluno (início, disciplinas, atividades, notificações)
inicial_professor/    área do professor (início, turmas, atividades, correções, avisos)
css/base.css          estilos
js/firebase.js        configuração do Firebase (SDK via CDN)
js/auth.js            login, cadastro, sessão e logout
js/dados.js           leitura/escrita no Firestore
js/app.js             monta o layout e as páginas internas
firestore.rules       regras de segurança do Firestore
```

## Firebase

No console do projeto `fatesk-3819c`:

1. **Authentication → Método de login**: ative **E-mail/senha**.
2. **Firestore Database**: crie o banco e cole o conteúdo de `firestore.rules` na aba **Regras**.

### Coleções

| Coleção       | Quem escreve | Campos principais |
|---------------|--------------|-------------------|
| `usuarios`    | o próprio usuário (no cadastro) | `nome`, `email`, `perfil` (`aluno`/`professor`) |
| `disciplinas` | professor | `nome`, `professor`, `cor` |
| `turmas`      | professor | `nome`, `disciplina`, `alunos` |
| `atividades`  | professor | `titulo`, `turma`, `disciplina`, `prazo` (AAAA-MM-DD) |
| `avisos`      | professor | `turma`, `texto`, `autor` |
| `envios`      | aluno (entrega) / professor (correção) | `atividadeId`, `atividade`, `alunoUid`, `aluno`, `data`, `status` |

Com o banco vazio, o professor vê na tela inicial o botão **Criar dados de exemplo**, que cadastra disciplinas e turmas iniciais.
