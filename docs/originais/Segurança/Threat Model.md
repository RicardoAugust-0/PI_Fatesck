---
title: "Threat Model"
tags:
  - fatesck
  - seguranca
  - threat-model
  - riscos
---

# Threat Model

## Ameaças Mitigadas

| Ameaça | Mitigação |
|--------|-----------|
| **Interceptação de rede** | TLS 1.3 + E2E |
| **Comprometimento do servidor** | Dados opacos sem chaves do cliente |
| **Ataque ao banco de dados** | Blobs + chaves privadas criptografados |
| **XSS** | CSP, sanitização, tokens em memory |
| **Brute force** | Rate limiting + PBKDF2 alto custo + lockout |
| **Replay** | Nonce IV único + JWT jti + refresh rotation |

## Ameaças Residuais (não mitigadas)

| Ameaça | Impacto | Observação |
|--------|---------|------------|
| **Dispositivo comprometido** | Alto | Keylogger/malware acessa chaves |
| **Perda da senha** | Alto | Sem backdoor → perda total do acesso |
| **Metadados** | Médio | Servidor sabe **quem** fala com **quem** |
| **Object Storage metadata** | Baixo | Nome, tamanho, timestamps visíveis |

> [!danger] Comprometimento do Dispositivo
> Se o navegador do aluno/professor for comprometido, as chaves privadas podem ser acessadas durante o uso (em memória). Sem solução técnica viável no lado do servidor.

> [!info] Metadados
> Apenas o **conteúdo** é opaco. Timestamps, IDs de conexão e identificadores de remetente/destinatário são visíveis ao servidor.

## Checklist de Segurança

- [ ] Geração de chaves RSA-4096 no cliente
- [ ] PBKDF2 com 600.000 iterações
- [ ] AES-GCM 256 para mensagens
- [ ] RSA-OAEP para wrapping
- [ ] ECDSA P-256 para assinaturas
- [ ] JWT + refresh token rotation
- [ ] Cookie HttpOnly para refresh
- [ ] CSP, HSTS, X-Frame-Options
- [ ] Rate limiting
- [ ] TLS 1.3 obrigatório
- [ ] Argon2id para senhas
- [ ] Logs JSON
- [ ] Backup de recuperação (frase de segurança)

## Referências

- [[02 - Segurança E2E]] para estratégia geral
- [[Modelo de Chaves]] para proteção de chaves
- [[Autenticação]] para fluxo de login
- [[00 - Visão Geral]] para restrições de projeto
