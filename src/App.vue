<template>
  <!-- eslint-disable -->
  <nav class="nav1">
    <router-link to="/">Home</router-link>
    <router-link to="/gekauft">Gekauft</router-link>
    <router-link to="/angeboten">Angeboten</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/kontakt">Kontakt</router-link>
    <!-- <router-link to="/datenschutz">Datenschutz</router-link> -->
  </nav>
  <div v-if="testModus" class="btn btn-2" :onClick="update">Testbutton</div>
  <router-view/>
</template>
<script>
/* eslint-disable */
import { login,auth,logout, updateAllParams, updateAStatus} from '@/main';
  export default{
  data(){
    return{
      modal:null,
      testModus:false
    }
  },
  computed: {
    loggedIn1: function() {
      return auth
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
      login();
    },
    update(){
      updateAStatus()
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
.likeA{
  text-decoration: none;
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
}

nav a.router-link-exact-active {
  color: #210e2f
}
</style>