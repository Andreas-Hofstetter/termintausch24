<!-- eslint-disable -->
<template>
    <div v-if="!this.loggedIn">
        <div>Nicht eingeloggt!</div>
        <div class="modeChosen filtern" @click="getWk">Login</div>
    </div>
    <h3 v-if="this.loggedIn">Sie haben gekauft:</h3>
    <div v-if="this.loggedIn&&this.angebote.length===0">Bisher nichts.</div>
    <div v-if="this.loggedIn" class="angeboteContainer">
        <Contract v-for="(a,key) in angebote" :key=key :a="a" :inView="1" :uid="userId"/>
    </div>
</template>

<script>
/* eslint-disable */
import "../assets/styles/main.css";
import { getAuth } from "firebase/auth";
import {getWarenkorb,login} from "../main.js";
import Contract from "@/components/Contract.vue";
export default {
components:{
    Contract
},data(){
    return{
        angebote: [],
        loggedIn:false,
        userId:null
    }
},methods:{
    async getWk(){ 
        if(getAuth().currentUser==null){await login()}
            const a=await getWarenkorb()
            this.userId=getAuth().currentUser.uid
        if (a!=null){
            this.angebote=a;
            this.loggedIn=true
            console.log(this.angebote)
        }else{alert("keine Angebote gefunden!")}
    }
},created(){
    this.getWk()
}
}
</script>