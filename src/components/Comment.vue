<template>
<!-- eslint-disable -->
    <div class="comment">
        <h4>{{ this.comment.uname }}</h4>
        <div>{{ this.comment.text }}</div>
        <!-- <div>{{ this.comment.likes }}</div> -->
    </div>
  </template>
<script>
/* eslint-disable */

  export default {
    name: 'CommentTemplate',
    props: {
      comment:Object
    },
    mounted(){
      
    },
    data(){
      return{
        
      }
    },
    methods: {
      
    }
  }
</script>