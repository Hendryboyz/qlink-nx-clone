import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { ACCESS_TOKEN } from '@org/common';
import { ApiResponse, ErrorDto } from '@org/types';
import Cookies from 'js-cookie';

class Api {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 5000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        const token = Cookies.get(ACCESS_TOKEN);
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 添加響應攔截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error: AxiosError<ErrorDto>) => {
        throw error.response?.data;
      }
    );
  }

  // 設置 token
  setToken(token: string) {
    Cookies.set(ACCESS_TOKEN, token, { secure: true, sameSite: 'strict' });
  }

  // 清除 token
  clearToken() {
    Cookies.remove(ACCESS_TOKEN);
  }

  // GET 請求
  async get<T = ApiResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  // POST 請求
  async post<T = ApiResponse>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(
      url,
      data,
      config
    );
    return response.data;
  }

  // PUT 請求
  async put<T = ApiResponse>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(
      url,
      data,
      config
    );
    return response.data;
  }

  // DELETE 請求
  async delete<T = ApiResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }
}

// 創建並導出 API 實例
const API = new Api(
  process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'
);
export default API;
