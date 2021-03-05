<template>
  <div id="id">
    Staco
    <SearchBar :tag="tag" @submit-search-bar="submit_SearchBar" />
    <StacoSection :tag="tag" />
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue'
import StacoSection from './components/StacoSection.vue'

export default {
  name: 'App',
  components: {
    SearchBar,
    StacoSection,
  },
  data() {
    return {
      tag: '',
    }
  },
  methods: {
    submit_SearchBar(tag) {
      console.log(
        `[*][DEV][App] "submit-search-bar" is triggered with the tag: "${tag}".`
      )
      this.tag = tag
      console.log(
        `[*][DEV][App] Single source of truth, tag, has been updated to: "${tag}".`
      )
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

.staco-item {
  border: 1px solid #dfe3e8;
}
</style>
