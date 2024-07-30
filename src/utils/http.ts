import axios from "axios";
const ENV = import.meta.env;
const { VITE_API_URL_One, VITE_API_URL_Two } = ENV;

const createHttpInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 7000,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 可以在这里进行统一的请求拦截处理
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (res) => {
      return res.data;
    },
    (error) => {
      // 处理网络错误
      let msg = "";
      const status = error.response?.status || "500";
      switch (status) {
        case 401:
          msg = "token过期";
          break;
        case 403:
          msg = "无权访问";
          break;
        case 404:
          msg = "请求地址错误";
          break;
        case 500:
          msg = "服务器出现问题";
          break;
        default:
          msg = "网络出现问题";
          break;
      }
      // 这里可以根据实际情况使用你的消息提示组件，例如 ElMessage
      console.error(msg);
      return Promise.reject(error);
    }
  );

  return instance;
};

// 接口1
const http1 = createHttpInstance(VITE_API_URL_One);
// 接口2
const http2 = createHttpInstance(VITE_API_URL_Two);

export { http1, http2 };
