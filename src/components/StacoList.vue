<template>
  <div class="staco-list">
    <div class="staco-list__staco-list-title">
      {{ title }}
    </div>
    <div class="staco-list__staco-item-wrapper">
      <StacoItem
        v-for="staco in stacoItems"
        :key="staco.question_id"
        :staco="staco"
      />
    </div>
  </div>
</template>

<script>
import StacoItem from "./StacoItem.vue";

export default {
  name: "StacoList",
  components: { StacoItem },
  props: {
    stacoItems: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: false
    }
  }
};
</script>

<style scoped>
.staco-list__staco-item-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: auto;
  padding: 20px;
}

.staco-list__staco-list-title {
  font-weight: bold;
}
</style>
