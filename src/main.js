/* eslint-disable */
import { createApp } from 'vue'
import './assets/styles/main.css'
import App from './App.vue'
import router from './router'
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'firebase/app'
import {getDownloadURL, getStorage, listAll, ref,uploadBytes} from "firebase/storage"
import { GoogleAuthProvider,getAuth, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence} from "firebase/auth";
import { getFirestore,arrayUnion,arrayRemove,doc,getDoc, addDoc,setDoc, collection, getDocs, FieldPath, query, where, GeoPoint, orderBy,updateDoc, deleteDoc  } from 'firebase/firestore'///lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db= getFirestore(app)
const storage= getStorage()
const storageRef=ref(storage)
export let auth=null
const analytics = getAnalytics(app);

export async function login(){
  auth = getAuth(); 
  console.log(auth.currentUser)
  if(auth.currentUser===null){
    const provider = new GoogleAuthProvider();
    console.log(provider)
    await setPersistence(auth,browserSessionPersistence)
    await signInWithPopup(auth,provider)
    .then((re)=>{
        const credential = GoogleAuthProvider.credentialFromResult(re);
        console.log(credential)
        const token = credential.accessToken;
        console.log(token)
        // The signed-in user info.
        const user = re.user;
        console.log(user)
        alert("Willkommen, "+user.displayName)
        return auth.currentUser
        // IdP data available using getAdditionalUserInfo(result)
    }).catch((err)=>{console.log("Testosaurus"+err)})
  }
}
export async function writeAngebot(angebot){
  try {
    const uId= getAuth().currentUser.uid
    const docRef = await addDoc(collection(db, "angebote"), angebot);
    console.log("Document written with ID: ", docRef.id);
    const vkRef=doc(db,"verkauft",uId)
    const docSnap = await getDoc(vkRef);
    if (docSnap.exists()) {
      // Update mit arrayUnion = fügt nur hinzu, wenn nicht schon exakt identisch vorhanden
      await updateDoc(vkRef, {
        angebote: arrayUnion(angebot)
      })
    } else {
      // Falls das Dokument noch nicht existiert: neu anlegen
      await setDoc(vkRef, {
        angebote: [angebot]
      })
    }
    return docRef
  } catch (e) {
    console.error("Error adding document: ", e);
  }
} 

export async function getData(maxPrice,minPrice,region,category,date1,time1,date2,time2) {
  console.log("inputs",maxPrice,minPrice,region,category)
  maxPrice= parseFloat(maxPrice)
  minPrice= parseFloat(minPrice)
  const angeboteCol=collection(db, "angebote");
  let angeboteQ=null;
  let constraints = [
    where("price", "<=", parseFloat(maxPrice)),
    where("price", ">=", parseFloat(minPrice)),
    where("startTimestamp", ">=", new Date(`${date1}T${time1}`)),
    where("startTimestamp", "<=", new Date(`${date2}T${time2}`)),
    orderBy("price")
  ];
  if (region !== "Alle") {
    constraints.push(where("region", "==", region));
  }
  if (category !== "Alle") {
    constraints.push(where("category", "==", category));
  }
  angeboteQ = query(angeboteCol,...constraints)
  const angeboteSnapshot = await getDocs(angeboteQ);
  console.log(angeboteSnapshot)
  let angeboteDaten=[]
  angeboteSnapshot.forEach((doc)=>{
    const dataWithId=doc.data()
    dataWithId.id=doc.id
        angeboteDaten.push(dataWithId)
    })
  console.log("angeboteDaten",angeboteDaten)
  return angeboteDaten;
}
export async function getWarenkorb(){
  const user = getAuth().currentUser
  if(user!=null){
    const userId= user.uid
    const wkRef = doc(db, "warenkorb", userId);
    console.log(wkRef)
    try{const angeboteSnapshot=await getDoc(wkRef)
      console.log(angeboteSnapshot.data()["angebote"])
      return angeboteSnapshot.data()["angebote"]
    }catch(e){console.log(e)}
  }else{
    console.log("user (sollte null sein)"+user)
    return null
  }
}
export async function deleteFromWarenkorb(userId,angebot){
  const wkRef = doc(db, "warenkorb", userId);
  try {
    await updateDoc(wkRef, {
      angebote: arrayRemove(angebot)
    });
    console.log("Angebot entfernt:", angebot);
  } catch (e) {
    console.error("Fehler beim Entfernen:", e);
  }
}
export async function getVerkauft(){
  const user = getAuth().currentUser
  if(user!=null){
    const userId= user.uid
    const vkRef = doc(db, "verkauft", userId);
    console.log(vkRef)
    try{const angeboteSnapshot=await getDoc(vkRef)
      console.log(angeboteSnapshot.data()["angebote"])
      return angeboteSnapshot.data()["angebote"]
    }catch(e){alert(e)}
  }else{
    console.log("user (sollte null sein)"+user)
    return null
  }
}
export async function getAnbieter(anbId){
  const anbRef=doc(db, "anbieter", anbId);
  try{const anbSnapshot=await getDoc(anbRef);console.log(anbSnapshot.data());
    return anbSnapshot.data()
  }catch(e){alert(e)}
}
export async function saveOrder(angebot,anbieterId, angebotId){ //TODO rewrite
  //speichert ein bestelltes Angebot; Ablauf: speichert in warenkorb, dann angebot -1
  const userId = getAuth().currentUser.uid
  console.log("order: "+JSON.stringify(angebot))
  const wkRef=doc(db,"warenkorb",userId)
  try{
  const docSnap = await getDoc(wkRef);
    if (docSnap.exists()) {
      // Update mit arrayUnion = fügt nur hinzu, wenn nicht schon exakt identisch vorhanden
      await updateDoc(wkRef, {
        angebote: arrayUnion(angebot)
      })
    } else {
      // Falls das Dokument noch nicht existiert: neu anlegen
      await setDoc(wkRef, {
        angebote: [angebot]
      })
    }
  if(!angebot.test){console.log(angebot.id);await deleteDoc(doc(db,"angebote",angebot.id))}
  }catch(e){
    alert("Fehler beim Speichern")
    console.log(e)
  }
  
}
export async function commentAnbieter(anbieterId,comment){
  const aRef= doc(db,"anbieter",anbieterId)
  let user= getAuth().currentUser
  if(!user){
    console.log("no user")
    try{ await login()}catch(e){alert("login fehlgeschlagen!");console.log(e)}
    user= getAuth().currentUser
  }
  try{ 
      await updateDoc(aRef,{
        comments: arrayUnion({"text":comment,"uid":user.uid,"uname":user.displayName})
      })}catch(e){alert(e)}
  
}

//Hilfsfunktionen 
export async function updateAllParams(newParam,newParamWert,collectionName,dId){
  const colRef=collection(db,collectionName)
  const snapshot = await getDocs(colRef);

  const updates = [];

  snapshot.forEach((docSnap) => {
    const docRef = doc(db, collectionName, docSnap.id);
    const updatePromise = updateDoc(docRef, {
      [newParam]: newParamWert
    });
    updates.push(updatePromise);
  });

  try {
    await Promise.all(updates);
    console.log(`Alle Dokumente in '${collectionName}' wurden mit ${newParam} = ${newParamWert} aktualisiert.`);
  } catch (e) {
    console.error("Fehler beim Aktualisieren:", e);
  }
}
export async function getProfil(aId){
  const aRef= doc(db,"anbieter",aId)
  const snapshot = await getDoc(aRef);
  console.log(aId,snapshot)
  return snapshot.data()
}
export async function writeProfil(aid,profil){
  const aRef=doc(db,"anbieter",aid)
  try{await setDoc(aRef,profil)}catch(e){console.log(e)}
}


createApp(App).use(router).mount('#app')
