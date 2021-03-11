// answersRepository.js

import Repository from "./Repository";

const resource = "/answers";
export default {
  get(questionIds, params) {
    return Repository.get(`${resource}/${questionIds}`, { params });
  },

  get_comments(answerIds, params) {
    if (answerIds && answerIds.length > 0) {
      console.log(answerIds);
      return Repository.get(`${resource}/${answerIds}/comments`, { params });
    }
    return { data: null };
  }
};
