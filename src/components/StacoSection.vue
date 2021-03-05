<template>
  <div class="staco-section">
    Staco Section Container
    <StacoList :stacoItems="tenNewestStacoItems" />
    <StacoList :stacoItems="tenNewestStacoItems" />
  </div>
</template>

<script>
import axios from 'axios'
import StacoList from './StacoList.vue'

export default {
  name: 'StacoSection',
  components: { StacoList },
  props: {
    tag: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tenNewestStacoItems: [
        {
          tags: ['java', 'jpa', 'java-ee-8', 'jpa-jta'],
          owner: {
            reputation: 8214,
            user_id: 3018377,
            user_type: 'registered',
            accept_rate: 64,
            profile_image: 'https://i.stack.imgur.com/LlpBb.jpg?s=128&g=1',
            display_name: 'Loc',
            link: 'https://stackoverflow.com/users/3018377/loc',
          },
          is_answered: false,
          view_count: 8,
          answer_count: 0,
          score: 0,
          last_activity_date: 1614883151,
          creation_date: 1614875666,
          last_edit_date: 1614883151,
          question_id: 66479210,
          content_license: 'CC BY-SA 4.0',
          link:
            'https://stackoverflow.com/questions/66479210/how-to-execute-jpa-named-native-update-query-in-batch-with-jta-usertransaction',
          title:
            'How to execute JPA Named Native Update Query In Batch with JTA UserTransaction?',
        },
        {
          tags: ['java', 'boolean'],
          owner: {
            reputation: 1,
            user_id: 15326228,
            user_type: 'registered',
            profile_image:
              'https://www.gravatar.com/avatar/4b8be091d46c21eb649fd548061e5363?s=128&d=identicon&r=PG&f=1',
            display_name: 'beepingdirect',
            link: 'https://stackoverflow.com/users/15326228/beepingdirect',
          },
          is_answered: false,
          view_count: 9,
          answer_count: 1,
          score: 0,
          last_activity_date: 1614883096,
          creation_date: 1614879932,
          last_edit_date: 1614882630,
          question_id: 66480342,
          content_license: 'CC BY-SA 4.0',
          link:
            'https://stackoverflow.com/questions/66480342/mark-task-complete-on-a-java-se-todo-list-application',
          title:
            'Mark &lt;Task&gt; (COMPLETE) on a Java SE todo list application',
        },
      ],
      tenMostVotedStacoItems: [],
    }
  },
  watch: {
    tag(newTag, oldTag) {
      console.log(
        `[*][DEV][StacoSection] Prop (tag) has changed from "${oldTag}" to "${newTag}".`
      )
      //   this.fetchTenNewestStacoItems()
      //   this.fetchTenMostVotedStacoItems()
      console.log(
        `[*][DEV][StacoSection] Fetching methods via axios are called!`
      )
    },
  },
  methods: {
    async fetchTenNewestStacoItems() {
      if (this.tag && this.tag !== '') {
        let domain = 'https://api.stackexchange.com'
        let endpoint = '2.2/questions'
        let queryString = `pagesize=10&order=desc&sort=creation&tagged=${this.tag}&site=stackoverflow`
        let request = `${domain}/${endpoint}?${queryString}`
        let config = {
          headers: {
            Accept: 'application/json',
          },
        }
        const stacoItems = await axios.get(request, config)
        console.log(
          `[*][DEV][StacoSection] ${stacoItems.data.items.length} newest stacoItems have been fetched!`
        )
        this.tenNewestStacoItems = stacoItems.data.items
        console.log(
          `[*][DEV][StacoSection] These stacoItems have been stored into data()!`
        )
      }
      return []
    },
    async fetchTenMostVotedStacoItems() {
      if (this.tag && this.tag !== '') {
        const toDate = this.getToTime()
        const fromDate = this.getFromTime(toDate)
        console.log(
          `[*][DEV][StacoSection] fromDate: ${fromDate} | toDate: ${toDate}`
        )
        let domain = 'https://api.stackexchange.com'
        let endpoint = '2.2/questions'
        let queryString = `pagesize=10&fromdate=${fromDate}&todate=${toDate}&order=desc&sort=votes&tagged=${this.tag}&site=stackoverflow`
        let request = `${domain}/${endpoint}?${queryString}`
        let config = {
          headers: {
            Accept: 'application/json',
          },
        }
        const stacoItems = await axios.get(request, config)
        console.log(
          `[*][DEV][StacoSection] ${stacoItems.data.items.length} most voted stacoItems during the past week have been fetched!`
        )
        this.tenMostVotedStacoItems = stacoItems.data.items
        console.log(
          `[*][DEV][StacoSection] These stacoItems have been stored into data()!`
        )
      }
    },
    getToDate() {
      const toDate = Math.round(Date.now() / 1000)
      return toDate
    },
    getFromDate(toDate) {
      const oneWeekInSec = 60 * 60 * 24 * 7
      const fromDate = toDate - oneWeekInSec
      return fromDate
    },
  },
}
</script>
