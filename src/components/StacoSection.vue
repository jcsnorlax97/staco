<template>
  <div class="staco-section">
    Staco Section Container
    <StacoList :stacoItems="tenNewestStacoItems" />
    <StacoList :stacoItems="tenMostVotedStacoItems" />
    {{ tenNewestQuestionIds }}
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
      tenMostVotedStacoItems: []
    };
  },
  mounted() {
    if (this.tag.length > 0) {
      this.fetch_ten_newest_staco_items();
      this.fetch_ten_most_voted_staco_items();
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
    async fetch_ten_newest_staco_items() {
      // (A) fetch questions (need the question id for answers & comments)
      const questions = await this.fetch_ten_newest_questions();
      const questionIds = this.get_question_ids(questions);

      // (B) fetch all questions' comments (based on question ids)
      const questionsComments = await this.fetch_question_comments(questionIds);

      // (C) fetch all questions' answers (based on question ids)
      const answers = await this.fetch_answers(questionIds);
      const answerIds = this.get_answer_ids(answers);

      // (D) fetch all answers' comments (based on answer ids)
      const answersComments = await this.fetch_answer_comments(answerIds);

      // (E) Derive Staco items via the four information we have
      const stacoItems = this.build_staco_items(
        questions,
        questionsComments,
        answers,
        answersComments
      );
      this.tenNewestStacoItems = stacoItems;
      console.log(this.tenNewestStacoItems);
    },
    async fetch_ten_most_voted_staco_items() {
      // (A) fetch questions (as we need the question id for answers & comments)
      const questions = await this.fetch_ten_most_voted_questions();
      const questionIds = this.get_question_ids(questions);

      // (B) fetch all questions' comments (based on question ids)
      const questionsComments = await this.fetch_question_comments(questionIds);

      // (C) fetch all questions' answers (based on question ids)
      const answers = await this.fetch_answers(questionIds);
      const answerIds = this.get_answer_ids(answers);

      // (D) fetch all answers' comments (based on answer ids)
      const answersComments = await this.fetch_answer_comments(answerIds);

      // (E) Derive Staco items via the four information we have
      const stacoItems = this.build_staco_items(
        questions,
        questionsComments,
        answers,
        answersComments
      );
      this.tenMostVotedStacoItems = stacoItems;
      console.log(this.tenMostVotedStacoItems);
    },
    async fetch_ten_newest_questions() {
      const params = ApiParamsConstants.get("tenNewestQuestions")(this.tag);
      const { data } = await QuestionsRepository.get(params);
      const questions = data && data.items ? data.items : [];
      return questions;
    },
    async fetch_ten_most_voted_questions() {
      const toDate = this.get_to_date();
      const fromDate = this.get_from_date(toDate);
      const params = ApiParamsConstants.get("tenMostVotedQuestions")(
        this.tag,
        fromDate,
        toDate
      );
      const { data } = await QuestionsRepository.get(params);
      const questions = data && data.items ? data.items : [];
      return questions;
    },
    async fetch_question_comments(questionIds) {
      const params = ApiParamsConstants.get("comments")();
      const { data } = await QuestionsRepository.get_comments(
        questionIds,
        params
      );
      const comments = data && data.items ? data.items : [];
      return comments;
    },
    async fetch_answers(questionIds) {
      const params = ApiParamsConstants.get("answers")();
      const { data } = await AnswersRepository.get(questionIds, params);
      const answers = data && data.items ? data.items : [];
      return answers;
    },
    async fetch_answer_comments(answerIds) {
      const params = ApiParamsConstants.get("comments")();
      const { data } = await AnswersRepository.get_comments(answerIds, params);
      const comments = data && data.items ? data.items : [];
      return comments;
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
            return commentsInOneAnswer.map(comment => {
              return {
                answer_id: answer.answer_id,
                answer_body: answer.body,
                comment_id: comment.comment_id,
                comment_body: comment.body
              };
            });
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
