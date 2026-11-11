// Acesso aos dados no Firestore.
// Coleções: disciplinas, turmas, atividades, avisos, envios (+ usuarios/{uid}).
import { db } from "./firebase.js";
import {
  collection, getDocs, addDoc, updateDoc, doc, query, where, serverTimestamp, writeBatch
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const lista = snap => snap.docs.map(d => ({ id: d.id, ...d.data() }));
const recentes = arr => arr.sort((a, b) => (b.criadoEm?.toMillis?.() ?? Date.now()) - (a.criadoEm?.toMillis?.() ?? Date.now()));

export const listar = async nome => recentes(lista(await getDocs(collection(db, nome))));
export const enviosDoAluno = async uid => recentes(lista(await getDocs(query(collection(db, "envios"), where("alunoUid", "==", uid)))));

export const criarAtividade = d => addDoc(collection(db, "atividades"), { ...d, criadoEm: serverTimestamp() });
export const criarAviso = d => addDoc(collection(db, "avisos"), { ...d, criadoEm: serverTimestamp() });
export const entregar = d => addDoc(collection(db, "envios"), { ...d, status: "pendente", criadoEm: serverTimestamp() });
export const marcarCorrigido = id => updateDoc(doc(db, "envios", id), { status: "corrigido" });

// Datas: prazo é salvo como "AAAA-MM-DD"
export const formatarData = iso => iso ? iso.split("-").reverse().join("/") : "";
export const formatarTimestamp = ts => ts?.toDate ? ts.toDate().toLocaleDateString("pt-BR") : "agora";

// Dados de exemplo, gravados pelo professor quando o banco está vazio.
export async function semearExemplo() {
  const lote = writeBatch(db), novo = nome => doc(collection(db, nome));
  [
    { nome: "Algoritmos", professor: "Prof. Marcos Lima", cor: "#a21f23" },
    { nome: "Banco de Dados", professor: "Profa. Helena Souza", cor: "#0f6cbd" },
    { nome: "Engenharia de Software", professor: "Prof. Rogério Alves", cor: "#237b4b" },
    { nome: "Redes de Computadores", professor: "Profa. Carla Dias", cor: "#8764b8" }
  ].forEach(d => lote.set(novo("disciplinas"), { ...d, criadoEm: serverTimestamp() }));
  [
    { nome: "ADS 2º semestre", disciplina: "Algoritmos", alunos: 32 },
    { nome: "ADS 4º semestre", disciplina: "Banco de Dados", alunos: 28 },
    { nome: "SI 3º semestre", disciplina: "Engenharia de Software", alunos: 35 }
  ].forEach(t => lote.set(novo("turmas"), { ...t, criadoEm: serverTimestamp() }));
  await lote.commit();
}
