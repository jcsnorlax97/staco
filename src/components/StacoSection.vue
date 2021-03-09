<template>
  <div class="staco-section">
    Staco Section Container
    <StacoList :stacoItems="tenNewestStacoItems" />
    <!-- <StacoList :stacoItems="tenNewestquestions" /> -->
    <!-- {{ buildRequestUrl_TenNewestQuestions }} -->
    <!-- {{ buildRequestUrl_TenMostVotedQuestions }} -->
    {{ tenNewestQuestionIds }}
  </div>
</template>

<script>
import axios from "axios";
import StacoList from "./StacoList.vue";

//TODO: Super ugly; Need refactoring later on.
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
      tenNewestQuestions: [
        {
          tags: ["java", "jpa", "java-ee-8", "jpa-jta"],
          owner: {
            reputation: 8214,
            user_id: 3018377,
            user_type: "registered",
            accept_rate: 64,
            profile_image: "https://i.stack.imgur.com/LlpBb.jpg?s=128&g=1",
            display_name: "Loc",
            link: "https://stackoverflow.com/users/3018377/loc"
          },
          is_answered: false,
          view_count: 8,
          answer_count: 0,
          score: 0,
          last_activity_date: 1614883151,
          creation_date: 1614875666,
          last_edit_date: 1614883151,
          question_id: 66479210,
          content_license: "CC BY-SA 4.0",
          link:
            "https://stackoverflow.com/questions/66479210/how-to-execute-jpa-named-native-update-query-in-batch-with-jta-usertransaction",
          title:
            "How to execute JPA Named Native Update Query In Batch with JTA UserTransaction?"
        },
        {
          tags: ["java", "boolean"],
          owner: {
            reputation: 1,
            user_id: 15326228,
            user_type: "registered",
            profile_image:
              "https://www.gravatar.com/avatar/4b8be091d46c21eb649fd548061e5363?s=128&d=identicon&r=PG&f=1",
            display_name: "beepingdirect",
            link: "https://stackoverflow.com/users/15326228/beepingdirect"
          },
          is_answered: false,
          view_count: 9,
          answer_count: 1,
          score: 0,
          last_activity_date: 1614883096,
          creation_date: 1614879932,
          last_edit_date: 1614882630,
          question_id: 66480342,
          content_license: "CC BY-SA 4.0",
          link:
            "https://stackoverflow.com/questions/66480342/mark-task-complete-on-a-java-se-todo-list-application",
          title:
            "Mark &lt;Task&gt; (COMPLETE) on a Java SE todo list application"
        }
      ],
      tenNewestQuestions_Comments: [],
      tenNewestQuestions_Answers: [],
      tenNewestQuestions_Answers_Comments: [],
      tenMostVotedStacoItems: [],
      tenMostVotedQuestions: [],
      tenMostVotedQuestions_Comments: [],
      tenMostVotedQuestions_Answers: [],
      tenMostVotedQuestions_Answers_Comments: []
    };
  },
  computed: {
    tenNewestQuestionIds: function() {
      const questionIdArray = this.tenNewestQuestions.map(
        question => question.question_id
      );
      const questionIdStr = questionIdArray.join(";");
      console.log(
        `[*][DEV][StacoSection] tenNewestQuestionIds are computed: ${questionIdStr}`
      );
      return questionIdStr;
    },
    tenMostVotedQuestionIds: function() {
      const questionIdArray = this.tenMostVotedQuestions.map(
        question => question.question_id
      );
      const questionIdStr = questionIdArray.join(";");
      console.log(
        `[*][DEV][StacoSection] tenMostVotedQuestionIds are computed: ${questionIdStr}`
      );
      return questionIdStr;
    },
    tenNewestQuestions_AnswerIds: function() {
      const answerIdArray = this.tenNewestQuestions_Answers.map(
        answer => answer.answer_id
      );
      const answerIdStr = answerIdArray.join(";");
      console.log(`answerIdStr: ${answerIdStr}`);
      return answerIdStr;
    }
  },
  watch: {
    tag(newTag, oldTag) {
      console.log(
        `[*][DEV][StacoSection] Prop (tag) has changed from "${oldTag}" to "${newTag}".`
      );
      this.fetch_TenNewestStacoItems();
      // this.fetch_TenMostVotedQuestions()
      console.log(
        `[*][DEV][StacoSection] Fetching methods via axios are called!`
      );
    }
  },
  methods: {
    async fetch_TenNewestStacoItems() {
      console.log("1");
      const config = {
        headers: {
          Accept: "application/json"
        }
      };
      console.log("2");

      // (A) fetch questions (need the question id for answers & comments)
      await this.fetch_TenNewestQuestions(config);
      if (this.tenNewestQuestions.length === 0) return;
      console.log(this.tenNewestQuestions);
      console.log("3");

      // (B) fetch questions' comments (based on question ids)
      await this.fetch_TenNewestQuestions_Comments(config);
      //   if (this.tenNewestQuestions_Comments === 0) return
      console.log(`[4] ${this.tenNewestQuestions_Comments}`); // "body"

      // (C) fetch answers (based on question ids)
      await this.fetch_TenNewestQuestions_Answers(config);
      //   if (this.tenNewestQuestions_Answers.length === 0) return
      console.log(`[5] ${this.tenNewestQuestions_Answers}`); // comment_body

      // (D) fetch answers' comments (based on answer ids)
      await this.fetch_TenNewestQuestions_Answers_Comments(config);
      //   if (this.tenNewestQuestions_Answers_Comments.length === 0) return
      console.log(`[6] ${this.tenNewestQuestions_Answers_Comments}`);

      // (E)
      const stacoItems = this.generate_TenNewestStacos();
      this.tenNewestStacoItems = stacoItems;
      console.log(stacoItems);
      console.log(this.tenNewestStacoItems);
    },

    // --- fetch (Newest) ---
    async fetch_TenNewestQuestions(config) {
      console.log("2a");
      const request = this.buildRequestUrl_TenNewestQuestions();
      console.log("2b");
      if (request && request !== "") {
        console.log("2c");
        const questions = await axios.get(request, config);
        this.tenNewestQuestions = questions.data.items;
        return true;
      }
      console.log("2e");
      this.tenNewestQuestions = [];
      return false;
    },
    async fetch_TenNewestQuestions_Comments(config) {
      const request = this.buildRequestUrl_TenNewestQuestions_Comments();
      if (request && request !== "") {
        const comments = await axios.get(request, config);
        this.tenNewestQuestions_Comments = comments.data.items;
        return true;
      }
      this.tenNewestQuestions_Comments = [];
      return false;
    },
    async fetch_TenNewestQuestions_Answers(config) {
      const request = this.buildRequestUrl_TenNewestQuestions_Answers();
      if (request && request !== "") {
        const answers = await axios.get(request, config);
        this.tenNewestQuestions_Answers = answers.data.items;
        return true;
      }
      this.tenNewestQuestions_Answers = [];
      return false;
    },
    async fetch_TenNewestQuestions_Answers_Comments(config) {
      const request = this.buildRequestUrl_TenNewestQuestions_Answers_Comments();
      if (request && request !== "") {
        const comments = await axios.get(request, config);
        this.tenNewestQuestions_Answers_Comments = comments.data.items;
        return true;
      }
      this.tenNewestQuestions_Answers_Comments = [];
      return false;
    },
    generate_TenNewestStacos() {
      //   const tenNewestStacos = []
      const stacoItems = this.tenNewestQuestions.map(question => {
        const questionComments = this.tenNewestQuestions_Comments.filter(
          comment => comment.post_id === question.question_id
        );
        const questionAnswers = this.tenNewestQuestions_Answers.filter(
          answer => answer.question_id === question.question_id
        );

        // for each answer, find all matching comments and then create a list of comments
        const results_AnswerComments = questionAnswers.map(answer => {
          const questionAnswerComments = this.tenNewestQuestions_Answers_Comments.filter(
            comment => comment.post_id === answer.answer_id
          );
          return questionAnswerComments.map(comment => {
            return {
              answer_id: answer.answer_id,
              comment_id: comment.comment_id,
              answer_body: answer.body,
              comment_body: comment.body
            };
          });
        });

        // for each question, combine question info, question comments, answer info, and answer comments into one object.
        return {
          question_id: question.question_id,
          question_title: question.title,
          question_creation_date: question.creation_date,
          question_votes: question.score,
          question_body: question.body,
          question_comments: questionComments,
          answers: results_AnswerComments
        };
      });

      return stacoItems;
    },

    // --- fetch (MostVoted) ---
    async fetch_TenMostVotedQuestions() {
      const request = this.buildRequestUrl_TenMostVotedQuestions();
      if (request && request !== "") {
        let config = {
          headers: {
            Accept: "application/json"
          }
        };
        const questions = await axios.get(request, config);
        // axios.all([axios.get(firstUrl), axios.get(secondUrl)])
        console.log(questions);

        console.log(
          `[*][DEV][StacoSection] ${questions.data.items.length} most voted questions during the past week have been fetched!`
        );
        this.tenMostVotedQuestions = questions.data.items;
        console.log(
          `[*][DEV][StacoSection] These questions have been stored into data()!`
        );
      }
      this.tenNewestQuestions = [];
    },

    buildRequestUrl_TenNewestQuestions() {
      if (this.tag && this.tag !== "") {
        const domain = "https://api.stackexchange.com";
        const endpoint = "2.2/questions";
        const queryString = `pagesize=10&order=desc&sort=creation&tagged=${this.tag}&site=stackoverflow&filter=withbody`;
        const request = `${domain}/${endpoint}?${queryString}`;
        console.log(request);
        return request;
      }
      return "";
    },
    buildRequestUrl_TenNewestQuestions_Comments() {
      const questionIds = this.tenNewestQuestionIds;
      if (questionIds && questionIds !== "") {
        const domain = "https://api.stackexchange.com";
        const endpoint = `2.2/questions/${questionIds}/comments`;
        const queryString =
          "order=desc&sort=creation&site=stackoverflow&filter=withbody";
        const request = `${domain}/${endpoint}?${queryString}`;
        return request;
      }
      return "";
    },
    buildRequestUrl_TenNewestQuestions_Answers() {
      const questionIds = this.tenNewestQuestionIds;
      if (questionIds && questionIds !== "") {
        const domain = "https://api.stackexchange.com";
        const endpoint = `2.2/answers/${questionIds}`;
        const queryString =
          "order=desc&sort=activity&site=stackoverflow&filter=withbody";
        const request = `${domain}/${endpoint}?${queryString}`;
        return request;
      }
      return "";
    },
    buildRequestUrl_TenNewestQuestions_Answers_Comments() {
      const answerIds = this.tenNewestQuestions_AnswerIds;
      if (answerIds && answerIds !== "") {
        const domain = "https://api.stackexchange.com";
        const endpoint = `2.2/answers/${answerIds}/comments`;
        const queryString =
          "order=desc&sort=creation&site=stackoverflow&filter=withbody";
        const request = `${domain}/${endpoint}?${queryString}`;
        return request;
      }
      return "";
    },
    buildRequestUrl_TenMostVotedQuestions() {
      if (this.tag && this.tag !== "") {
        const toDate = this.getToDate();
        const fromDate = this.getFromDate(toDate);
        console.log(
          `[*][DEV][StacoSection] fromDate: ${fromDate} | toDate: ${toDate}`
        );
        const domain = "https://api.stackexchange.com";
        const endpoint = "2.2/questions";
        const queryString = `pagesize=10&fromdate=${fromDate}&todate=${toDate}&order=desc&sort=votes&tagged=${this.tag}&site=stackoverflow&filter=withbody`;
        const request = `${domain}/${endpoint}?${queryString}`;
        console.log(
          `[*][DEV][StacoSection] request url for the ten newest questions are computed: ${request}`
        );
        return request;
      }
      return "";
    },
    getToDate() {
      const toDate = Math.round(Date.now() / 1000);
      return toDate;
    },
    getFromDate(toDate) {
      const oneWeekInSec = 60 * 60 * 24 * 7;
      const fromDate = toDate - oneWeekInSec;
      return fromDate;
    }
  }
};
</script>
