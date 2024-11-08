// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXpQSx6a-FoLHbxrzg1qg0aNaSKcWWeEA",
  authDomain: "bbanking-791ae.firebaseapp.com",
  projectId: "bbanking-791ae",
  storageBucket: "bbanking-791ae.appspot.com",
  messagingSenderId: "443847400074",
  appId: "1:443847400074:web:d5a027b0f0b954cfb16b73"
};
// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };