<template>
  <!-- eslint-disable -->
  <div class="video-background">
    <div class="animated-background"></div>
  </div>

  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/anbieter">Anbieter</router-link>
    <div @click="loginUser">Login</div>
  </nav>
  <router-view/>
</template>
<script>/* eslint-disable */
import { login } from '@/main';
  export default{
  data(){
    return{
      modal:null
    }
  },
  methods:{
    showModalImpressum(){
      this.modal="imp"
      console.log(this.modal)
    },
    showModalDatenschutzerklaerung(){
      this.modal="dE"
    },
    loginUser(){
      login()
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  
  width: min(20%,200px);
  display: flex;
  justify-content: space-between;
  padding: 30px;
}

nav a {
  text-decoration: none;
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #210e2f
}
</style>