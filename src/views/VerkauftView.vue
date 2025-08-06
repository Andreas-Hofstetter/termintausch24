<!-- eslint-disable -->
<template>
    <div v-if="!this.loggedIn">
        <div>Nicht eingeloggt!</div>
        <div class="modeChosen filtern" @click="getVerkauft">Login</div>
    </div>
    <div v-if="this.loggedIn" class="angeboteContainer">
        <Contract v-for="(a,key) in angebote" :key=key :a="a"/>
    </div>
</template>

<script>
/* eslint-disable */
import "../assets/styles/main.css";
import {getVerkauft,login} from "../main.js";
import { getAuth } from "firebase/auth";
import Contract from "@/components/Contract.vue";
export default {
name: 'VerkauftView',
components:{
    Contract
},data(){
    return{
        angebote: [{"title":"test"}],
        loggedIn:false
    }
},methods:{
    async getVerkauft(){
        if(getAuth().currentUser==null){await login()}//Unclear: == statt === da user vielleicht undefined; Problem?
        const a=await getVerkauft() //update for newly added offer!
        console.log(a)
        if (a!=null){
        this.angebote=a;
        this.loggedIn=true
        console.log(this.angebote)
        }else{alert("keine Angebote gefunden!")}
    }
},beforeMount(){
    this.getVerkauft()
}
}
</script>