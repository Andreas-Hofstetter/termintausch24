<!-- eslint-disable -->
<template>
    <div v-if="!this.loggedIn">
        <div>Nicht eingeloggt!</div>
        <div class="modeChosen filtern" @click="getWk">Login</div>
    </div>
    <div v-if="this.loggedIn" class="angeboteContainer">
        <Contract v-for="(a,key) in angebote" :key=key :a="a"/>
    </div>
</template>

<script>
/* eslint-disable */
import "../assets/styles/main.css";
import { getAuth } from "firebase/auth";
import {getWarenkorb,login} from "../main.js";
import Contract from "@/components/Contract.vue";
export default {
name: 'WarekorbView',
components:{
    Contract
},data(){
    return{
        angebote: [{"title":"test"}],
        loggedIn:false
    }
},methods:{
    async getWk(){ 
        if(getAuth().currentUser==null){await login()}//Unclear: siehe VerkauftView
            const a=await getWarenkorb() //update for newly added offer!
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