---
title: "00 - Visão Geral"
tags:
  - fatesck
  - visao-geral
  - sdd
status: draft
aliases:
  - Fatesck - Visão Geral e Requisitos
---

# 00 - Visão Geral

## Resumo

O **Fatesck** é uma plataforma educacional com **criptografia de ponta a ponta**, conectando alunos e professores em um ambiente seguro de comunicação e gestão acadêmica.

> [!tip] Diferencial
> Nenhuma mensagem ou arquivo pode ser lido por terceiros — **nem mesmo pelos administradores do sistema**.

## Atores do Sistema

| Ator | Descrição |
|------|-----------|
| **Aluno** | Consome conteúdo, submete atividades, participa de chats |
| **Professor** | Cria turmas, atividades, avalia submissões |
| **Administrador** | Gerencia usuários e configurações globais |

## O que este documento cobre

Este é o documento de visão geral. Para detalhes específicos, consulte as notas conectadas:

- **Requisitos funcionais** → [[Requisitos Funcionais]]
- **Requisitos não funcionais** → [[Requisitos Não Funcionais]]
- **Arquitetura técnica** → [[01 - Arquitetura]]
- **Segurança E2E** → [[02 - Segurança E2E]]
- **Modelo de dados** → [[03 - Modelo de Dados]]

## Restrições de Projeto

- **Sem leitura do servidor**: Mensagens criptografadas são opacas ao backend
- **Chaves privadas nunca saem do dispositivo** do usuário
- **Conformidade com LGPD**: dados pessoais sujeitos a exclusão/portabilidade

## Restrições Residuais

> [!warning] Ameaças Residuais
> - Dispositivo cliente comprometido (keylogger, malware)
> - Metadados visíveis ao servidor (quem conversa com quem e quando)
> - Sem backdoor — perda da senha = perda do acesso

> [!abstract] Mais detalhes
> Consulte [[Threat Model]] para análise completa de riscos.