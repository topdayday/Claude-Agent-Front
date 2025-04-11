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
  width: 100%;
}

 
html,
body {
  width: 100%;
  max-width: 100%; /* 再次确认 */
  overflow-x: hidden;
  overscroll-behavior-x: contain; /* 推荐 */
  margin: 0;
  padding: 0;
}

/* 可选，如果需要更强硬禁止拖动手势 */
/* body, #app {
  touch-action: pan-y;
} */

* {
  box-sizing: border-box;
}

</style>
