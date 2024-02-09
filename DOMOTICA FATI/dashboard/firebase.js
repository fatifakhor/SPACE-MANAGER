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

export const saveData2 = (ref, id, objeto) => {
  const documentRef = doc(collection(db, ref), id);
  return setDoc(documentRef, objeto);
};
export const getDataChanged_collection = ( ref, callBack) => onSnapshot(collection(db,ref),callBack) //cambio en toda la colección
export const deleteData = (id, ref) => deleteDoc(doc(db,ref,id))
export const getData = (id, ref) => getDoc(doc(db,ref,id))
export const updateData = (id, ref,objeto) => updateDoc(doc(db,ref,id),objeto)

export const deleteData2 = async (salaNombre, tipo, index) => {
  const salaRef = doc(db, 'SALAS2', salaNombre);
  
  try {
      const salaSnap = await getDoc(salaRef);
      
      if (salaSnap.exists()) {
          let dataKey;
          if (tipo === 'sensores') {
              dataKey = 'sensores';
          } else if (tipo === 'ejecutores') {
              dataKey = 'ejecutores';
          } else {
              console.error("Tipo de dato no válido");
              return;
          }
          
          const data = salaSnap.data()[dataKey];
          data.splice(index, 1); // Elimina el elemento en el índice dado

          await setDoc(salaRef, { [dataKey]: data }, { merge: true });

          console.log(`${tipo === 'sensores' ? 'Sensor' : 'Ejecutor'} eliminado correctamente`);
      } else {
          console.error("El documento de la sala no existe");
      }
  } catch (error) {
      console.error(`Error al eliminar el ${tipo === 'sensores' ? 'sensor' : 'ejecutor'}:`, error);
  }
};
