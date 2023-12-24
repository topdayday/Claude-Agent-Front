<template>
  <div id="app">
    <AppMain />
  </div>
</template>

<script>

import AppMain from './components/AppMain.vue'

export default {
  name: 'App',
  components: {
    AppMain
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
</style>
