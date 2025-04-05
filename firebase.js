// Import Firebase SDKs using CDN (no import statements)
// Include these scripts in your HTML file:
// <script src="https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"></script>
// <script src="https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js"></script>

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-HC-5-Z7N32SMTsUNISuSqA9tu4usFvU",
    authDomain: "nurturenest-b3ab7.firebaseapp.com",
    projectId: "nurturenest-b3ab7",
    storageBucket: "nurturenest-b3ab7.firebasestorage.app",
    messagingSenderId: "480414547609",
    appId: "1:480414547609:web:bca93b40591950e14bc208",
    measurementId: "G-920MTMSFFR"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();

// Initialize Firestore
const db = firebase.firestore();

// Initialize Firebase Storage
const storage = firebase.storage();

// Export db and storage for use in other files (optional)
window.db = db;
window.storage = storage;