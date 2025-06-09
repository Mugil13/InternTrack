// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDL4PyOQSb6PAGC8cJopghTn2F_Kd-u-C0",
  authDomain: "ip-assignment-2be8a.firebaseapp.com",
  projectId: "ip-assignment-2be8a",
  storageBucket: "ip-assignment-2be8a.appspot.com",
  messagingSenderId: "268214222899",
  appId: "1:268214222899:web:b329012a252634db4f6346"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
