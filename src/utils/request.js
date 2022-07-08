import axios from "axios";
import { Message } from "element-ui";
import nprogress from "nprogress";
// 引入进度条样式
import "nprogress/nprogress.css";
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000, // request timeout
});

//请求拦截器：携带的token字段
service.interceptors.request.use(
  (config) => {
    // 进度条开始动
    nprogress.start();
    let token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

//响应拦截器
service.interceptors.response.use(
  (response) => {
    nprogress.done();
    const res = response.data;
    return res;
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
