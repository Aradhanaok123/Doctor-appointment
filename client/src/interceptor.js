import axios from "axios";
axios.defaults.timeout = 0.5 * 60 * 1000;

const storage = window.localStorage;
const setupAxiosInterceptors = () => {
  const onRequestSuccess = (config) => {
    const token = storage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };
  const onResponseSuccess = (response) => {
    return response;
  };
  const onResponseError = (err) => {
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;