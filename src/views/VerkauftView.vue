<!-- eslint-disable -->
<template>
    <div v-if="!this.loggedIn">
        <div>Nicht eingeloggt!</div>
        <div class="modeChosen filtern" @click="getVerkauft">Login</div>
    </div>
    <div v-if="this.loggedIn&&this.createdAngebote.length===0&&this.resoldAngebote===0">Bisher nichts.</div>
    <h3>Erstellte Angebote (mit aktuellen Preisen):</h3>
    <div v-if="createdAngebote.length===0">Keine Angebote erstellt</div>
    <div v-if="this.loggedIn" class="angeboteContainer">
        <Contract v-for="(a,key) in createdAngebote" :key=key :a="a" >
            <div v-if="a.status==='verkauft'" class="verkTxt">Verkauft</div>
        </Contract>
    </div>
    <h3>Wieder angebotene Termine:</h3>
    <div v-if="resoldAngebote.length===0">Keine Angebote weiterverkauft</div>
    <div v-if="this.loggedIn" class="angeboteContainer">
        <Contract v-for="(a,key) in resoldAngebote" :key=key :a="a">
            <div v-if="a.status==='verkauft'" class="verkTxt">Verkauft</div>
        </Contract>
    </div>
</template>

<script>
/* eslint-disable */
//TODO: Anzeigen, ob verkauft! resell-problem
import "../assets/styles/main.css";
import {getVerkauft1,getVerkauft2,login} from "../main.js";
import { getAuth } from "firebase/auth";
import Contract from "@/components/Contract.vue";
export default {
name: 'VerkauftView',//eigentlich: AngebotenView
components:{
    Contract
},data(){
    return{
        createdAngebote: [],
        resoldAngebote:[],
        loggedIn:false
    }
},methods:{
    async getVerkauft(){
        if(getAuth().currentUser==null){await login()}//Unclear: == statt === da user vielleicht undefined; Problem?
        this.loggedIn=true
        const a=await getVerkauft1() //update for newly added offer!
        this.createdAngebote=a;
        const b=await getVerkauft2()
        this.resoldAngebote=b;
    }
},beforeMount(){
    this.getVerkauft()
}
}
</script>