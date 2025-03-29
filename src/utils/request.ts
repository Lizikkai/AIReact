import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestHeaders,
  AxiosResponseHeaders
} from "axios";
import { getToken, setToken } from "./ls";
import { message as Message } from "antd";

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000, // 请求超时时间
  headers: {
    "Content-Type": "application/json"
  }
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在这里可以添加请求头等操作
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `${token}`
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 在这里可以处理响应数据
    const { code, data, message } = response.data;
    if (code === 0) {
      const token = getTokenFromHeader(response.headers as AxiosResponseHeaders);
      if (token) {
        setToken(token);
      }
      if(response.config.url === '/login' || response.config.url === '/register') {
        Message.success(message);
      }
      return data;
    }
    return Promise.reject(new Error(message || "请求失败"));
  },
  (error) => {
    // 响应错误处理
    // 对响应错误做点什么
    if (error.response) {
      Message.error(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

function getTokenFromHeader(headers:AxiosResponseHeaders) {
  return headers ? (headers['Authorization'] || headers['authorization']) : null
}

export default request;