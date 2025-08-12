<template>
    <div class="anbieter" v-if="anbieter!=null">
      <h2>{{ this.anbieter.name }}</h2>
      <div>Id: {{ this.anbieterId }}</div>
      <div>Hauptsitz: {{ this.anbieter.hauptsitz }}</div>
      <div>Email: {{ this.anbieter.email }}</div>
      <div>Telefonnummer: {{ this.anbieter.telefon }}</div>
      <br>
      <input v-model="this.comment" placeholder="Hier Kommentieren"><span class="btn" @click="this.commentAnbieter()">Senden</span>
      <div class="commentContainer">
        <Comment v-for="(c,ckey) in this.anbieter.comments" :key="ckey" :comment="c"/>
      </div>
    </div>
  </template>
<script>
/* eslint-disable */
  import {commentAnbieter, getAnbieter,login} from '@/main';
  import {getAuth} from "firebase/auth";
  import CommentTemplate from '@/components/Comment.vue';
  import router from '@/router';
import Comment from '@/components/Comment.vue';
  export default {
    name: 'AnbieterView',
    components:{Comment},
    props: {
      a:Object
    },
    data(){
      return{
        anbieter:null,
        comment:null,
        anbieterId: "hoppla! Hier ist etwas schiefgelaufen",
        anbieterName:"Testanbieter"
      }
    },
    methods: {
      async showAnbieter(){
        //getAnbieter()
      },fetchData(){ //??????
        console.log("fetchData")
        this.anbieterId=this.$route.params.anbieterId
      },async commentAnbieter(){
        await commentAnbieter(this.anbieterId,this.comment)
        this.comment=""
      }
    }, watch:{
        "$route": "fetchData" //??? also why watch ?
    },
    async beforeRouteEnter(to,from,next){
      const anbieter=await getAnbieter(to.params.anbieterId)
      next(vm=>{vm.anbieterId= to.params.anbieterId,vm.anbieter=anbieter})
    }
  }
</script>