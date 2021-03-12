/* axios docs: https://github.com/axios/axios#request-config */
import axios from "axios";

const baseDomain = "https://api.stackexchange.com";
const baseURL = `${baseDomain}/2.2`; // baseURL is a keyword reserved for axios => won't work if renaming it to be baseUrl.

const API = axios.create({
  baseURL,
  headers: { Accept: "application/json" }
});

/**
 * setting interceptors for knowing the response time of each request.
 * ref: https://gist.github.com/gnurgeldiyev/cbca8cc4dd0b4e144d0bd55ff3412ee5
 */
API.interceptors.request.use(
  config => {
    const newConfig = { ...config };
    newConfig.metadata = { startTime: new Date() };
    return newConfig;
  },
  error => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  response => {
    const newResponse = { ...response };
    newResponse.config.metadata.endTime = new Date();
    newResponse.duration =
      newResponse.config.metadata.endTime -
      newResponse.config.metadata.startTime;
    return newResponse;
  },
  error => {
    const newError = { ...error };
    newError.config.metadata.endTime = new Date();
    newError.duration =
      newError.config.metadata.endTime - newError.config.metadata.startTime;
    return Promise.reject(newError);
  }
);

export default API;
