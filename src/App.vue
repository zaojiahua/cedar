<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    mounted() {
      if(0){
        this.$router.push({name: 'login'})
      } else {
        this.$router.push({name: 'home'})
      }
    }
  }
</script>

<style>
</style>
