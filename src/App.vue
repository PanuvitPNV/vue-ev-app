<template>
    <Navbar />
    <FormMaps />
</template>

<script>
import Navbar from './components/Navbar.vue'
import FormMaps from './components/FormMaps.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    FormMaps
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
