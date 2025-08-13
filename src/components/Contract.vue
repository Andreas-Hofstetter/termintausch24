<template>
<!-- eslint-disable -->
    <div class="fullScreen" @click="this.fullScreen=null" v-if="fullScreen!=null">{{this.fullScreen}}</div>
    <div  class="contract" :class="{verkauft: a.status === 'verkauft'}">
      <!-- <img class="cardPic" :src="imageUrl" alt="img" /> -->
      <div class="contractTitle">{{ this.a.title }}</div>
      <p v-if="a.test" class="testangebot">Beispielangebot</p>
      <!-- <div style="display: flex; justify-content: space-between; width: 100%;"> -->
        <div>Preis(€): <span style="color: blue;font-weight: bold;">{{ this.a.price }}</span></div>
      <!-- </div> -->
      <div v-if="this.a.startTimestamp">Start: {{ this.a.startTimestamp.toDate().toLocaleString()}} </div>
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
        <img v-if="this.inView===0" class="btn btn-2" id="wk" @click="saveOrLog()" :src="require('../assets/carticon.png')"/>
        <div v-if="this.inView===1" class="mehr" @click="resell()">Weiterverkaufen</div>
        <slot></slot>
      </div>
    </div>
  </template>
<script>
/* eslint-disable */
  import {saveOrder,login, writeAngebot, deleteAngebot} from '@/main';
  import {getAuth} from "firebase/auth";
  import "../assets/carticon.png"
  import router from '@/router';
import { RouterLink } from 'vue-router';
  export default {
    name: 'AngebotTemplate',
    props: {
      a:Object,
      inView:Number,
      uid:String
    },
    mounted(){

    },
    data(){
      return{
        fullScreen:null,
        imageUrl:"https://cdn.pixabay.com/photo/2015/05/17/13/04/olives-770968_1280.jpg"
      }
    },
    methods: {
      async saveOrLog(){ 
        console.log(this.a,this.a.creator,this.a.id)
        if(getAuth().currentUser===null){ await login()}
        //  TODO:make angebote laden
        if(confirm("Termin zu angegebenem Preis kaufen?")===true){await saveOrder(this.a,this.a.creator,this.a.id)
        router.push("/gekauft")}
      }, async showAnbieter(){
        //getAnbieter()
      },async resell(){
        const user=getAuth().currentUser
        const newPrice=prompt("verlangten Preis angeben")
        const normalizedPrice = parseFloat(newPrice.replace(',', '.'));
        if(normalizedPrice){
          if (isNaN(normalizedPrice) || normalizedPrice <= 0) {
          alert("Bitte geben Sie einen gültigen Preis ein.");
          return;
          }
        }else{return}
        if(user&&confirm(`Termin zu angegebenem Preis (${newPrice}€) verkaufen?"`)===true){
          const angebot = { ...this.a, price: Number(normalizedPrice),reseller:this.uid};
          if(!angebot.oldBesitzer){angebot.oldBesitzer=[]}
          angebot.oldBesitzer.push(angebot.besitzer)
          if(!angebot.oldPrices){angebot.oldPrices=[]}
          angebot.oldPrices.push(normalizedPrice)
          delete angebot.besitzer; 
          await writeAngebot(angebot,"angeboten")
          await deleteAngebot(angebot.id)
          router.push("/")
        }
      }
    }
  }
</script>