/* eslint-disable */
import { createApp } from 'vue'
import './assets/styles/main.css'
import App from './App.vue'
import router from './router'
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from 'firebase/app'
import {getDownloadURL, getStorage, listAll, ref,uploadBytes} from "firebase/storage"
//import 'firebase/firestore'
import { GoogleAuthProvider,getAuth, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence} from "firebase/auth";
import { getFirestore,arrayUnion,doc,getDoc, addDoc,setDoc, collection, getDocs, FieldPath, query, where, GeoPoint, orderBy,updateDoc  } from 'firebase/firestore'///lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9tlgSlmwIWN-l7MinoC7oT6Tn2bobJXU",
  authDomain: "termintausch24.firebaseapp.com",
  projectId: "termintausch24",
  storageBucket: "termintausch24.appspot.com",
  messagingSenderId: "773063924493",
  appId: "1:773063924493:web:a8bdb36c196c34e51f6e44",
  measurementId: "G-ZXQ7P9K7R7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db= getFirestore(app)
const storage= getStorage()
const storageRef=ref(storage)
const analytics = getAnalytics(app);

export async function login(){
  console.log("login")
  const auth = getAuth(); 
  console.log(auth.currentUser)
  const provider = new GoogleAuthProvider();
  //if(auth.currentUser===null){
    console.log("newLogin")
    await setPersistence(auth,browserSessionPersistence)
    await signInWithPopup(auth,provider)
    .then((re)=>{
        const credential = GoogleAuthProvider.credentialFromResult(re);
        console.log(credential)
        const token = credential.accessToken;
        console.log(token)
        // The signed-in user info.
        const user = re.user;
        usernameGlobal=user.displayName
        // this.$globals.username = user.displayName;
        console.log(user)
        alert("Willkommen, "+user.displayName)
        return auth.currentUser
        // IdP data available using getAdditionalUserInfo(result)
    }).catch((err)=>{console.log(err)})
  //}
}

createApp(App).use(router).mount('#app')
