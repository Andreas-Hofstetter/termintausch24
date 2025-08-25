<template>
<!-- eslint-disable -->
  <!-- <img id="compName" :src="this.logo"/> -->
    <div class="cnt">
    <div class="modeSwitch" role="tablist" aria-label="Suche oder Biete">
      <button role="tab" @click="toggleSuche(true)" :class="{modeChosen: suche}">Suche</button>
      <button role="tab" @click="toggleSuche(false)" :class="{modeChosen: !suche}">Biete</button>
    </div>
    <!-- <div class="search-bar">
      <input type="text" placeholder="Search..." class="search-input">
      <img class="search-button" :src="magGlas" />
    </div> -->
  </div>
  <BieteView v-if="!suche"/>
  <SucheView v-if="suche"/>
</template>

<script>
/* eslint-disable */
import BieteView from './BieteView.vue'
import SucheView from './SucheView.vue'
import magGlas from '../assets/magGlas.png';
import ttlogo from "../assets/TT24Logo.png"
import Contract from '@/components/Contract.vue';
import "../assets/styles/main.css"

export default {
  name: 'HomeView',
  components: {
    Contract,
    BieteView,
    SucheView
  },
  data() {
    return {
      suche: true, // initialize mode to "suche"
      logo: ttlogo
    }
  },
  computed: {
    magGlas() {
      return magGlas; // define magGlas as a computed property
    }
  },
  methods:{
    toggleSuche(mode){
      this.suche=mode
    }
  }
}
</script>