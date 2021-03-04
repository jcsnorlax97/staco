<template>
  <div id="id">
    Staco
    <br />
    Search Bar
    <form
      action=""
      class="search-bar__search-staco-via-tag"
      @submit.prevent="searchStacoViaTag"
    >
      <label for="tag">Tag: </label>
      <input type="text" id="tag" v-model="tag" placeholder="e.g. javascript" />
      <button>Search!</button>
    </form>
    {{ tag }}
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      tag: '',
    }
  },
  methods: {
    searchStacoViaTag() {
      if (this.tag && this.tag !== '') {
        console.log(`Tag ${this.tag} has been entered!`)
        alert(`Tag ${this.tag} has been entered!`)
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
