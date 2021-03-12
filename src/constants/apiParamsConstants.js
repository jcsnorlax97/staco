// apiParamsConstants.js

const params = {
  tenNewestQuestions: (tag, fromDate, toDate) => {
    return {
      pagesize: 10,
      fromdate: `${fromDate}`,
      todate: `${toDate}`,
      order: "desc",
      sort: "creation",
      tagged: `${tag}`,
      site: "stackoverflow",
      filter: "withbody"
    };
  },
  tenMostVotedQuestions: (tag, fromDate, toDate) => {
    return {
      pagesize: 10,
      fromdate: `${fromDate}`,
      todate: `${toDate}`,
      order: "desc",
      sort: "votes",
      tagged: `${tag}`,
      site: "stackoverflow",
      filter: "withbody"
    };
  },
  answers: () => {
    return {
      order: "desc",
      sort: "activity",
      site: "stackoverflow",
      filter: "withbody"
    };
  },
  comments: () => {
    return {
      order: "desc",
      sort: "creation",
      site: "stackoverflow",
      filter: "withbody"
    };
  }
};

// function-level factory
export default {
  get: name => params[name]
};
