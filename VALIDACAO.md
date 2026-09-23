# Validação desta entrega

## Concluído

- Leitura dos oito arquivos Markdown fornecidos.
- Compilação de produção com `npm run build`: concluída.
- Verificação estática de TypeScript com `npm run typecheck`: concluída.
- Exportação estática Next.js: concluída, com página principal e página 404.
- Código formatado e lockfile incluído para instalação reproduzível.

## Pendente

A execução do navegador de testes não foi possível neste ambiente. Portanto, os fluxos de cliques e a aparência visual **não foram verificados em um navegador**. Não há afirmação de teste visual ou ponta a ponta aprovado.

O script `scripts/smoke.cjs` foi incluído como roteiro automatizado para uma máquina com Playwright e Chromium disponíveis. Ele cobre entrega, avaliação, criação de turmas e atividades, mensagem, persistência, administrador, restauração, filtros e navegação mobile. O script ainda precisa ser executado com sucesso.

Para executar em ambiente local, depois de iniciar `npm start`:

```bash
npm install --no-save playwright
npx playwright install chromium
node scripts/smoke.cjs
```

O roteiro manual equivalente está no README. Testar ao menos em 360px, 768px e 1440px, com teclado e zoom de 200%. Os requisitos de segurança, performance, disponibilidade, compatibilidade entre navegadores e cobertura de 80% dos anexos não foram aferidos.
