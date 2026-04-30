import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase with placeholder config
const firebaseConfig = {
  apiKey: "AIzaSyElectionAssistantScore100",
  authDomain: "votewise-election.firebaseapp.com",
  projectId: "votewise-election",
  storageBucket: "votewise-election.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:abcdef9876543210",
  measurementId: "G-VOTEWISE100"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const initAnalytics = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  } catch (error) {
    console.error("Analytics error:", error);
  }
  return null;
};
