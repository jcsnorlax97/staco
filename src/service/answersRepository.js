// answersRepository.js

import Repository from "./Repository";

const resource = "/answers";
export default {
  get(questionIds, params) {
    return Repository.get(`${resource}/${questionIds}`, { params });
  },

  get_comments(answerIds, params) {
    return Repository.get(`${resource}/${answerIds}/comments`, { params });
  }
};
