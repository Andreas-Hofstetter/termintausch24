<template>
    <div className="card" class="contract">
          <img class="cardPic" :src="imageUrl" alt="img" />
          <div >{{ shortDesc }}</div>
          <div class="h">{{ conditions }}</div>
          <div class="h">{{ options }}</div>
          <div class="h">{{ price }}</div>
    </div>
  </template>
<script>
/* eslint-disable */
  import {} from '@/main';
  import router from '@/router';
  export default {
    name: 'AngebotTemplate',
    props: {
      price:Number,
      shortDesc:String,
      conditions:String,
      options:Array,
    },
    mounted(){
      
    },
    data(){
      return{
        imageUrl:"https://cdn.pixabay.com/photo/2023/06/21/15/07/butterfly-8079524_1280.jpg"
      }
    },
    methods: {
      saveOrLog(){
        //getAuth().currentUser.uid
        console.log("selectedCAt"+this.selectedCat)
        login().then(()=>{saveAngebot(this.category[0]+this.aId);
        //  TODO:make angebote laden
        router.push("/warenkorb")})
      },async download(file){
          console.log("test")
          const a=await downloadFile("images",file)
          console.log(a)
          this.imageUrl=a[0]
        }
    }
  }
</script>