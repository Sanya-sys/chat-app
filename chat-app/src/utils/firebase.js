import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgCMwTqV3DXSeinGXdV9zABZlxL8t6geI",
  authDomain: "chat-app-fb470.firebaseapp.com",
  projectId: "chat-app-fb470",
  storageBucket: "chat-app-fb470.appspot.com",
  messagingSenderId: "201078288198",
  appId: "1:201078288198:web:4cc5e5b1736fd48b07ff47"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, onSnapshot };