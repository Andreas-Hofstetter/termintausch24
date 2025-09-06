<template>
<!-- eslint-disable -->

<div v-if="user==null">
<br/>
  <div>Nicht eingeloggt!</div>
  <div class="filtern" @click="handleLogin" :disabled="loggingIn">
    {{ loggingIn ? 'Wird eingeloggt...' : 'Login' }}
  </div>
</div>
<p class="msg" v-if="user!=null">Hallo, {{ user.displayName }}!</p>

<!-- Profile Button -->
<div class="profile-section" v-if="user!=null">
  <button @click="showProfileModal = true" class="btn">Dienstleisterprofil bearbeiten</button>
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
    <button @click="createAngebot" class="btn">Angebot abgeben</button>
</div>

<!-- Profile Modal -->
<div v-if="showProfileModal" class="modal-overlay" @click="closeProfileModal">
  <iCard 
    title="Dienstleisterprofil bearbeiten" 
    text="" 
    @close="closeProfileModal"
    @click.stop
  >
    <template #inputs>
      <ProfileComponent 
        :show-cancel="false"
        @saved="handleProfileSaved"
      />
    </template>
  </iCard>
</div>
</template>

<script>
/* eslint-disable */
import iCard from '@/components/iCard.vue';
import ProfileComponent from '@/components/Profilform.vue';
import {writeAngebot,login,getProfil,writeProfil} from '@/main';
import {getAuth} from "firebase/auth"
import { RouterLink } from 'vue-router';
import router from '@/router';

export default {
name: 'BieteView',
components:{
    iCard,
    ProfileComponent
},
data(){
    const datum = new Date().toISOString().split('T')
    return{
    showProfileModal: false,
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
    closeProfileModal() {
        this.showProfileModal = false;
    },

    handleProfileSaved() {
        this.showProfileModal = false;
        // Profil wurde erfolgreich gespeichert
    },

    async createAngebot(){
      console.log("create Angebot")
      
      
      if(!this.user){
          this.errorMsg="Fehler: Kein User gefunden! Bitte neu einloggen!"
          return
      }
      
      // Check if profile exists and is complete
      const savedProfile = await getProfil(this.user.uid);
      const profHasNullEntries= Object.values(savedProfile || {}).some((value) => value === null|| value === undefined || value === '');
      if (profHasNullEntries || !savedProfile) {
          this.errorMsg = "Bitte vervollständigen Sie zuerst Ihr Dienstleisterprofil!";
          return;
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
      "more":this.more,"privat":this.privat,"anbieter":{"name":savedProfile.name,"id":this.user.uid}}
      
      const hasNullEntries = Object.values(angebot).some((value) => value === null|| value === undefined || value === '' || (typeof value === 'number' && isNaN(value)));
      if(hasNullEntries){//TO DO: Länge Beschränken!!!
        this.errorMsg="Bitte füllen Sie alle Felder aus!"
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
      if(!this.confirmTerms || !this.confirmLegal){
          this.errorMsg="Bitte bestätigen Sie alle Bedingungen!"
        return}
      if(confirm("Angebot verbindlich abgeben?")===false){return}
      console.log(angebot)
      try{
          await writeProfil(this.user.uid, profil)
          const ref=await writeAngebot(angebot,"angeboten")
          alert("\nAngebot abgegeben!")
          router.push("/meins")
              
      }catch(e){
          console.log(e)
          this.errorMsg = e
      }
            
    },
    async handleLogin(){
      const auth= getAuth()
      if(auth.currentUser){
        this.user=auth.currentUser
      }else{
        this.user=await login()
      }
    
  },
},


async beforeMount(){
    // Firebase Auth State prüfen
    
    
}}
</script>

<style scoped>
.profile-section {
    margin-bottom: 1rem;
    text-align: center;
}

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


/* Modal overlay styling (from main.css) */
.modal-overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}
</style>