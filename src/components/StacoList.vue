<template>
  <div class="staco-list">
    Staco List
    <ul>
      <StacoItem
        v-for="staco in stacoItems"
        :key="staco.question_id"
        :staco="staco"
      />
    </ul>
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
    }
  }
};
</script>
