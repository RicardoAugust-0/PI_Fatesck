// Autenticação com Firebase Auth (e-mail/senha) + perfil salvo em usuarios/{uid}.
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const MENSAGENS = {
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/user-not-found": "E-mail ou senha incorretos.",
  "auth/wrong-password": "E-mail ou senha incorretos.",
  "auth/email-already-in-use": "Este e-mail já está cadastrado.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/invalid-email": "Digite um e-mail válido.",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente em alguns minutos.",
  "auth/network-request-failed": "Sem conexão com o servidor."
};
const mensagem = e => MENSAGENS[e.code] || "Não foi possível concluir. Tente novamente.";

// Resolve com { uid, email, nome, perfil } do usuário logado, ou null.
export function sessaoAtual() {
  return new Promise(resolve => {
    const parar = onAuthStateChanged(auth, async user => {
      parar();
      if (!user) return resolve(null);
      try {
        const snap = await getDoc(doc(db, "usuarios", user.uid));
        resolve(snap.exists() ? { uid: user.uid, email: user.email, ...snap.data() } : null);
      } catch (e) { console.error(e); resolve(null); }
    });
  });
}

export async function exigirPerfil(perfil, base) {
  const s = await sessaoAtual();
  if (!s || s.perfil !== perfil) { window.location.replace(base + "/inicio/index.html"); return null; }
  return s;
}

export async function sair(base) {
  await signOut(auth);
  window.location.replace(base + "/inicio/index.html");
}

// Usado pelas telas de login (perfil: "aluno" | "professor")
export async function iniciarLogin(perfil) {
  const form = document.getElementById("form-login"), erro = document.getElementById("erro");
  const campoNome = document.getElementById("campo-nome"), titulo = document.getElementById("titulo");
  const btnEnviar = document.getElementById("btn-enviar"), btnAlternar = document.getElementById("btn-alternar");
  const rotulo = perfil === "aluno" ? "Aluno" : "Professor";
  let cadastro = false;

  const s = await sessaoAtual();
  if (s) { window.location.replace("../inicial_" + s.perfil + "/index.html"); return; }

  btnAlternar.addEventListener("click", () => {
    cadastro = !cadastro;
    campoNome.hidden = !cadastro;
    form.nome.required = cadastro;
    form.senha.autocomplete = cadastro ? "new-password" : "current-password";
    titulo.textContent = (cadastro ? "Cadastro do " : "Login do ") + rotulo;
    btnEnviar.textContent = cadastro ? "Criar conta" : "Entrar";
    btnAlternar.textContent = cadastro ? "Já tenho conta" : "Criar conta";
    erro.textContent = "";
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const nome = form.nome.value.trim(), email = form.email.value.trim(), senha = form.senha.value;
    if (cadastro && nome.length < 2) { erro.textContent = "Digite seu nome."; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { erro.textContent = "Digite um e-mail válido."; return; }
    if (senha.length < 6) { erro.textContent = "A senha precisa ter pelo menos 6 caracteres."; return; }
    erro.textContent = ""; btnEnviar.disabled = true;
    try {
      if (cadastro) {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);
        await updateProfile(cred.user, { displayName: nome });
        await setDoc(doc(db, "usuarios", cred.user.uid), { nome, email, perfil, criadoEm: serverTimestamp() });
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, senha);
        const snap = await getDoc(doc(db, "usuarios", cred.user.uid));
        if (!snap.exists() || snap.data().perfil !== perfil) {
          await signOut(auth);
          erro.textContent = "Esta conta não é de " + rotulo.toLowerCase() + ".";
          return;
        }
      }
      window.location.href = "../inicial_" + perfil + "/index.html";
    } catch (err) {
      console.error(err);
      erro.textContent = mensagem(err);
    } finally { btnEnviar.disabled = false; }
  });

  document.getElementById("btn-voltar").addEventListener("click", () => window.location.href = "../inicio/index.html");
}
