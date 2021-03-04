<template>
  <div class="search-bar">
    Search Bar
    <form
      action=""
      class="search-bar__search-staco-via-tag"
      @submit.prevent="onSubmit"
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
  name: 'SearchBar',
  data() {
    return {
      tag: '',
    }
  },
  methods: {
    onSubmit() {
      this.$emit('search-staco-via-tag', this.tag)
    },
  },
}
</script>
