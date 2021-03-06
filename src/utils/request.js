import axios from "axios";
import router from "@/router/index";
import { env } from "@/utils/index";
import { getToken } from '@/utils/auth';
import { ElMessage } from 'element-plus'

const isDev = env.MODE !== 'production'
// 业务成功码
const SUCCESS_CODE = 200

// 设置请求默认请求头
axios.defaults.headers.post["Content-Type"] = "application/json";
// 创建axios实例
const service = axios.create({
  baseURL: env.VITE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 携带 cookie
  timeout: 1000 * 15, // 请求超时时间15秒
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 发起请求之前做一些操作
    // 请求中携带token, headers['X-Token']是一个自定义请求头，需要根据实际业务情况进行替换
    const token = getToken();
    if (token) {
      config.headers["token"] = token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  /**
   * 通过自定义代码确定请求状态
   * 也可以通过HTTP状态码判断
   */
  (response) => {
    isDev && console.log('request ok', response)
    if (typeof response.data !== "object") {
      ElMessage.error("服务端异常！");
      return Promise.reject(response);
    }
    // 自定义业务码
    const code = response.data.resultCode
    // 自定义状态码不是指定的，认为请求异常
    if (code !== SUCCESS_CODE) {
      ElMessage.error(response.data.message || "Error")
      // 50008: 不合法的token; 50012: 其它地方登录; 50014: token过期;
      const tokenErrCodes = [401]
      if (tokenErrCodes.includes(code)) {
        // 重新登录
        router.push({ name: "Login" });
      }
      return Promise.reject(new Error(response.data.message || "Error"));
    } else {
      return response.data;
    }
  },
  (error) => {
    isDev && console.log('request other error', error)
    if (error.response) {
      // 请求已发出，服务器返回的 http 状态码不是 2xx，例如：400，500，对应上面的 1
      if (error.response.status === 401) {
        // 重新登录
        router.push({ name: "Login" });
      } else {
        const errMsg = getResponseErrorMsg(error);
        ElMessage.error(errMsg);
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应，例如：断网
      // 请求超时
      if (
        error.code === "ECONNABORTED" &&
        error.message.indexOf("timeout") !== -1
      ) {
        ElMessage.error("请求超时");
      }
      // 网络异常
      if (error.message === "Network Error") {
        ElMessage.error("网络异常");
      }
    } else {
      ElMessage.error("未知错误");
      // 请求被取消或者发送请求时异常
    }
    return Promise.reject(error);
  }
);

// 响应异常status映射
function getResponseErrorMsg(error) {
  const statusMap = new Map([
    [400, "错误请求"],
    [401, "未授权~，请重新登录"],
    [403, "当前操作没有权限"],
    [404, "访问资源不存在"],
    [408, "请求超时"],
    [500, "服务器异常,请稍后再试哦~"],
    [501, "此请求方法不被服务器支持"],
    [502, "网关错误"],
    [503, "服务不可用"],
    [504, "网关超时"],
    [505, "http版本不支持该请求"],
  ]);

  const errorMsg = statusMap.get(error.response.status) || `连接错误${error.response.status}`;
  return errorMsg;
}

export default service;
