// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFUXQYRfYVDBXTmqc-3uGLhu5zIOk30IQ",
  authDomain: "schedule-adjuster-dev.firebaseapp.com",
  projectId: "schedule-adjuster-dev",
  storageBucket: "schedule-adjuster-dev.appspot.com",
  messagingSenderId: "466832050730",
  appId: "1:466832050730:web:96656af623997fcd4b1153",
  measurementId: "G-NG1YY70GRM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const fireAnalytics = getAnalytics(app);

export const fireAuth = getAuth(app);
