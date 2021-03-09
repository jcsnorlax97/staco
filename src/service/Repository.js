/* axios docs: https://github.com/axios/axios#request-config */
import axios from "axios";

const baseDomain = "https://api.stackexchange.com";
const baseURL = `${baseDomain}/2.2`; // baseURL is a keyword reserved for axios => won't work if renaming it to be baseUrl.

export default axios.create({
  baseURL,
  headers: { Accept: "application/json" }
});
