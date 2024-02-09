// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5mgrH_R8oNpe1UK6ZobZJuJZ9pORlgS8",
  authDomain: "domotica1-94751.firebaseapp.com",
  projectId: "domotica1-94751",
  storageBucket: "domotica1-94751.appspot.com",
  messagingSenderId: "870869862562",
  appId: "1:870869862562:web:c3727323f8dc63817c6ffb",
  measurementId: "G-MJ05WS8JGF"
};

//Conectamos con la base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore()

//CRUD
export const updateData = (id, ref,objeto) => updateDoc(doc(db,ref,id),objeto)
export const onActualizaDispositivo = (ref, id, callback) => onSnapshot(doc(db, ref, id), callback)

