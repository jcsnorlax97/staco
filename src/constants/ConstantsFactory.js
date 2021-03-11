// ConstantsFactory.js

import ApiParamsConstants from "./apiParamsConstants";

const constants = {
  apiParams: ApiParamsConstants
};

export const ConstantsFactory = {
  get: name => constants[name]
};
