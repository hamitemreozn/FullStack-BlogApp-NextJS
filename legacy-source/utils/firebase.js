// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE,
    authDomain: 'blog-20ee6.firebaseapp.com',
    projectId: 'blog-20ee6',
    storageBucket: 'blog-20ee6.appspot.com',
    messagingSenderId: '760538748925',
    appId: '1:760538748925:web:5e40c1f1668cb626caab94',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
