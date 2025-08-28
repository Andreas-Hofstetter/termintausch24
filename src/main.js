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
import { getFirestore,arrayUnion,onSnapshot, arrayRemove,doc,getDoc, addDoc,setDoc, collection, getDocs, FieldPath, query, where, GeoPoint, orderBy,updateDoc, deleteDoc  } from 'firebase/firestore'///lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db= getFirestore(app)
const storage= getStorage()
const storageRef=ref(storage)
const analytics = getAnalytics(app);

export function getUserId(){
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  return userId;
}
export async function login(){
  const auth = getAuth(); 
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
    }).catch((err)=>{alert("Login fehlgeschlagen!");console.log(err)})
  }
}
//TODO: allgemeines Problem: angebote nicht aktuell=>gleichzeitige Order möglich!
export async function writeAngebot(angebot,status){
  try {
    angebot.status=status
    const docRef = await addDoc(collection(db, "angebote"), angebot);
    console.log("Document written with ID: ", docRef.id);
    return docRef
  } catch (e) {
    console.error("Error adding document: ", e);
  }
} 
export async function getData(maxPrice,minPrice,region,category,date1,time1,date2,time2) {
  //gets angebote on home page
  maxPrice= parseFloat(maxPrice)
  minPrice= parseFloat(minPrice)
  const angeboteCol=collection(db, "angebote");
  let angeboteQ=null;
  let constraints = [
    where("price", "<=", parseFloat(maxPrice)),
    where("price", ">=", parseFloat(minPrice)),
    where("status","==","angeboten"),
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
  let angeboteDaten=[]
  angeboteSnapshot.forEach((doc)=>{
    const dataWithId=doc.data()
    dataWithId.id=doc.id
        angeboteDaten.push(dataWithId)
    })
  return angeboteDaten;
}
export function subscribeToWarenkorb(userId,callback){ //Echtzeit-Updates des Warenkorbs (Geschrieben von claude)

  if (!userId) {
    callback([]); // Leeres Array wenn kein User
    return () => {}; // Dummy unsubscribe
  }
    const q = query(
    collection(db, "angebote"),
    where("status", "==", "verkauft"),
    where("besitzer", "==", userId)
  );

  // onSnapshot gibt automatisch eine unsubscribe-Funktion zurück
  const unsubscribe = onSnapshot(q, 
    (querySnapshot) => {
      const angebote = [];
      querySnapshot.forEach((doc) => {
        const dataWithId = doc.data();
        dataWithId.id = doc.id;
        angebote.push(dataWithId);
      });
      
      console.log("Warenkorb aktualisiert:", angebote.length, "Artikel");
      callback(angebote); // Vue Component wird automatisch updated
    },
    (error) => {
      console.error("Warenkorb subscription error:", error);
      callback([]); // Bei Fehler leeres Array
    }
  );
  return unsubscribe; 
}
export async function getVerkauft1(){
  const userId= getUserId()
  if(userId!=null){
    const angeboteArr=[]
    try{
      const q = query(
      collection(db, "angebote"),
      where("creator", "==", userId)
    );
    const querySnapshot = await getDocs(q);
      querySnapshot.forEach((a)=>{
        const dataWithId=a.data()
        dataWithId.id=a.id
        angeboteArr.push(dataWithId)
      })
      return angeboteArr
    }catch(e){console.log(e)}
  }else{
    return null
  }
}
export async function getVerkauft2(){
  const userId= getUserId()
  if(userId!=null){
    const angeboteArr=[]
    try{
      const q = query(
      collection(db, "angebote"),
      where("oldBesitzer", "array-contains",userId))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((a)=>{
        const dataWithId=a.data()
        dataWithId.id=a.id
        angeboteArr.push(dataWithId)
      })
      return angeboteArr
    }catch(e){console.log(e)}
  }else{
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
  const userId = getUserId()
  if (!userId) {
    alert("Bitte loggen Sie sich zuerst ein!");
    return;
  }
  const aDoc=doc(db,"angebote",angebotId)
  try{
    await changeAngebotStatus(angebotId,"verkauft")
    await updateDoc(aDoc,{
      besitzer: userId
    }); 
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

// async function addGekaufte(angebot,id,uid){
//   const gkRef=collection(db,"verkauft",uid,"gekaufteAngebote")
//   const aDoc =doc(gkRef,id)
//   const docSnap = await setDoc(aDoc,angebot);//TODO: überschreiben verhindern!
//   console.log(docSnap)
//   return docSnap
// }
async function changeAngebotStatus(aId,newStatus) {
  const aRef= doc(db,"angebote",aId)
  try{
    await updateDoc(aRef,{"status":newStatus})
  }catch(e){console.log(e)}
}

export async function updateAngebot(aId,angebot){
  const aRef= doc(db,"angebote",aId)
  try{
    await updateDoc(aRef,angebot)
  }catch(e){console.log(e)}
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
// export async function updateAllStatus() {
//   const aRef = collection(db, "angebote");
//   const snapshot = await getDocs(aRef);
//   snapshot.forEach(async (doc)=>{
//     console.log(doc.id)
//     await changeAngebotStatus(doc.id,"angeboten")
//   })
// }
export async function deleteAngebot(aId){
  const aRef = doc(db,"angebote",aId)
  try{
    await deleteDoc(aRef)
  }catch(e){console.log(e)}
}

createApp(App).use(router).mount('#app')
