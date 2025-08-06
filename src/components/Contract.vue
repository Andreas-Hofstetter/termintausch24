<template>
<!-- eslint-disable -->
    <div class="fullScreen" @click="fullScreen=null" v-if="fullScreen!=null">{{this.fullScreen}}</div>
    <div  class="contract">
      <!-- <img class="cardPic" :src="imageUrl" alt="img" /> -->
      <div class="contractTitle">{{ a.title }}</div>
      <p v-if="a.test" class="testangebot">Beispielangebot</p>
      <!-- <div style="display: flex; justify-content: space-between; width: 100%;"> -->
        <div>Preis(€): <span style="color: blue;font-weight: bold;">{{ a.price }}</span></div>
      <!-- </div> -->
      <div>Start: {{ this.a.startDate }} um {{ this.a.startTime }}</div>
      <div>Dauer: {{ this.a.dauer }} Stunden</div>
      <div v-if="this.a.anbieter!=null">Anbieter: 
        <RouterLink v-bind:to="{name:'view-Anbieter', params:{anbieterId:this.a.anbieter.id}}">{{ this.a.anbieter["name"] }}</RouterLink></div>
      <div v-if="this.a.anbieter==null">Anbieter nicht gefunden!</div>
      <div v-if="this.a.privat">Privates Angebot</div>
      <div v-if="!this.a.privat">Geschäftliches Angebot</div>
      <div>{{ "Region: "+a.region }}</div>
      <div>{{ "Kategorie: "+a.category }}</div>
      <div>
        <div class="mehr sideDiv" @click="this.fullScreen=this.a.more">Details</div>
        <!-- <div class="button40 sideDiv" @click="this.fullScreen=this.options">Optionen</div> -->
        <slot></slot>
      </div>
      
      
    </div>
  </template>
<script>
/* eslint-disable */
  import {saveOrder,login} from '@/main';
  import {getAuth} from "firebase/auth";
  import "../assets/carticon.png"
  import router from '@/router';
import { RouterLink } from 'vue-router';
  export default {
    name: 'AngebotTemplate',
    props: {
      a:Object
    },
    mounted(){
      console.log(this.a.anbieter)
    },
    data(){
      return{
        fullScreen:null,
        imageUrl:"https://cdn.pixabay.com/photo/2015/05/17/13/04/olives-770968_1280.jpg"
      }
    },
    methods: {
      async saveOrLog(a,b,c){ 
        console.log(a,b,c)
        if(getAuth().currentUser===null){ await login()}
        //  TODO:make angebote laden
        if(confirm("Termin zu angegebenem Preis kaufen?")===true){await saveOrder(a,b,c)
        router.push("/gekauft")}
      }, async showAnbieter(){
        //getAnbieter()
      }
    }
  }
</script>