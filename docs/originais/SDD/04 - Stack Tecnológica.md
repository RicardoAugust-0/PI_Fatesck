---
title: "04 - Stack Tecnológica"
tags:
  - fatesck
  - stack
  - tecnologias
---

# 04 - Stack Tecnológica

## Frontend

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Framework | **Next.js 15** (App Router) | SSR + CSR, ecossistema maduro |
| UI Library | **React 19** | Hooks, componentes reutilizáveis |
| State | **Zustand** + **React Query** | Simplicidade + cache de servidor |
| Estilo | **Tailwind CSS** | Utilitários, design responsivo |
| Criptografia | **Web Crypto API** | Nativa do navegador, sem dependências externas |
| WebSocket | **WebSocket nativo** ou **Socket.IO** | Comunicação real-time |
| Forms | **React Hook Form** + **Zod** | Validação tipada e performática |

## Backend

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Framework | **NestJS 11** | Arquitetura modular, injeção de dependência |
| ORM | **Prisma 6** | Type safety, migrations, excelente DX |
| Auth | **Passport.js** + JWT + OAuth | Múltiplos providers |
| WebSocket | **@nestjs/websockets** | Integrado ao NestJS |
| Validation | **class-validator** + **class-transformer** | DTOs seguros |
| Logging | **Pino** | JSON estruturado, alta performance |

## Infraestrutura

| Componente | Tecnologia | Justificativa |
|------------|-----------|---------------|
| Database | **PostgreSQL 16+** | ACID, JSONB, extensões |
| Object Storage | **MinIO** (dev) / **S3** (prod) | API compatível, escalável |
| Containers | **Docker** + **Docker Compose** | Reprodutibilidade |
| Reverse Proxy | **Caddy** | TLS automático, configuração mínima |
| CI/CD | **GitHub Actions** | Automatização de pipeline |

## Referências

- [[01 - Arquitetura]] para diagramas e fluxos
- [[05 - Infraestrutura]] para configuração Docker
