<template>
<!-- eslint-disable -->
    <i-card v-if="showDetails" :title="a.title" :text="a.more" @close="showDetails=false">
      <template #actions>
        <button class="btn-details" @click="showDetails=false">Schließen</button>
      </template>
    </i-card>
    <div  class="contract" :class="{verkauft: a.status === 'verkauft'}">
      <!-- <img class="cardPic" :src="imageUrl" alt="img" /> -->
      <div class="contractTitle">{{ this.a.title }}</div>
      <div :class="['category-pill', catKey]" title="Kategorie">
        <component :is="catIcon" class="icon" v-if="catIcon" />
        <span class="category-text">{{ a.category }}</span>
      </div>
  <p v-if="a.test" class="beispielangebot">Beispielangebot</p>
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
      <div>
  <button class="btn-details" @click="showDetails = true">Details</button>
        <button v-if="this.inView===0" class="btn-details btn-kaufen" @click="saveOrLog()">Kaufen</button>
        <button v-if="this.inView===1" class="btn-details" @click="resell()">Weiterverkaufen</button>
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
import ICard from './iCard.vue'
import { Calendar, Euro, Repeat, ArrowRight, Info, Hammer, Key as LucideKey, Ticket, Utensils, Tag } from 'lucide-vue-next'
  export default {
    name: 'AngebotTemplate',
    components:{
      ICard,
      Calendar, Hammer, LucideKey, Ticket, Utensils, Tag
    },
    props: {
      a:Object,
      inView:Number,
      uid:String
    },
    mounted(){

    },
    data(){
      return{
        showDetails:false,
        imageUrl:"https://cdn.pixabay.com/photo/2015/05/17/13/04/olives-770968_1280.jpg"
      }
    },
    computed: {
      catKey(){
        if(!this.a||!this.a.category) return 'sonstiges'
        const c=this.a.category.toString().toLowerCase()
        if(c.includes('handwerk')) return 'handwerk'
        if(c.includes('mieten')||c.includes('leihen')) return 'mieten'
        if(c.includes('event')) return 'events'
        if(c.includes('gastronomie')) return 'gastronomie'
        return 'sonstiges'
      },
      catIcon(){
        switch(this.catKey){
          case 'handwerk': return Hammer
          case 'mieten': return LucideKey
          case 'events': return Ticket
          case 'gastronomie': return Utensils
          default: return Tag
        }
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