<template>
<!-- eslint-disable -->
  <div class="searchDiv">
    <form><div style="display: inline-block;">ab: </div><input v-model="date" type="date"  style="display: inline-block;"><input  type="time" v-model="time" style="display: inline-block;"></form>
    <form><div style="display: inline-block;">bis: </div><input v-model="date2" type="date"  style="display: inline-block;"><input  type="time" v-model="time2" style="display: inline-block;"></form>
    <form><div style="display: inline-block;">Niedrigster Preis: </div><input v-model="minPrice" style="display: inline-block;"></form>
    <form><div style="display: inline-block;">Höchster Preis: </div><input v-model="maxPrice" style="display: inline-block;"></form>
    <form><div style="display: inline-block;">Region: </div><select v-model="selectedRegion" style="display: inline-block;">
        <option v-for="region in this.regions" :key="region" :value="region">
          {{ region }}
        </option>
      </select></form>
    <form><div style="display: inline-block;">Kategorie: </div><select v-model="selectedCategory" style="display: inline-block;">
        <option v-for="category in this.categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select></form>
  </div>
  <div @click="filterAngebote" class="modeChosen filtern">Filtern</div>
  <div class="angeboteContainer">
    <Contract v-for="(a,key) in angebote" :key=key :a="a" :inView="0"/>
  </div>

</template>
<script>
/* eslint-disable */
import {} from '@/main';
import {readAngebote, getData} from "../main.js"
import Contract from '../components/Contract.vue';
export default {
name: 'BieteView',
components:{
    Contract
},
data(){
  const datum = new Date().toISOString().split('T')
  const datum2= new Date("2096-03-25").toISOString().split('T')
  console.log("test")
  console.log(datum2)
    return{
    
    maxPrice: 10000,
    minPrice:0,
    plz: null,
    date: datum[0],
    time: datum[1].slice(0, 5),
    date2: datum2[0],
    time2: datum2[1].slice(0, 5),
    regions: ["Alle","Bayreuth","Bayreuth Umland"],
    categories:["Alle","Handwerk","Mieten und Leihen","Events","Gastronomie","Sonstiges"],
    imageUrl:"https://cdn.pixabay.com/photo/2023/06/21/15/07/butterfly-8079524_1280.jpg",
    angebote:[{"title":"test"}],
    selectedRegion:"Alle",
    selectedCategory:"Alle",
    }
},
  async beforeMount(){
    this.filterAngebote()
  },
  methods: {
    async filterAngebote(){
      this.angebote=await getData(this.maxPrice,this.minPrice,this.selectedRegion,this.selectedCategory,this.date,this.time,this.date2,this.time2)
    }
  }
}
</script>