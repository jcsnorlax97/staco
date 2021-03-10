// RepositoryFactory.js

import QuestionsRepository from "./questionsRepository";
import AnswersRepository from "./answersRepository";

const repositories = {
  questions: QuestionsRepository,
  answers: AnswersRepository
};

export const RepositoryFactory = {
  get: name => repositories[name]
};
