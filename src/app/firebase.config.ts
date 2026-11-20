import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyALNolkv_1pbnLkYGCfkpETOixtXTWvtiI",
  authDomain: "inventario-cristina.firebaseapp.com",
  projectId: "inventario-cristina",
  storageBucket: "inventario-cristina.firebasestorage.app",
  messagingSenderId: "800460305895",
  appId: "1:800460305895:web:7309e0b255cdb70d2cf942",
  measurementId: "G-NJ5EDV6VM7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);