# Fatesck — frontend acadêmico

Base funcional de uma plataforma educacional, criada a partir dos documentos enviados. Visual simples de portal acadêmico; componentes React e tipos TypeScript. Não é um sistema pronto para produção.

## Executar em seu computador

1. Instale o **Node.js 22 LTS** com npm.
2. Extraia este ZIP e abra a pasta `fatesck` no VS Code.
3. No terminal dessa pasta, execute:

```bash
npm ci
npm run dev
```

4. Acesse **http://localhost:3000**.
5. Escolha um perfil e clique em **Entrar na demonstração**. Não há senha nem cadastro real.

Para validar e visualizar a versão compilada:

```bash
npm run typecheck
npm run build
npm start
```

Não abra `out/index.html` com duplo clique: os arquivos do Next.js precisam ser servidos por HTTP. O comando `npm start` inclui um servidor local sem dependências extras. Encerre o servidor de desenvolvimento antes de iniciar outro na mesma porta.

## O que funciona

- Seleção de perfil demonstrativo: aluno, professor ou administrador.
- Painel com turmas, pendências, entregas e média calculada.
- Busca de turmas e detalhes com horários e atividades.
- Busca e filtros de atividades por turma e status.
- Entrega de atividade por texto ou link; edição antes da avaliação.
- Professor: criação de turmas e atividades, nota de 0 a 10 e feedback.
- Mensagens separadas por turma, enviadas e mantidas localmente.
- Administrador: visualização de contas fictícias e alteração demonstrativa de status.
- Troca de perfil, restauração confirmada dos dados e interface responsiva.
- Persistência no navegador e aviso quando não for possível salvar.

**Os três perfis compartilham os mesmos dados demonstrativos.** Há um aluno fictício e uma professora fictícia responsável por todas as turmas. A troca de perfil permite demonstrar a interação entre eles; não representa autorização real.

## Roteiro para apresentar na faculdade

1. Entre como aluno e abra uma atividade pendente.
2. Envie uma resposta ou link fictício.
3. Em Configurações, escolha Professor.
4. Abra a mesma atividade, atribua uma nota e escreva um comentário.
5. Volte para Aluno e confira o feedback e a média no painel.
6. Em Mensagens, envie uma mensagem; troque o perfil e responda na mesma turma.
7. Atualize a página, entre novamente e verifique os dados mantidos no navegador.
8. Teste a largura de celular. O menu fica no botão do cabeçalho.

A entrada é reiniciada ao atualizar, mas o conteúdo demonstrativo permanece. Para limpar tudo, use Configurações → Restaurar dados de exemplo.

## Organização

- `src/app/page.tsx`: entrada da aplicação.
- `src/app/layout.tsx`: idioma, metadados e estilo global.
- `src/app/globals.css`: tokens, estilos e responsividade.
- `src/components/portal.tsx`: navegação e fluxos da demonstração.
- `src/components/ui.tsx`: modal acessível, badge e estado vazio.
- `src/lib/types.ts`: contratos TypeScript.
- `src/lib/demo-data.ts`: dados fictícios iniciais.
- `src/lib/demo-repository.ts`: fronteira de persistência local.
- `scripts/preview.mjs`: servidor local da versão compilada.
- `scripts/smoke.cjs`: verificação dos fluxos no navegador.
- `DOCUMENTACAO.md`: escopo, lacunas e plano de evolução.
- `VALIDACAO.md`: resultados da validação executada.
- `docs/originais/`: documentos fornecidos, preservados.

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 e ícones Lucide. O estilo fica centralizado em CSS com tokens para facilitar o estudo. O Tailwind está configurado e pode ser usado nos próximos componentes. Foi mantido estado React simples nesta primeira versão; Zustand, React Query, React Hook Form e Zod podem ser introduzidos conforme o backend e os formulários crescerem.

## O que ainda não existe

- Backend NestJS, banco PostgreSQL, Prisma, API e autenticação.
- JWT, cookies de sessão, permissões verificadas no servidor e OAuth.
- Criptografia ponta a ponta, geração/armazenamento de chaves e assinaturas.
- Upload/download de arquivos e armazenamento MinIO/S3.
- Chat entre dispositivos e WebSocket.
- Cadastro real, matrículas, múltiplos alunos e recuperação de conta.
- CI/CD, requisitos de disponibilidade, performance ou cobertura de 80%.

As mensagens e entregas locais ficam **em texto claro**. Use somente informações fictícias. A seleção de perfis e o status dos usuários são demonstrativos; desativar um usuário não impede testar seu perfil.

## Dados a substituir

Usuários, disciplinas, horários, orientações e respostas são exemplos. Os prazos iniciais são relativos ao primeiro acesso. O visual e o símbolo foram criados para a demonstração, sem associação visual oficial com uma instituição.

## Próximo passo

Definir os requisitos funcionais e o modelo de dados com o grupo. Separar as telas de `portal.tsx` em módulos por domínio e trocar `demo-repository.ts` por serviços assíncronos da API, mantendo os contratos tipados. Consulte `DOCUMENTACAO.md` antes de implementar autenticação ou criptografia.
