<template>
<!-- eslint-disable -->
    
    <div v-if="showModal" class="modal-overlay">
        <i-card :title="modalData.title" :text="modalData.text" @close="closeModal">
          <template #inputs>
            <div v-if="modalData.showInput" style="width: 100%; margin-bottom: 8px;">
              <input v-model="inputValue" :type="modalData.inputType"
                     :placeholder="modalData.inputPlaceholder" />
            </div>
          </template>
          <template #actions>
            <div>
              <button class="btn-details" @click="closeModal">{{ modalData.cancelText || 'Abbrechen' }}</button>
              <button v-if="modalData.confirmAction" class="btn" @click="modalData.confirmAction" 
                      :disabled="modalData.showInput && (!inputValue || inputValue <= 0)">
                {{ modalData.confirmText }}
              </button>
            </div>     
          </template>
        </i-card>
    </div>
    <div  class="contract" :class="{verkauft: a.status === 'verkauft' && (inView === 2)}">
      <span title="Verifiziertes Angebot" v-if="a.verified" >
        <CheckCircle  
        class="verified-icon" 
        style="position: absolute; top: 8px; right: 8px" 
      />
      </span>
      <br/>
      <!-- <img class="cardPic" :src="imageUrl" alt="img" /> -->
      <div class="contractTitle">{{ this.a.title }}</div>
      <div :class="['category-pill', catKey]" title="Kategorie">
        <component :is="catIcon" class="icon" v-if="catIcon" />
        <span class="category-text">{{ a.category }}</span>
      </div>
    <p v-if="a.test" class="beispielangebot">Beispielangebot</p>
    <p v-else class="beispielangebot">kein Beispielangebot</p>
      <!-- <div style="display: flex; justify-content: space-between; width: 100%;"> -->
        <div>Basispreis Leistung (€): <span style="color: blue;font-weight: bold;">{{ this.a.basePrice}}</span></div>
        <div>Preis Termin (€): <span style="color: blue;font-weight: bold;">{{ this.a.price }}</span></div>
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
  <button class="btn-details" @click="showDetailsModal">Details</button>
        <button v-if="this.inView===0" class="btn" @click="handleBuy">Kaufen</button>
        <button v-if="this.inView===1" class="btn" @click="handleResell">Weiterverkaufen</button>
        <slot></slot>
      </div>
    </div>
  </template>
<script>
/* eslint-disable */
  import {saveOrder,login, writeAngebot, deleteAngebot, updateAngebot, saveOrderSafe} from '@/main';
  import {getAuth} from "firebase/auth";
  import "../assets/carticon.png"
  import router from '@/router';
import { RouterLink } from 'vue-router';
import ICard from './iCard.vue'
import { Calendar,CheckCircle, Euro, Repeat, ArrowRight, Info, Hammer, Key as LucideKey, Ticket, Utensils, Tag } from 'lucide-vue-next'
  export default {
    name: 'AngebotTemplate',
    components:{
      ICard,
      Calendar, Hammer, LucideKey, Ticket, Utensils, Tag, CheckCircle
    },
    props: {
      a:Object,
      inView:Number,
      uid:String
    },
    data(){
      return{
        showDetails:false,
        imageUrl:"https://cdn.pixabay.com/photo/2015/05/17/13/04/olives-770968_1280.jpg",//unnecesssary now
        inputValue: null,//for resell price
        showModal: false,
        modalData: {}
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
      closeModal(){
        this.showModal = false
        this.inputValue = null
      },

      showDetailsModal(){
        console.log("Details anzeigen")
        this.modalData = {
          title: this.a.title,
          text: this.a.more,
          confirmText: 'Schließen',
        }
        this.showModal = true
      },
      async handleBuy(){ 
        if(getAuth().currentUser===null){ 
          if(confirm("Sie sind nicht eingeloggt! Jetzt einloggen?")){
            await login() 
          }
        } else {
          this.modalData = {
            title: 'Kauf bestätigen',
            text: `Möchten Sie den Termin '${this.a.title}' für ${this.a.fullPrice}€
            (${this.a.price}€ Terminpreis + ${this.a.basePrice}€ Basispreis) 
            kaufen?`,
            confirmText: 'Kaufen',
            confirmAction: this.confirmBuy
          }
          this.showModal = true
        }
      },
      
      async confirmBuy(){
        this.closeModal()
        try{
          const result = await saveOrderSafe(this.a.id)
          if(result.success){
            console.log("Kauf erfolgreich!")
            router.push("/meins")
          } else {
            alert(result.error)
          }
        } catch(e) {
          alert("Fehler beim Kauf: "+e)
        }
      },

      handleResell(){
        this.modalData = {
          title: 'Termin weiterverkaufen',
          text: 'Geben Sie Ihren gewünschten Verkaufspreis ein und bestätigen Sie, um den Termin verbindlich zum Verkauf anzubieten.',
          showInput: true,
          inputType: 'number',
          inputPlaceholder: 'Verkaufspreis in €',
          confirmText: 'Verbindlich verkaufen',
          confirmAction: this.confirmResell
        }
        this.inputValue = null
        this.showModal = true
      },

      async confirmResell(){
        const user = getAuth().currentUser
        const normalizedPrice = parseFloat(this.inputValue)
        
        if (isNaN(normalizedPrice) || normalizedPrice <= 0) {
          alert("Bitte geben Sie einen gültigen Preis ein.");
          return;
        }

        this.closeModal()
        
        if(user){
          const angebot = { ...this.a, price: normalizedPrice};
          if(!angebot.oldBesitzer){angebot.oldBesitzer=[]}
          angebot.oldBesitzer.push(angebot.besitzer)
          if(!angebot.oldPrices){angebot.oldPrices=[]}
          angebot.oldPrices.push(normalizedPrice)
          angebot.status="angeboten"
          await updateAngebot(this.a.id, angebot)
        }
      },
      async saveOrLog(){ 
        if(getAuth().currentUser===null){ 
          if(confirm("Sie sind nicht eingeloggt! Jetzt einloggen?")){
          await login() 
          return}
        } else{
          if(confirm("Termin zu angegebenem Preis und Bedingungen (Unter \"Details\" nachzulesen) kaufen?")===true){
            try{
            const result=await saveOrderSafe(this.a.id)
            if(result.success){
              console.log("Kauf erfolgreich!")
              router.push("/meins")
            }else{alert(result.error)}}catch(e){
              alert("Fehler beim Kauf: "+e)
            }
          }
        }
      },async resell(){
        const user=getAuth().currentUser
        const newPrice=prompt("verlangten Preis angeben")
        const normalizedPrice = parseFloat(newPrice.replace(',', '.'));
        console.log("Neuer Preis: ", normalizedPrice);
        if(normalizedPrice){
          if (isNaN(normalizedPrice) || normalizedPrice <= 0) {
          alert("Bitte geben Sie einen gültigen Preis ein.");
          return;
          }
        }else{return}
        if(user&&confirm(`Termin zu angegebenem Preis (${newPrice}€) verkaufen?"`)===true){
          const angebot = { ...this.a, price: Number(normalizedPrice)};
          if(!angebot.oldBesitzer){angebot.oldBesitzer=[]}
          angebot.oldBesitzer.push(angebot.besitzer)
          if(!angebot.oldPrices){angebot.oldPrices=[]}
          angebot.oldPrices.push(normalizedPrice)
          angebot.status="angeboten"
          await updateAngebot(this.a.id,angebot)
        }
      }
    }
  }
</script>