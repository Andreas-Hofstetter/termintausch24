<template>
<!-- eslint-disable -->
<p class="msg" v-if="user!=null">Hallo, {{ user.displayName }}!</p>
<div style=" cursor: pointer;" @click="peClicked = !peClicked">
  <span class="btn">{{ peClicked ? 'Dienstleisterprofil ausblenden ▲' : 'Dienstleisterprofil ergänzen ▼' }}</span>
</div>
<div class="Profil" v-if="peClicked">
    <br/>
    <div>Id: {{ this.user.uid }}</div>
    <div>Name: <input v-model="profilN"></div>
    <div>Email: <input v-model="profilE"></div>
    <div>Hauptsitz: <input v-model="profilH"></div>
    <div>Telefon: <input v-model="profilT"></div>
</div>
<div id="bieteWrapper" v-if="user!=null">
    <p>Ich biete..</p>
    <form><div>Terminname: </div><input v-model="title" style="display: inline-block;"></form>
    <br/><form><div>Start: </div><input v-model="startDate" type="date"  style="display: inline-block;"><input  type="time" v-model="startTime" style="display: inline-block;"></form>
    <br/><form><div>Dauer (in Stunden): </div><input v-model="dauer" type="number" style="display: inline-block;"></form>
    <br/><form><div>Region: 
    </div><select v-model="selectedRegion">
        <option v-for="region in this.regions" :key="region" :value="region">
          {{ region }}
        </option>
    </select></form>
    <br/><form><div>Kategorie: </div><select v-model="selectedCategory">
        <option v-for="category in this.categories" :key="category" :value="category">
          {{ category }}
        </option>
    </select></form>
    <br/><form><div>Basispreis der Dienstleistung (€): </div><input v-model="basePrice" type="number" style="display: inline-block;"></form>
    <br/><form><div>Preis des Termins (€): </div><input v-model="price" type="number" style="display: inline-block;"></form>
    <br/><form><div>Details: </div><textarea v-model="more" style="display: inline-block;" placeholder="Beschreibe dein Angebot..."></textarea></form>
    <!-- <br/><form><div style="display: inline-block;">Optionen: </div><input v-model="opt" style="display: inline-block;"></form> -->
    <br/><form><div>Privat (Wenn geschäftlich, Haken entfernen): </div><input type="checkbox" v-model="privat" style="display: inline-block;"></form>
    <br/><form><div>Ich bestätige, dass ich Veranstalter des Termins bin oder die ausdrückliche Erlaubnis des Veranstalters zur Weitergabe habe: </div><input type="checkbox" v-model="confirmTerms" style="display: inline-block;"></form>
    <br/><form><div>Ich bestätige, dass ich die <RouterLink to="/rechtliches">AGBs und Datenschutzhinweise</RouterLink> gelesen habe und akzeptiere: </div><input type="checkbox" v-model="confirmLegal" style="display: inline-block;"></form>
    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
    <div @click="createAngebot" class="btn">Angebot abgeben</div>
</div>
</template>
<script>
/* eslint-disable */
import iCard from '@/components/iCard.vue';
import {writeAngebot,login,getProfil,writeProfil} from '@/main';
import {getAuth} from "firebase/auth"
import { RouterLink } from 'vue-router';
import router from '@/router';
export default {
name: 'BieteView',
components:{iCard},
data(){
    const datum = new Date().toISOString().split('T')
    return{
    peClicked:false,
    profilN:null,
    profilE:null,
    profilH:null,
    profilT:null,
    imageUrl:"https://cdn.pixabay.com/photo/2023/06/21/15/07/butterfly-8079524_1280.jpg",
    startDate:  datum[0],
    dauer:  1,
    startTime:  datum[1].slice(0, 5),
    price: 0,
    basePrice:0,
    selectedRegion: "Sonstige",
    selectedCategory: "Sonstiges",
    regions:["Sonstige","Bayreuth","Bayreuth Umland"],
    categories:["Handwerk","Mieten und Leihen","Events","Gastronomie","Sonstiges"],
    email:  "test",
    title: "test",
    more:"Beschreiben Sie Ihr Angebot...",
    opt:"keine",
    privat:true,
    confirmTerms:false,
    confirmLegal:false,
    user:null,
    errorMsg:null
    }
},
methods:{
    async createAngebot(){
        if(!this.startDate || !this.startTime || !this.dauer || !this.title || !this.selectedRegion || !this.selectedCategory || this.price===null || this.price===undefined || !this.more){
            this.errorMsg="Bitte füllen Sie alle Felder aus!"
            return
        }
        if(!this.confirmTerms || !this.confirmLegal){
            this.errorMsg="Bitte bestätigen Sie alle Bedingungen!"
          return}
        if(!this.user){
            this.errorMsg="Fehler: Kein User gefunden! Bitte neu einloggen!"
            return
        }
        
        const profil={"email":this.profilE,"name":this.profilN,"telefon":this.profilT,"hauptsitz":this.profilH}
        if(Object.values(profil).some((value) => value === null|| value === undefined || value === '')){
          this.errorMsg="Profil unvollständig!"
          return
        }
        const angebot=
        {"region":this.selectedRegion,
        "startTimestamp": new Date(`${this.startDate}T${this.startTime}`),
        "dauer":this.dauer,
        "title":this.title,
        "creator":this.user.uid,
        "category":this.selectedCategory,
        "price":parseFloat(this.price),
        "basePrice":parseFloat(this.basePrice),
        "fullPrice":parseFloat(this.price)+parseFloat(this.basePrice),
        "more":this.more,"privat":this.privat,"anbieter":{"name":this.profilN,"id":this.user.uid}}
        
        const hasNullEntries = Object.values(angebot).some((value) => value === null|| value === undefined || value === '');
        if(hasNullEntries){//TO DO: Länge Beschränken!!!
          errorMsg="Bitte füllen Sie alle Felder aus!"
          return
        }
        if (this.title.length>35) {
          this.errorMsg="Titel zu lang! Maximal 35 Zeichen."
          return
        } 
        if (this.more.length>1000) {
          this.errorMsg="Beschreibung zu lang! Maximal 1000 Zeichen. Fügen Sie ggf. einen Link zu weiteren Informationen ein."
          return
        }
        if(confirm("Angebot verbindlich abgeben?")===false){return}
        console.log(angebot)
        try{await writeProfil(this.user.uid,profil)
            const ref=await writeAngebot(angebot,"angeboten")
            alert("\nAngebot abgegeben!")
            router.push("/meins")
                
            }catch(e){console.log(e)}
            
    },
},async beforeMount(){
    // onMount falsch! wie kann man funktion vor render aufrufen?
    const auth = getAuth();
    console.log(auth.currentUser)
    if (!auth.currentUser) {
        await login(); 
        this.user=auth.currentUser
    }else{
        this.user=auth.currentUser
    }
    console.log(this.user.uid)
    const savedProfile=await getProfil(this.user.uid)
    if(savedProfile){this.profilE=savedProfile.email,this.profilN=savedProfile.name,
        this.profilH=savedProfile.hauptsitz,this.profilT=savedProfile.telefon}
}}
</script>
<style scoped>
#bieteWrapper{
    border-radius: 10px;
    padding: 10px;
    background-color: var(--bg);
}
#bieteWrapper .btn {
  display: block;
  margin: 5px auto 5px auto;
}
#bieteWrapper >form> div{
  display: inline-block;
}
</style>