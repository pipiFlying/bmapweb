<template>
  <div id="app">
    <MapGL></MapGL>
  </div>
</template>

<script>
import MapGL from './components/MapGL.vue'

export default {
  name: 'App',
  components: { MapGL },
}
</script>

<style>
body {
  margin: 0;
}
</style>
