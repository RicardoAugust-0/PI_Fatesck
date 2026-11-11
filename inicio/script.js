import { sessaoAtual } from "../js/auth.js";

// Se já existe sessão, vai direto para a área do usuário
const sessao = await sessaoAtual();
if (sessao) window.location.replace("../inicial_" + sessao.perfil + "/index.html");

document.getElementById("btn-aluno").addEventListener("click", () => window.location.href = "../login_aluno/index.html");
document.getElementById("btn-professor").addEventListener("click", () => window.location.href = "../login_professor/index.html");
