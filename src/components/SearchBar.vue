<template>
  <div class="search-bar">
    <form class="search-bar__staco-search-form" @submit.prevent="onSubmit">
      <label for="tag">Tag: </label>
      <input type="text" id="tag" placeholder="e.g. javascript" />
      <button>Search!</button>
    </form>
    <br />
    {{ `Tag "${this.tag}" is searched!` }}
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  methods: {
    onSubmit(event) {
      console.log(
        `[*][DEV][SearchBar] onSubmit is triggered with tag: "${event.target.tag.value}".`
      );
      console.log(
        `[*][DEV][SearchBar] "submit-search-bar" will be emitted with the tag: "${event.target.tag.value}"!`
      );
      this.$emit("submit-search-bar", event.target.tag.value);
      console.log(
        `[*][DEV][SearchBar] "submit-search-bar" has been emitted with the tag: "${event.target.tag.value}"!`
      );
    }
  }
};
</script>
