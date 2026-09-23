# Escopo e evolução

## Origem das decisões

O arquivo enviado contém oito documentos Markdown. As pastas de entidades estão vazias. Requisitos Funcionais, Arquitetura e Modelo de Dados aparecem como links, mas seus arquivos não estão no ZIP.

Esta versão é um protótipo executável dos três atores descritos na visão geral. Os dados e relações são provisórios.

| Área | Nesta entrega | Próxima etapa |
|---|---|---|
| Aluno | Turmas, mensagens locais, entrega de texto/link, leitura da nota | Matrículas e submissões por aluno |
| Professor | Criação de turma e atividade; avaliação | Vínculo professor-turma e lista de alunos |
| Administrador | Lista e status demonstrativo de usuários | Gestão real com auditoria e autorização |
| Persistência | localStorage, apenas exemplos | API NestJS e PostgreSQL |
| Autenticação | Seleção de perfil | Login e sessão reais |
| Mensagens | Canal por turma no mesmo navegador | E2E, distribuição de chaves e WebSocket |
| Arquivos | Não implementados | Cifragem no cliente, upload e download |
| Interface | Desktop, tablet e celular | Testes com usuários e revisão de acessibilidade |

## Modelo provisório

`Classroom` contém código, nome, professor textual e horário. `Activity` se relaciona com `Classroom` por `classId`. `Submission` contém atividade, resposta, data, nota e feedback de **um único aluno demonstrativo**. `Message` contém turma, autor, perfil, texto e data. `DemoUser` exemplifica o painel administrativo.

Na integração real, adicionar IDs e relacionamentos de usuários, matrículas e submissões. Validar permissões no backend. O administrador não deve obter acesso ao conteúdo E2E apenas por possuir perfil administrativo: o protótipo compartilhado não representa esse modelo de autorização.

## Decisões de interface

- A entrada não pede credenciais desnecessárias para a demonstração.
- A primeira tela mostra pendências e acesso rápido às turmas.
- Atrasos consideram o fim do dia local; submissões avaliadas não podem ser editadas.
- Prazos atrasados aceitam entrega nesta demonstração. Definir a política real com o grupo.
- Notas vão de 0 a 10; a média inclui apenas entregas avaliadas.
- As telas usam estado local de navegação, sem URLs individuais. Rotas próprias são um passo de evolução.
- HTML semântico, labels, foco visível, modal nativo com Escape e navegação responsiva.

## Ordem sugerida de desenvolvimento

1. Completar SDD: requisitos funcionais, modelo de dados, regras de matrícula, nota e prazo.
2. Dividir a interface em Dashboard, Classes, Activities, Chat, Users e Settings.
3. Implementar API, banco e autorização por recurso e vínculo da turma.
4. Definir e revisar autenticação, cadastro e desbloqueio das chaves.
5. Implementar criptografia em módulo isolado, com testes de integridade, assinatura, destinatários e rotação; revisar o protocolo antes de dados reais.
6. Integrar mensagens cifradas com WebSocket e arquivos cifrados com object storage.
7. Testar integração, acessibilidade e segurança, incluindo isolamento entre turmas e usuários.
8. Configurar pipeline, observabilidade, TLS, headers e avaliar os RNFs com medições.

## Pontos dos anexos a esclarecer

- Há descrições de chave privada que “nunca sai do dispositivo” e de chave privada cifrada armazenada no servidor. Definir se a restrição se refere ao material em texto claro e alinhar os documentos.
- O registro diz que a senha não é enviada ao servidor, enquanto a autenticação prevê hash Argon2id no servidor. Especificar quais credenciais autenticam e quais desbloqueiam as chaves.
- Token em memória não torna a aplicação imune a XSS. Código malicioso executado na origem ainda pode agir na sessão e acessar dados disponíveis ao cliente.
- Recuperação aparece como perda total de acesso e como checklist de frase de recuperação. Escolher o comportamento real.
- Definir como chaves públicas são autenticadas e como alterações são comunicadas, evitando confiar cegamente em uma chave substituída pelo servidor.
- Detalhar campos assinados, identificação de chaves de cifragem e assinatura, associação ao remetente, integridade de metadados e prevenção de replay.
- Nenhum requisito de segurança ou disponibilidade foi considerado atendido apenas por existir esta interface.

Esses pontos são pendências de projeto identificadas na leitura dos anexos, não funcionalidades implementadas.
