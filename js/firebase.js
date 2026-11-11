// Inicializa o Firebase direto do CDN (sem npm/bundler).
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjGT0ffgKy3HM0cb0p8J98i_eX4suzmDk",
  authDomain: "fatesk-3819c.firebaseapp.com",
  projectId: "fatesk-3819c",
  storageBucket: "fatesk-3819c.firebasestorage.app",
  messagingSenderId: "221479971789",
  appId: "1:221479971789:web:8e49d82840cba9cf3ab284",
  measurementId: "G-3N62JZV09F"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
