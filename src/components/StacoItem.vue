<template>
  <li class="staco-item">
    <p>{{ staco.question_id }}</p>
    <p>{{ staco.question_title }}</p>
    <p>{{ staco.question_creation_date }}</p>
    <p>{{ staco.question_votes }}</p>
    <p v-html="staco.question_body"></p>

    <ul>
      Question Comments:
      <li
        v-for="comment in staco.question_comments"
        :key="comment.comment_id"
        class="question-comment-body"
      >
        {{ comment.body }}
      </li>
    </ul>

    <ul>
      Answers:
      <!-- <li v-for="answer in staco.answers" :key></li> -->
      <p>{{ staco.answers }}</p>
    </ul>
  </li>
</template>

<script>
export default {
  name: "StacoItem",
  props: {
    staco: {
      type: Object,
      required: true
    }
  }
};
</script>

<style>
.staco-item {
  text-align: left;
}
code {
  display: block;
  overflow-wrap: break-word;
  background-color: lightgray;
  min-block-size: 10px;
  min-inline-size: 10px;
}
</style>
