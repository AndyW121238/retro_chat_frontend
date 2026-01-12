import type { ApiResponse } from "@/types/api";
import { ApiError } from "@/types/error";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import router from "@/router/router";
import { useUserStore } from "@/store/userStore";

// 扩展 AxiosInstance 接口，重写方法的返回类型
// 因为响应拦截器会提取 res.data，所以返回类型是 Promise<T> 而不是 Promise<AxiosResponse<T>>
interface CustomAxiosInstance
  extends Omit<
    AxiosInstance,
    "get" | "post" | "put" | "delete" | "patch" | "request"
  > {
  // GET 请求：返回 Promise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

  // POST 请求：T 是响应数据类型，D 是请求体数据类型
  post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>;

  // PUT 请求
  put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>;

  // DELETE 请求
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

  // PATCH 请求
  patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>;

  // 保留其他 AxiosInstance 的方法
  request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T>;
}

const requestInstance: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

const userStore = useUserStore();

// 请求拦截器
requestInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
requestInstance.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse<any>;
    if (res.code === 0) {
      return res.data;
    } else if (res.code === 40300) {
      router.push("/");
      userStore.clearUserInfo();
      localStorage.removeItem("token");
    } else {
      throw new ApiError(res.code, res.message, res.data);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 类型断言为自定义接口
const request = requestInstance as CustomAxiosInstance;

export default request;
