import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  ApiResponse,
  BoLoginDto,
  BoAuthResponse,
  BoUser,
  CreateBoUserDto,
  PostEntity, UserVO
} from '@org/types';
import { GetPostsResponse, GetUsersResponse, MutateUserResponse, UploadImageResponse } from '$/types';
class Api {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

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
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 如果是刷新 token 的請求失敗，直接返回錯誤
        if (originalRequest.url === '/auth/refresh') {
          this.processQueue(false, error);
          this.isRefreshing = false;
          this.clearToken();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        else if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await this.refreshToken(refreshToken);
            this.setToken(response.accessToken, response.refreshToken);
            originalRequest.headers[
              'Authorization'
            ] = `Bearer ${response.accessToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.clearToken();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // 如果是 401 錯誤且未進行過重試
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              const refreshToken = localStorage.getItem('refresh_token');
              if (!refreshToken) {
                throw new Error('No refresh token available');
              }

              const response = await this.refreshToken(refreshToken);
              this.setToken(response.accessToken, response.refreshToken);

              this.processQueue(true);
              this.isRefreshing = false;

              originalRequest.headers[
                'Authorization'
              ] = `Bearer ${response.accessToken}`;
              return this.instance(originalRequest);
            } catch (refreshError) {
              this.processQueue(false, refreshError);
              this.isRefreshing = false;
              this.clearToken();
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }

          // 如果已經在刷新，將請求加入隊列
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(shouldProceed = true, error: any = null) {
    this.failedQueue.forEach((prom) => {
      if (shouldProceed) {
        prom.resolve();
      } else {
        prom.reject(error);
      }
    });
    this.failedQueue = [];
  }

  setToken(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async login(loginDto: BoLoginDto): Promise<BoAuthResponse> {
    const response = await this.post<BoAuthResponse>('/auth/login', loginDto);
    this.setToken(response.accessToken, response.refreshToken);
    return response;
  }

  async refreshToken(refreshToken: string): Promise<BoAuthResponse> {
    const response = await this.post<BoAuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response;
  }

  async get<T = ApiResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  async post<T = ApiResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(
      url,
      data,
      config
    );
    return response.data;
  }

  async put<T = ApiResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(
      url,
      data,
      config
    );
    return response.data;
  }

  async patch<T = ApiResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(
      url,
      data,
      config
    );
    return response.data;
  }

  async delete<T = ApiResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }

  async getPosts(page = 1, limit = 10): Promise<GetPostsResponse> {
    return this.get(`/posts?page=${page}&limit=${limit}`);
  }

  async createPost(postData: Partial<PostEntity>) {
    return this.post('/posts', postData);
  }

  async updatePost(id: string, postData: Partial<PostEntity>) {
    return this.patch(`/posts/${id}`, postData);
  }

  async deletePost(id: string): Promise<void> {
    await this.delete(`/posts/${id}`);
  }

  async uploadImage(file: File | Blob): Promise<ApiResponse<UploadImageResponse>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.post('/posts/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  logout() {
    this.clearToken();
    window.location.href = '/login';
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await this.get('/auth/check');
      return true;
    } catch (error) {
      return false;
    }
  }

  async createUser(userData: CreateBoUserDto): Promise<BoUser> {
    return this.post<BoUser>('/auth/create-user', userData);
  }

  async getClientUsers(page = 1, limit = 10): Promise<GetUsersResponse> {
    return this.get(`/users/clients?page=${page}&limit=${limit}`);
  }

  async deleteClientUser(id: string): Promise<MutateUserResponse> {
    return this.delete(`/users/client/${id}`);
  }

  async listBoUsers(page = 1, limit = 10): Promise<GetUsersResponse> {
    return this.get(`/users?page=${page}&limit=${limit}`);
  }

  async deleteBoUser(userId: string): Promise<MutateUserResponse> {
    return this.delete(`/users/${userId}`);
  }
}

const publicApiURL: string = import.meta.env.VITE_BO_PUBLIC_API_URL || '';

const API = new Api(`${publicApiURL}/api/bo`);
// const API = new Api('/api/bo');
export default API;
