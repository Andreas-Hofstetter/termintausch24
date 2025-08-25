<template>
<!-- eslint-disable -->
<p class="msg" v-if="user!=null">Hallo, {{ user.displayName }}!</p>
<div style="text-decoration: underline;cursor: pointer;" @click="profilErgänzen()">Profil ergänzen</div>
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
    <form><div style="display: inline-block;">Terminname: </div><input v-model="title" style="display: inline-block;"></form>
    <br/><form><div style="display: inline-block;">Start: </div><input v-model="startDate" type="date"  style="display: inline-block;"><input  type="time" v-model="startTime" style="display: inline-block;"></form>
    <br/><form><div style="display: inline-block;">Dauer (in Stunden): </div><input v-model="dauer" type="number" style="display: inline-block;"></form>
    <br/><form><div style="display: inline-block;">Region (des Termins): 
    </div><select v-model="selectedRegion" style="display: inline-block;">
        <option v-for="region in this.regions" :key="region" :value="region">
          {{ region }}
        </option>
    </select></form>
    <br/><form><div style="display: inline-block;">Region (des Termins): 
    </div><select v-model="selectedCategory" style="display: inline-block;">
        <option v-for="category in this.categories" :key="category" :value="category">
          {{ category }}
        </option>
    </select></form>
    <br/><form><div style="display: inline-block;">Preis: </div><input v-model="price" type="number" style="display: inline-block;"></form>
    <br/><form><div style="display: inline-block;">Details: </div><input v-model="more" style="display: inline-block;"></form>
    <!-- <br/><form><div style="display: inline-block;">Optionen: </div><input v-model="opt" style="display: inline-block;"></form> -->
    <br/><form><div style="display: inline-block;">Privat (Wenn geschäftlich, Haken entfernen): </div><input type="checkbox" v-model="privat" style="display: inline-block;"></form>
    <br/><div @click="createAngebot" class="btn">Angebot abgeben</div>
</div>
</template>
<script>
/* eslint-disable */
import iCard from '@/components/iCard.vue';
import {writeAngebot,login,getProfil,writeProfil} from '@/main';
import {getAuth} from "firebase/auth"
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
    selectedRegion: "Sonstige",
    selectedCategory: "Sonstiges",
    regions:["Sonstige","Bayreuth","Bayreuth Umland"],
    categories:["Handwerk","Mieten und Leihen","Events","Gastronomie","Sonstiges"],
    email:  "test",
    title: "test",
    more:"Text",
    opt:"keine",
    privat:true,
    user:null
    }
},
methods:{
    async createAngebot(){
        console.log("creatingAngebot...")
        const angebot=
        {"region":this.selectedRegion,
        "startTimestamp": new Date(`${this.startDate}T${this.startTime}`),
        "dauer":this.dauer,
        "title":this.title,
        "creator":this.user.uid,
        "category":this.selectedCategory,
        "price":parseFloat(this.price),
        "more":this.more,"privat":this.privat,"anbieter":{"name":this.profilN,"id":this.user.uid}}
        const profil={"email":this.profilE,"name":this.profilN,"telefon":this.profilT,"hauptsitz":this.profilH}
        if(Object.values(profil).some((value) => value === null|| value === undefined || value === '')){alert("Profil unvollständig!"); return}
        const hasNullEntries = Object.values(angebot).some((value) => value === null|| value === undefined || value === '');
            if(hasNullEntries){//TO DO: Länge Beschränken!!!
            alert("Füllen Sie alle Felder aus und überprüfen Sie ihren Login-Status!")
            }else if (this.title.length>27) {alert("Titel zu lange!")} else{
                if(confirm("Angebot verbindlich abgeben?")===false){return}
                console.log(angebot)
                try{await writeProfil(this.user.uid,profil)//TODO: nur write, falls Änderung
                    const ref=await writeAngebot(angebot,"angeboten")
                    alert("\nAngebot abgegeben! Überprüfen Sie regelmäßig den Reiter 'Verkauft' (Navigationsleiste)");
                    console.log(ref)
                    console.log("ref",ref.id)
                
            }catch(e){alert(e)}
            }
    },profilErgänzen(){
        this.peClicked=true
    }
},async beforeMount(){
    // onMount falsch! wie kann man funktion vor render aufrufen?
    const auth = getAuth();
    console.log(auth.currentUser)
    if (!auth.currentUser) {
        try{await login(); this.user=auth.currentUser}
        catch(e){alert("error: ",e)};
    }else{
        this.user=auth.currentUser
    }
    console.log(this.user.uid)
    const savedProfile=await getProfil(this.user.uid)
    if(savedProfile){this.profilE=savedProfile.email,this.profilN=savedProfile.name,
        this.profilH=savedProfile.hauptsitz,this.profilT=savedProfile.telefon}
}}
</script>