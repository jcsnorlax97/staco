<template>
  <div class="staco-item" @click="toggle">
    <div class="staco-item__staco-overview-wrapper">
      <div class="staco-item__title">
        {{ staco.question_title }}
      </div>
      <div class="staco-item__date-and-votes-wrapper">
        <div class="staco-item__creation-date">
          {{
            new Date(staco.question_creation_date * 1000).toLocaleString(
              "en-GB",
              {
                hour12: false,
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZoneName: "short"
              }
            )
          }}
        </div>
        <div class="staco-item__votes">
          {{ staco.question_votes + " Votes" }}
        </div>
      </div>
    </div>
    <div
      ref="staco-item__details"
      class="staco-item__details"
      :style="[isActive ? { height: computedHeight } : {}]"
    >
      <br />
      <hr />
      <br />
      <div class="staco-item__question-body-wrapper">
        <div class="staco-item__question-body-label">Question Body:</div>
        <div
          v-html="staco.question_body"
          class="staco-item__question-body"
        ></div>
      </div>
      <br />
      <br />
      <div class="staco-item__question-comments-wrapper">
        <div class="staco-item__question-comments-label">
          Question Comments:
        </div>
        <br />
        <div
          v-for="(comment, index) in staco.question_comments"
          :key="comment.comment_id"
          class="staco-item__question-comment-wrapper"
        >
          <div class="staco-item__question-comment-label">
            Comment #{{ index }}:
          </div>
          <div v-html="comment.body" class="staco-item__question-comment"></div>
          <br v-if="index < staco.question_comments.length - 1" />
        </div>
      </div>
      <br />
      <hr />
      <br />
      <div class="staco-item__question-answer-section">
        <div
          v-for="(answer, index) in staco.answers"
          :key="answer.answer_id"
          class="staco-item__answer-wrapper"
        >
          <div class="staco-item__answer-body-label">
            Answer #{{ index + 1 }}:
          </div>
          <div
            v-html="answer.answer_body"
            class="staco-item__answer-body"
          ></div>
          <br />
          <br />
          <div class="staco-item__answer-comments-wrapper">
            <div class="staco-item__answer-comments-label">
              Answer #{{ index + 1 }} Comments:
            </div>
            <br />
            <div
              v-for="(comment, index) in answer.comments"
              :key="comment.comment_id"
              class="staco-item__answer-comment-wrapper"
            >
              <div class="staco-item__answer-comment-label">
                Comment #{{ index }}:
              </div>
              <div
                v-html="comment.comment_body"
                class="staco-item__answer-comment"
              ></div>
              <br v-if="index < answer.comments.length - 1" />
            </div>
            <hr />
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StacoItem",
  props: {
    staco: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isActive: false,
      computedHeight: 0
    };
  },
  mounted() {
    this.initHeight();
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive;
    },
    initHeight() {
      // set height to be "auto" in order to pre-computed the height when this staco item is mounted,
      // such that this component can reuse that height for doing onClick transition smoothly.
      // ref: https://stackoverflow.com/a/52020716
      this.$refs["staco-item__details"].style.height = "auto";
      const height = getComputedStyle(this.$refs["staco-item__details"]).height;
      this.computedHeight = height;
      this.$refs["staco-item__details"].style.height = 0; // reset to 0 after the preprocessing.
    }
  }
};
</script>

<style scoped>
.staco-item {
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  border: 1px solid #dfe3e8;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.25s ease;
  margin: 10px;
  text-align: left;
  line-height: 1.5em;
}

/* --- componant wrapper --- */
.staco-item:hover {
  transform: scale(1.1, 1.1);
  background-color: #fcfcfc;
}

/* --- overview --- */
.staco-item__title {
  font-weight: bold;
  font-size: 16px;
}

.staco-item__creation-date {
  font-size: 14px;
}

.staco-item__votes {
  font-size: 14px;
}

/* --- details --- */
.staco-item__details {
  height: 0;
  overflow: hidden;
  transition: 1s;
}

/* --- details: question body --- */
.staco-item__question-body-wrapper {
  font-size: 13px;
  line-height: 1.2em;
}

.staco-item__question-body-label {
  font-weight: bold;
}

/* restricts contents of "pre" tag to be within the block ("pre" tag consists of programming codes) */
.staco-item__question-body /deep/ pre {
  display: block;
  overflow: auto;
  background-color: #eee;
  max-width: 100%;
  max-height: 300px;
}

/* restricts size of images to be within container */
.staco-item__question-body /deep/ img {
  max-width: 100%;
  max-height: 100%;
}

/* --- details: question comments --- */
.staco-item__question-comment /deep/ pre {
  display: block;
  overflow: auto;
  background-color: #eee;
  max-width: 100%;
  max-height: 300px;
}

.staco-item__question-comment /deep/ img {
  max-width: 100%;
  max-height: 100%;
}

.staco-item__question-comments-wrapper {
  font-size: 13px;
  line-height: 1.2em;
}

.staco-item__question-comments-label {
  font-weight: bold;
}

.staco-item__question-comment-label {
  font-weight: bold;
}

/* --- details: (single) answer --- */
.staco-item__answer-wrapper {
  font-size: 13px;
  line-height: 1.2em;
}

/* --- details: answer body --- */
/* restricts contents of "pre" tag t0o be within the block ("pre" tag consists of programming codes) */
.staco-item__answer-body /deep/ pre {
  display: block;
  overflow: auto;
  background-color: #eee;
  max-width: 100%;
  max-height: 300px;
}

/* restricts size of images to be within container */
.staco-item__answer-body /deep/ img {
  max-width: 100%;
  max-height: 100%;
}

.staco-item__answer-body-label {
  font-weight: bold;
}

/* --- details: answer comments --- */
.staco-item__answer-comment /deep/ pre {
  display: block;
  overflow: auto;
  background-color: #eee;
  max-width: 100%;
  max-height: 300px;
}

.staco-item__answer-comment /deep/ img {
  max-width: 100%;
  max-height: 100%;
}

.staco-item__answer-comments-wrapper {
  font-size: 13px;
  line-height: 1.2em;
}

.staco-item__answer-comments-label {
  font-weight: bold;
}

.staco-item__answer-comment-label {
  font-weight: bold;
}
</style>
