<template>
  <div class="staco-section">
    <div class="staco-section__staco-lists-container">
      <div
        id="staco-section__newest-staco-list-wrapper"
        class="staco-section__staco-list-wrapper"
      >
        <StacoList
          :stacoItems="tenNewestStacoItems"
          :title="'Ten Newest Staco List'"
        />
      </div>
      <div
        id="staco-section__most-voted-staco-list-wrapper"
        class="staco-section__staco-list-wrapper"
      >
        <StacoList
          :stacoItems="tenMostVotedStacoItems"
          :title="'Ten Most Voted Staco List'"
        />
      </div>
    </div>
    <div class="staco-section__total-fetching-time-wrapper">
      <div class="staco-section__total-fetching-time-label">
        Total fetching time among 8 API calls:
      </div>
      <div class="staco-section__total-fetching-time">
        {{
          `${totalAPIFetchingTime} ms = ${totalAPIFetchingTime / 1000} seconds`
        }}
      </div>
      <div class="staco-section__average-fetching-time-label">
        Average fetching time among 8 API calls:
      </div>
      <div class="staco-section__total-fetching-time">
        {{
          `${averageAPIFetchingTime} ms = ${averageAPIFetchingTime /
            1000} seconds`
        }}
      </div>
    </div>
  </div>
</template>

<script>
import StacoList from "./StacoList.vue";
import { ConstantsFactory } from "../constants/ConstantsFactory";
import { RepositoryFactory } from "../service/RepositoryFactory";
const ApiParamsConstants = ConstantsFactory.get("apiParams");
const QuestionsRepository = RepositoryFactory.get("questions");
const AnswersRepository = RepositoryFactory.get("answers");

export default {
  name: "StacoSection",
  components: { StacoList },
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tenNewestStacoItems: [],
      tenMostVotedStacoItems: [],
      durationToFetchNewestStacoItems: 0,
      durationToFetchMostVotedStacoItems: 0
    };
  },
  mounted() {
    if (this.tag.length > 0) {
      this.fetch_ten_newest_staco_items();
      this.fetch_ten_most_voted_staco_items();
    }
  },
  computed: {
    totalAPIFetchingTime() {
      return (
        this.durationToFetchNewestStacoItems +
        this.durationToFetchMostVotedStacoItems
      );
    },
    averageAPIFetchingTime() {
      const apiCount = 8;
      return (
        (this.durationToFetchNewestStacoItems +
          this.durationToFetchMostVotedStacoItems) /
        apiCount
      );
    }
  },
  watch: {
    tag(newTag, oldTag) {
      console.log(
        `[*][DEV][StacoSection] Prop (tag) has changed from "${oldTag}" to "${newTag}".`
      );
      this.fetch_ten_newest_staco_items();
      this.fetch_ten_most_voted_staco_items();
      console.log(
        `[*][DEV][StacoSection] Fetching methods via axios are called!`
      );
    }
  },
  methods: {
    // TODO: brainstorm a way to refactor fetch_ten_newest_staco_items() & fetch_ten_most_voted_staco_items() into one
    async fetch_ten_newest_staco_items() {
      let duration = 0.0;

      // (A) fetch questions (need the question id for answers & comments)
      const questionsRes = await this.fetch_ten_newest_questions();
      const questions = questionsRes.questions;
      duration += questionsRes.duration;
      const questionIds = this.get_question_ids(questions);

      // (B) fetch all questions' comments (based on question ids)
      const questionsCommentsRes = await this.fetch_question_comments(
        questionIds
      );
      const questionsComments = questionsCommentsRes.comments;
      duration += questionsCommentsRes.duration;

      // (C) fetch all questions' answers (based on question ids)
      const answersRes = await this.fetch_answers(questionIds);
      const answers = answersRes.answers;
      duration += answersRes.duration;
      const answerIds = this.get_answer_ids(answers);

      // (D) fetch all answers' comments (based on answer ids)
      const answersCommentsRes = await this.fetch_answer_comments(answerIds);
      const answersComments = answersCommentsRes.comments;
      duration += answersCommentsRes.duration;

      // (E) Derive Staco items via the four information we have
      const stacoItems = this.build_staco_items(
        questions,
        questionsComments,
        answers,
        answersComments
      );
      this.tenNewestStacoItems = stacoItems;
      this.durationToFetchNewestStacoItems = duration;
      console.log(this.tenNewestStacoItems);
      console.log(
        `Total duration to fetch ten newest staco items (Four API calls in total): ${duration}`
      );
    },
    async fetch_ten_most_voted_staco_items() {
      let duration = 0.0;

      // (A) fetch questions (as we need the question id for answers & comments)
      const questionsRes = await this.fetch_ten_most_voted_questions();
      const questions = questionsRes.questions;
      duration += questionsRes.duration;
      const questionIds = this.get_question_ids(questions);

      // (B) fetch all questions' comments (based on question ids)
      const questionsCommentsRes = await this.fetch_question_comments(
        questionIds
      );
      const questionsComments = questionsCommentsRes.comments;
      duration += questionsCommentsRes.duration;

      // (C) fetch all questions' answers (based on question ids)
      const answersRes = await this.fetch_answers(questionIds);
      const answers = answersRes.answers;
      duration += answersRes.duration;
      const answerIds = this.get_answer_ids(answers);

      // (D) fetch all answers' comments (based on answer ids)
      const answersCommentsRes = await this.fetch_answer_comments(answerIds);
      const answersComments = answersCommentsRes.comments;
      duration += answersCommentsRes.duration;

      // (E) Derive Staco items via the four information we have
      const stacoItems = this.build_staco_items(
        questions,
        questionsComments,
        answers,
        answersComments
      );
      this.tenMostVotedStacoItems = stacoItems;
      this.durationToFetchMostVotedStacoItems = duration;
      console.log(this.tenMostVotedStacoItems);
      console.log(
        `Total duration to fetch ten most voted staco items (Four API calls in total): ${duration}`
      );
    },
    async fetch_ten_newest_questions() {
      const toDate = this.get_to_date();
      const fromDate = this.get_from_date(toDate);
      const params = ApiParamsConstants.get("tenNewestQuestions")(
        this.tag,
        fromDate,
        toDate
      );
      const { data, duration } = await QuestionsRepository.get(params);
      const questions = data && data.items ? data.items : [];
      return { questions, duration };
    },
    async fetch_ten_most_voted_questions() {
      const toDate = this.get_to_date();
      const fromDate = this.get_from_date(toDate);
      const params = ApiParamsConstants.get("tenMostVotedQuestions")(
        this.tag,
        fromDate,
        toDate
      );
      const { data, duration } = await QuestionsRepository.get(params);
      const questions = data && data.items ? data.items : [];
      return { questions, duration };
    },
    async fetch_question_comments(questionIds) {
      const params = ApiParamsConstants.get("comments")();
      const { data, duration } = await QuestionsRepository.get_comments(
        questionIds,
        params
      );
      const comments = data && data.items ? data.items : [];
      return { comments, duration };
    },
    async fetch_answers(questionIds) {
      const params = ApiParamsConstants.get("answers")();
      const { data, duration } = await QuestionsRepository.get_answers(
        questionIds,
        params
      );
      const answers = data && data.items ? data.items : [];
      return { answers, duration };
    },
    async fetch_answer_comments(answerIds) {
      const params = ApiParamsConstants.get("comments")();
      const { data, duration } = await AnswersRepository.get_comments(
        answerIds,
        params
      );
      const comments = data && data.items ? data.items : [];
      return { comments, duration };
    },
    build_staco_items(questions, questionComments, answers, answerComments) {
      const stacoItems = questions.map(question => {
        const commentsInOneQuestion = questionComments.filter(
          comment => comment.post_id === question.question_id
        );
        const answersInOneQuestion = answers.filter(
          answer => answer.question_id === question.question_id
        );

        // for each answer, find all matching comments and then create a list of comments
        const answersAndCommentsInOneQuestion = answersInOneQuestion.map(
          answer => {
            const commentsInOneAnswer = answerComments.filter(
              comment => comment.post_id === answer.answer_id
            );
            const simplifiedCommentsInOneAnswer = commentsInOneAnswer.map(
              comment => {
                return {
                  comment_id: comment.comment_id,
                  comment_body: comment.body
                };
              }
            );
            const simplifiedAnswersInOneQuestion = {
              answer_id: answer.answer_id,
              answer_body: answer.body,
              comments: simplifiedCommentsInOneAnswer
            };
            return simplifiedAnswersInOneQuestion;
          }
        );

        // for each question, combine question info, question comments, answer info, and answer comments into one object.
        return {
          question_id: question.question_id,
          question_title: question.title,
          question_creation_date: question.creation_date,
          question_votes: question.score,
          question_body: question.body,
          question_comments: commentsInOneQuestion,
          answers: answersAndCommentsInOneQuestion
        };
      });

      return stacoItems;
    },
    get_question_ids(questions) {
      const questionIdArray = questions.map(question => question.question_id);
      const questionIdStr = questionIdArray.join(";");
      return questionIdStr;
    },
    get_answer_ids(answers) {
      const answerIdArray = answers.map(answer => answer.answer_id);
      const answerIdStr = answerIdArray.join(";");
      return answerIdStr;
    },
    get_to_date() {
      const toDate = Math.round(Date.now() / 1000);
      return toDate;
    },
    get_from_date(toDate) {
      const oneWeekInSec = 60 * 60 * 24 * 7;
      const fromDate = toDate - oneWeekInSec;
      return fromDate;
    }
  }
};
</script>

<style scoped>
.staco-section__staco-lists-container {
  display: flex;
  flex-flow: row wrap; /* flex direction + flex wrap */
  justify-content: center; /* layout position in the main axis */
}

.staco-section__staco-list-wrapper {
  margin: 5px;
  padding: 10px;
  justify-content: center;
}

#staco-section__newest-staco-list-wrapper {
  max-width: 45%;
  background-color: rgba(225, 200, 255, 0.4);
}

#staco-section__most-voted-staco-list-wrapper {
  max-width: 45%;
  background-color: rgba(150, 197, 255, 0.4);
}
</style>
