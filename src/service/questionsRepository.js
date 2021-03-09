// questionsRepository.js

import Repository from "./Repository";

const resource = "/questions";
export default {
  // `params` must be a plain object.
  // see axios docs (https://github.com/axios/axios#request-config) for more details
  get(params) {
    return Repository.get(`${resource}`, { params });
  }
};
