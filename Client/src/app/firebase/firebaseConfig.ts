import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCHBwHrmKAau_ZHL5RdfqxJeeIXj2uCUk",
  authDomain: "app-financeiro-680b2.firebaseapp.com",
  projectId: "app-financeiro-680b2",
  storageBucket: "app-financeiro-680b2.firebasestorage.app",
  messagingSenderId: "721769504278",
  appId: "1:721769504278:web:2bb2721054188abc2c5f37",
  measurementId: "G-LG5EJPK07Y"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

