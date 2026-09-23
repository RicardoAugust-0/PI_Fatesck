/* Requer Playwright: npm install --no-save playwright && npx playwright install chromium
   Com npm start em outro terminal: node scripts/smoke.cjs */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const bundled = process.env.FATESCK_CHROMIUM_MODULE ? require(process.env.FATESCK_CHROMIUM_MODULE) : null;
  const browser = await chromium.launch(bundled ? {headless:true, executablePath:process.env.FATESCK_CHROMIUM_PATH || await bundled.executablePath(), args:bundled.args} : {headless:true});
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const nav = (name) =>
    page.getByRole("navigation").getByRole("button", { name: new RegExp("^" + name) });
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "Entrar na demonstração" }).click();
  await page.getByRole("heading", { name: "Olá, Lucas" }).waitFor();
  fs.mkdirSync("preview", { recursive: true });
  await page.screenshot({ path: "preview/desktop.png", fullPage: true });
  await nav("Atividades").click();
  await page
    .getByRole("button", { name: /Primeira interface com React/ })
    .click();
  await page
    .getByLabel("Sua entrega")
    .fill("Repositório fictício de teste: interface React.");
  await page
    .getByRole("button", { name: "Enviar atividade", exact: true })
    .click();
  await nav("Configurações").click();
  await page.getByLabel("Visualizar como").selectOption("professor");
  await nav("Atividades").click();
  await page
    .getByRole("button", { name: /Primeira interface com React/ })
    .click();
  await page.getByLabel("Nota (0 a 10)").fill("8.5");
  await page.getByLabel("Comentário").fill("Boa organização dos componentes.");
  await page.getByRole("button", { name: "Salvar avaliação" }).click();
  await page
    .getByRole("button", { name: "Nova atividade", exact: true })
    .click();
  await page
    .getByLabel("Título", { exact: true })
    .fill("Atividade criada no teste");
  await page.getByLabel("Prazo de entrega").fill("2026-12-31");
  await page.getByLabel("Orientações").fill("Validar fluxo de publicação.");
  await page.getByRole("button", { name: "Publicar atividade" }).click();
  await page
    .getByRole("button", { name: /Atividade criada no teste/ })
    .waitFor();
  await nav("Turmas").click();
  await page.getByRole("button", { name: "Nova turma", exact: true }).click();
  await page.getByLabel("Nome da disciplina").fill("Algoritmos");
  await page.getByLabel("Código da turma").fill("ALG-TESTE");
  await page
    .getByLabel("Descrição", { exact: true })
    .fill("Turma criada no teste");
  await page.getByRole("button", { name: "Criar turma", exact: true }).click();
  await page.getByLabel("Buscar turma").fill("Algoritmos");
  await page.getByRole("button", { name: /Algoritmos/ }).click();
  await page
    .getByRole("heading", { name: "Algoritmos", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Abrir conversa da turma" }).click();
  await page
    .getByRole("textbox", { name: "Mensagem", exact: true })
    .fill("Mensagem persistida no teste.");
  await page
    .getByRole("button", { name: "Enviar mensagem", exact: true })
    .click();
  await page
    .getByRole("log")
    .getByText("Mensagem persistida no teste.")
    .waitFor();
  await page.reload();
  await page.getByRole("button", { name: "Entrar na demonstração" }).click();
  await nav("Atividades").click();
  await page
    .getByRole("button", { name: /Primeira interface com React/ })
    .click();
  await page.getByText("Nota: 8,5 / 10").waitFor();
  await page.getByText("Boa organização dos componentes.").waitFor();
  await page.keyboard.press("Escape");
  await nav("Mensagens").click();
  await page.getByRole("button", { name: /Algoritmos/ }).click();
  await page
    .getByRole("log")
    .getByText("Mensagem persistida no teste.")
    .waitFor();
  await nav("Configurações").click();
  await page.getByLabel("Visualizar como").selectOption("administrador");
  await nav("Usuários").click();
  await page
    .getByRole("row")
    .filter({ hasText: "Lucas Oliveira" })
    .getByRole("button", { name: "Desativar" })
    .click();
  await page
    .getByRole("row")
    .filter({ hasText: "Lucas Oliveira" })
    .getByText("Inativo", { exact: true })
    .waitFor();
  await nav("Configurações").click();
  await page
    .getByRole("button", { name: "Restaurar dados de exemplo" })
    .click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await page
    .getByRole("button", { name: "Restaurar dados de exemplo" })
    .click();
  await page.getByRole("button", { name: "Sim, restaurar" }).click();
  await page.getByLabel("Visualizar como").selectOption("aluno");
  await nav("Visão geral").click();
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Overflow ${width}`,
    );
    if (width === 360) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      await nav("Mensagens").click();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        "Chat mobile overflow",
      );
      await page.getByRole("button", { name: "Abrir menu" }).click();
      await nav("Visão geral").click();
      await page.screenshot({ path: "preview/mobile.png", fullPage: true });
    }
  }
  await nav("Atividades").click();
  await page.getByLabel("Buscar atividade").fill("inexistente-xyz");
  await page
    .getByText("Nenhuma atividade encontrada com esses filtros.")
    .waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: aluno, entrega, professor, avaliação, atividade, turma, mensagem, persistência, administrador, restauração, busca vazia, Escape, menu mobile e larguras 360/768/1440; sem erros JS.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
