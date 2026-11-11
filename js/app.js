// Monta o layout interno (conteúdo + menu lateral à direita) conforme perfil e página.
import { exigirPerfil, sair, sessaoAtual } from "./auth.js";
import {
  listar, enviosDoAluno, criarAtividade, criarAviso, entregar, marcarCorrigido,
  formatarData, formatarTimestamp, semearExemplo
} from "./dados.js";

const b = document.body, perfil = b.dataset.perfil, pagina = b.dataset.pagina, base = b.dataset.base;
const sessao = await exigirPerfil(perfil, base);
if (sessao) montar();

function montar() {
  const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ico = d => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const ICONES = {
    inicio: ico('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>'),
    disciplinas: ico('<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5"/>'),
    atividades: ico('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 11h6M9 15h4"/>'),
    notificacoes: ico('<path d="M6 17V11a6 6 0 1112 0v6l1.5 2h-15z"/><path d="M10 21h4"/>'),
    turmas: ico('<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3 3 0 010 5M18 14c2 .8 3 2.6 3 6"/>'),
    correcoes: ico('<path d="M5 12l4 4 10-10"/><rect x="3" y="3" width="18" height="18" rx="3"/>'),
    avisos: ico('<path d="M4 10v4h3l7 4V6L7 10z"/><path d="M18 9a4 4 0 010 6"/>'),
    sair: ico('<path d="M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h4"/><path d="M15 8l4 4-4 4M19 12H9"/>')
  };
  const MENUS = {
    aluno: [["inicio", "Início"], ["disciplinas", "Disciplinas"], ["atividades", "Atividades"], ["notificacoes", "Notificações"]],
    professor: [["inicio", "Início"], ["turmas", "Minhas turmas"], ["atividades", "Atividades"], ["correcoes", "Correções"], ["avisos", "Avisos"]]
  };
  const dir = base + "/inicial_" + perfil;
  const href = k => k === "inicio" ? dir + "/index.html" : dir + "/" + k + "/index.html";
  const titulo = (MENUS[perfil].find(m => m[0] === pagina) || [0, "Início"])[1];
  const iniciais = (sessao.nome || "?").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  const status = s => `<span class="etiqueta ${s}">${{ pendente: "Pendente", entregue: "Entregue", atrasada: "Atrasada", corrigido: "Corrigido" }[s]}</span>`;
  const vazio = t => `<div class="vazio">${t}</div>`;
  const hoje = new Date().toISOString().slice(0, 10);
  const recente = ts => ts?.toMillis ? Date.now() - ts.toMillis() < 3 * 864e5 : true;

  // Atividades do aluno com status calculado: entregue (tem envio), atrasada (prazo passou) ou pendente.
  async function atividadesDoAluno() {
    const [ativs, envios] = await Promise.all([listar("atividades"), enviosDoAluno(sessao.uid)]);
    const entregues = new Set(envios.map(e => e.atividadeId));
    return ativs.map(a => ({ ...a, status: entregues.has(a.id) ? "entregue" : a.prazo < hoje ? "atrasada" : "pendente" }));
  }
  const linhaAtividade = (a, acao = "") =>
    `<div class="linha"><div><b>${esc(a.titulo)}</b><div class="mudo">${esc(a.disciplina)} · ${esc(a.turma)} · prazo ${formatarData(a.prazo)}</div></div><div class="acoes-linha">${acao}${a.status ? status(a.status) : ""}</div></div>`;

  // ---- páginas ----
  const P = {};

  P["aluno.inicio"] = async () => {
    const [ativs, disc, avisos] = await Promise.all([atividadesDoAluno(), listar("disciplinas"), listar("avisos")]);
    const pend = ativs.filter(a => a.status !== "entregue");
    return `<div class="grade">
      <div class="cartao"><div class="numero">${pend.length}</div><span class="mudo">Atividades pendentes</span></div>
      <div class="cartao"><div class="numero">${disc.length}</div><span class="mudo">Disciplinas</span></div>
      <div class="cartao"><div class="numero">${avisos.filter(a => recente(a.criadoEm)).length}</div><span class="mudo">Avisos novos</span></div></div>
      <h2 class="secao">Próximas atividades</h2>
      <div class="lista">${pend.map(a => linhaAtividade(a)).join("") || vazio("Nenhuma atividade pendente.")}</div>`;
  };
  P["aluno.disciplinas"] = async () => {
    const disc = await listar("disciplinas");
    return disc.length ? `<div class="grade">${disc.map(d =>
      `<div class="cartao"><div class="faixa" style="background:${esc(d.cor)}"></div><h2>${esc(d.nome)}</h2><span class="mudo">${esc(d.professor)}</span></div>`).join("")}</div>`
      : `<div class="lista">${vazio("Nenhuma disciplina cadastrada.")}</div>`;
  };
  P["aluno.atividades"] = async (el) => {
    el.innerHTML = `<div class="filtros">${[["todas", "Todas"], ["pendente", "Pendentes"], ["atrasada", "Atrasadas"], ["entregue", "Entregues"]].map((f, i) =>
      `<button data-f="${f[0]}" aria-pressed="${i === 0}">${f[1]}</button>`).join("")}</div><div class="lista" id="alvo"></div>`;
    let ativs = await atividadesDoAluno(), filtro = "todas";
    const alvo = el.querySelector("#alvo");
    const desenhar = () => {
      alvo.innerHTML = ativs.filter(a => filtro === "todas" || a.status === filtro).map(a =>
        linhaAtividade(a, a.status !== "entregue" ? `<button class="botao sec pequeno" data-entregar="${a.id}">Entregar</button>` : "")).join("") || vazio("Nenhuma atividade neste filtro.");
    };
    alvo.onclick = async e => {
      const btn = e.target.closest("[data-entregar]"); if (!btn) return;
      const a = ativs.find(x => x.id === btn.dataset.entregar);
      btn.disabled = true;
      try {
        await entregar({ atividadeId: a.id, atividade: a.titulo, alunoUid: sessao.uid, aluno: sessao.nome, data: new Date().toLocaleDateString("pt-BR") });
        ativs = await atividadesDoAluno(); desenhar();
      } catch (err) { console.error(err); btn.disabled = false; alert("Não foi possível entregar a atividade."); }
    };
    el.querySelectorAll("[data-f]").forEach(btn => btn.onclick = () => { el.querySelectorAll("[data-f]").forEach(x => x.setAttribute("aria-pressed", x === btn)); filtro = btn.dataset.f; desenhar(); });
    desenhar();
  };
  P["aluno.notificacoes"] = async () => {
    const avisos = await listar("avisos");
    return `<div class="lista">${avisos.map(a => { const nova = recente(a.criadoEm);
      return `<div class="linha${nova ? " nova" : ""}"><div>${esc(a.texto)}<div class="mudo">${esc(a.turma)} · ${esc(a.autor)} · ${formatarTimestamp(a.criadoEm)}</div></div>${nova ? '<span class="etiqueta">Nova</span>' : ""}</div>`; }).join("") || vazio("Nenhuma notificação.")}</div>`;
  };

  P["professor.inicio"] = async (el) => {
    const [turmas, envios, ativs] = await Promise.all([listar("turmas"), listar("envios"), listar("atividades")]);
    const semDados = !turmas.length ? `<div class="cartao form-cartao"><h2>Banco vazio</h2><p class="mudo">Ainda não há turmas nem disciplinas cadastradas.</p>
      <button class="botao" id="semear" style="justify-self:start">Criar dados de exemplo</button></div>` : "";
    el.innerHTML = `${semDados}<div class="grade">
      <div class="cartao"><div class="numero">${turmas.length}</div><span class="mudo">Turmas</span></div>
      <div class="cartao"><div class="numero">${envios.filter(e => e.status === "pendente").length}</div><span class="mudo">Aguardando correção</span></div>
      <div class="cartao"><div class="numero">${ativs.length}</div><span class="mudo">Atividades publicadas</span></div></div>
      <h2 class="secao">Últimos envios</h2>
      <div class="lista">${envios.slice(0, 5).map(e => `<div class="linha"><div><b>${esc(e.aluno)}</b><div class="mudo">${esc(e.atividade)} · ${esc(e.data)}</div></div>${status(e.status)}</div>`).join("") || vazio("Nenhum envio ainda.")}</div>`;
    const btn = el.querySelector("#semear");
    if (btn) btn.onclick = async () => { btn.disabled = true; try { await semearExemplo(); await P["professor.inicio"](el); } catch (err) { console.error(err); btn.disabled = false; alert("Não foi possível criar os dados."); } };
  };
  P["professor.turmas"] = async () => {
    const turmas = await listar("turmas");
    return turmas.length ? `<div class="grade">${turmas.map(t =>
      `<div class="cartao"><h2>${esc(t.nome)}</h2><div class="mudo">${esc(t.disciplina)}</div><p style="margin-top:10px">${esc(t.alunos)} alunos</p></div>`).join("")}</div>`
      : `<div class="lista">${vazio("Nenhuma turma cadastrada.")}</div>`;
  };
  P["professor.atividades"] = async (el) => {
    const turmas = await listar("turmas");
    el.innerHTML = `<form class="cartao form-cartao" id="f"><h2>Nova atividade</h2>
      <div class="campo"><label for="t">Título</label><input id="t" required></div>
      <div class="campo"><label for="u">Turma</label><select id="u" required>${turmas.map((t, i) => `<option value="${i}">${esc(t.nome)}</option>`).join("")}</select></div>
      <div class="campo"><label for="p">Prazo</label><input id="p" type="date" required></div>
      <button class="botao" style="justify-self:start">Publicar atividade</button></form>
      <h2 class="secao">Publicadas</h2><div class="lista" id="alvo"></div>`;
    const desenhar = async () => el.querySelector("#alvo").innerHTML = (await listar("atividades")).map(a => linhaAtividade(a)).join("") || vazio("Nenhuma atividade publicada.");
    el.querySelector("#f").onsubmit = async e => { e.preventDefault();
      const t = turmas[el.querySelector("#u").value]; if (!t) return alert("Cadastre uma turma primeiro.");
      const btn = e.target.querySelector("button"); btn.disabled = true;
      try {
        await criarAtividade({ titulo: el.querySelector("#t").value.trim(), turma: t.nome, disciplina: t.disciplina, prazo: el.querySelector("#p").value, autor: sessao.nome, autorUid: sessao.uid });
        e.target.reset(); await desenhar();
      } catch (err) { console.error(err); alert("Não foi possível publicar a atividade."); } finally { btn.disabled = false; }
    };
    await desenhar();
  };
  P["professor.correcoes"] = async (el) => {
    const desenhar = async () => {
      const envios = await listar("envios");
      el.innerHTML = `<div class="lista">${envios.length ? `<table><thead><tr><th>Aluno</th><th>Atividade</th><th>Data</th><th>Status</th><th></th></tr></thead><tbody>${envios.map(e =>
        `<tr><td>${esc(e.aluno)}</td><td>${esc(e.atividade)}</td><td>${esc(e.data)}</td><td>${status(e.status)}</td><td>${e.status === "pendente" ? `<button class="botao sec pequeno" data-corrigir="${e.id}">Marcar corrigido</button>` : ""}</td></tr>`).join("")}</tbody></table>` : vazio("Nenhum envio ainda.")}</div>`;
    };
    el.onclick = async e => {
      const btn = e.target.closest("[data-corrigir]"); if (!btn) return;
      btn.disabled = true;
      try { await marcarCorrigido(btn.dataset.corrigir); await desenhar(); } catch (err) { console.error(err); btn.disabled = false; alert("Não foi possível atualizar."); }
    };
    await desenhar();
  };
  P["professor.avisos"] = async (el) => {
    const turmas = await listar("turmas");
    el.innerHTML = `<form class="cartao form-cartao" id="f"><h2>Novo aviso</h2>
      <div class="campo"><label for="u">Turma</label><select id="u">${turmas.map(t => `<option>${esc(t.nome)}</option>`).join("")}</select></div>
      <div class="campo"><label for="m">Mensagem</label><textarea id="m" rows="3" required></textarea></div>
      <button class="botao" style="justify-self:start">Enviar aviso</button></form>
      <h2 class="secao">Histórico</h2><div class="lista" id="alvo"></div>`;
    const desenhar = async () => el.querySelector("#alvo").innerHTML = (await listar("avisos")).map(a =>
      `<div class="linha"><div>${esc(a.texto)}<div class="mudo">${esc(a.turma)} · ${formatarTimestamp(a.criadoEm)}</div></div></div>`).join("") || vazio("Nenhum aviso enviado.");
    el.querySelector("#f").onsubmit = async e => { e.preventDefault();
      const turma = el.querySelector("#u").value; if (!turma) return alert("Cadastre uma turma primeiro.");
      const btn = e.target.querySelector("button"); btn.disabled = true;
      try {
        await criarAviso({ turma, texto: el.querySelector("#m").value.trim(), autor: sessao.nome, autorUid: sessao.uid });
        e.target.reset(); await desenhar();
      } catch (err) { console.error(err); alert("Não foi possível enviar o aviso."); } finally { btn.disabled = false; }
    };
    await desenhar();
  };

  // ---- layout ----
  const itens = MENUS[perfil].map(m => `<a class="item" href="${href(m[0])}"${m[0] === pagina ? ' aria-current="page"' : ""}>${ICONES[m[0]]}<span class="oculta">${m[1]}</span></a>`).join("");
  b.innerHTML = `<div class="app">
    <main class="conteudo"><header class="topo"><h1>${titulo}</h1><input class="busca" type="search" placeholder="Buscar" aria-label="Buscar"></header><section id="pagina"><div class="vazio">Carregando…</div></section></main>
    <aside class="menu" aria-label="Menu lateral">
      <div class="menu-topo"><img src="${base}/midia/logo.png" alt="Fatesck">
        <div class="usuario"><span class="avatar">${esc(iniciais)}</span><div><b>${esc(sessao.nome)}</b><span class="mudo">${perfil === "aluno" ? "Aluno" : "Professor"}</span></div></div></div>
      <nav>${itens}</nav>
      <div class="menu-rodape"><button class="item" id="sair" aria-label="Sair">${ICONES.sair}<span class="oculta">Sair</span></button></div>
    </aside></div>`;
  document.title = "Fatesck - " + titulo;
  document.getElementById("sair").onclick = () => sair(base);
  const el = document.getElementById("pagina"), f = P[perfil + "." + pagina];
  f(el).then(html => { if (typeof html === "string") el.innerHTML = html; })
    .catch(err => { console.error(err); el.innerHTML = vazio("Não foi possível carregar os dados. Verifique sua conexão e as regras do Firestore."); });
  // evita voltar do cache para a área interna após logout
  window.addEventListener("pageshow", async e => { if (e.persisted && !(await sessaoAtual())) sair(base); });
}
