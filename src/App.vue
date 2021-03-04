<template>
  <div id="id">
    Staco
    <SearchBar @search-staco-via-tag="searchStacoViaTag" />
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue'

export default {
  name: 'App',
  components: {
    SearchBar,
  },
  methods: {
    searchStacoViaTag(tag) {
      if (tag && tag !== '') {
        console.log(`Tag ${tag} has been entered!`)
        alert(`Tag ${tag} has been entered!`)
      }
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
