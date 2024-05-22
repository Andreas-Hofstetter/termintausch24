<template>
  <div id="compName">TerminTausch24</div>
  <div class="cnt">
    <div class="search-bar">
    <input type="text" placeholder="Search..." class="search-input">
    <img class="search-button" src="../assets/magGlas.png" />
  </div>
  </div>
  <div class="home">
    <Contract  :shortDesc="'All-you-can eat buffet'" :price="20"
    :conditions="'Tisch'" :options="['a']"/>
  </div>
</template>

<script>
/* eslint-disable */
import Contract from '@/components/Contract.vue';
import "../assets/styles/main.css"
export default {
  name: 'HomeView',
  components: {
    Contract
}
}
</script>