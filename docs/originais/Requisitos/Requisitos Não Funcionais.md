---
title: "Requisitos Não Funcionais"
tags:
  - fatesck
  - requisitos
  - nao-funcionais
---

# Requisitos Não Funcionais

## Segurança

| ID | Requisito | Descrição |
|----|-----------|-----------|
| **RNF-S1** | E2E obrigatório | Mensagens e arquivos criptografados no cliente |
| **RNF-S2** | Zero-knowledge | Servidor nunca acessa chaves privadas |
| **RNF-S3** | TLS 1.3 | Comunicação cliente-servidor obrigatória |
| **RNF-S4** | Hash de senhas | `Argon2id` (OWASP recomendado) |
| **RNF-S5** | Rate limiting | Proteção contra brute force |
| **RNF-S6** | Headers seguros | CSP, HSTS, X-Frame-Options |
| **RNF-S7** | Auditoria | Logs imutáveis para ações administrativas |

## Performance

> [!info] Metas de Latência

| ID | Requisito | Meta |
|----|-----------|------|
| **RNF-P1** | API p50 | < 100ms |
| **RNF-P2** | API p95 | < 200ms |
| **RNF-P3** | FCP | < 1.5s em 4G |
| **RNF-P4** | WebSocket | < 500ms (mesma região) |
| **RNF-P5** | Upload | Até 100MB sem degradação |

## Escalabilidade

| ID | Requisito | Descrição |
|----|-----------|-----------|
| **RNF-E1** | Horizontal | Backend e DB suportam escala horizontal |
| **RNF-E2** | Concorrência | 5.000 conexões WebSocket simultâneas |
| **RNF-E3** | Multi-região | Preparado para expansão futura |

## Disponibilidade

| ID | Requisito | Descrição |
|----|-----------|-----------|
| **RNF-D1** | SLA | 99.9% (~43min downtime/mês) |
| **RNF-D2** | Backup | Automatizado a cada 6 horas |
| **RNF-D3** | Recovery | RPO < 1h, RTO < 4h |

## Compatibilidade

| ID | Requisito | Descrição |
|----|-----------|-----------|
| **RNF-C1** | Navegadores | Chrome 120+, Firefox 120+, Safari 17+, Edge 120+ |
| **RNF-C2** | Dispositivos | Desktop 1280px+, Tablet 768px+, Mobile 360px+ |
| **RNF-C3** | Criptografia | Web Crypto API obrigatória |

## Manutenibilidade

| ID | Requisito | Descrição |
|----|-----------|-----------|
| **RNF-M1** | Cobertura de testes | Mínimo 80% em lógica de negócio e segurança |
| **RNF-M2** | CI/CD | Pipeline automatizado (lint, testes, build) |
| **RNF-M3** | Logging | JSON estruturado para agregação |

> [!abstract] Ver também
> - [[Fluxo - Mensagem E2E]] para criptografia
> - [[Autenticação]] para fluxo de login
> - [[Threat Model]] para análise de riscos