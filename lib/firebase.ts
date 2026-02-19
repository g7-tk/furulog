import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCmXSdK8fvzSbaZMcPTLvPEjDYEpES6RxQ",
  authDomain: "furulog-248ed.firebaseapp.com",
  projectId: "furulog-248ed",
  storageBucket: "furulog-248ed.firebasestorage.app",
  messagingSenderId: "604261645241",
  appId: "1:604261645241:web:e9355fc42d2b363a739468",
  measurementId: "G-DBZW33G3J7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);