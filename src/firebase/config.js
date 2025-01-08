import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  // Copia aquí la configuración de tu proyecto de Firebase
  apiKey: " ",
  authDomain: "dam-ing.firebaseapp.com",
  projectId: "dam-ing   ",
  storageBucket: "dam-ing.appspot.com",
  messagingSenderId: "tu-messaging-id",
  appId: "dam-ing"
};

const app = initializeApp(firebaseConfig);
export default app;