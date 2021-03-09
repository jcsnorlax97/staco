// RepositoryFactory.js

import QuestionsRepository from "./questionsRepository";

const repositories = {
  questions: QuestionsRepository
};

export const RepositoryFactory = {
  get: name => repositories[name]
};
