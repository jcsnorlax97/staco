<template>
  <li class="staco-item">
    <p>[{{ staco.question_id }}] {{ staco.title }}</p>
  </li>
</template>

<script>
export default {
  name: 'StacoItem',
  props: {
    staco: {
      type: Object,
      required: true,
    },
  },
}
</script>
