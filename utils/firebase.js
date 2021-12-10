// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA0g4NR6Oby_s5iPwSGufBg-_Ma8zk8GgU",
  authDomain: "rsa-app-6f68b.firebaseapp.com",
  projectId: "rsa-app-6f68b",
  storageBucket: "rsa-app-6f68b.appspot.com",
  messagingSenderId: "792404680499",
  appId: "1:792404680499:web:364dcf14a6b2dfc50e2846"
};

const app = getApps().length
	? getApp()
	: initializeApp(firebaseConfig)

export { app }