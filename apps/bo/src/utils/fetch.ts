import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  ApiResponse,
  BoLoginDto,
  BoAuthResponse,
  BoUser,
  CreateBoUserDto,
  PostEntity,
  ResetBoUserPasswordDto,
  ClientUserUpdateDto,
  VerifyResult,
  UpdateVehicleDTO,
  CreateBannerDto,
} from '@org/types';
import {
  GetPostsResponse,
  GetUsersFilters,
  GetUsersResponse,
  MutateUserResponse,
  UploadImageResponse
} from '$/types';
import { GetVehiclesFilters, GetVehiclesResponse } from '$/types/vehicles';
import { BO_ACCESS_TOKEN } from '@org/common';
import Cookies from 'js-cookie';


class Api {
  private readonly instance: AxiosInstance;
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
        // const token = localStorage.getItem('access_token');
        const token = Cookies.get(BO_ACCESS_TOKEN);
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
      (error) => {
        return Promise.reject(error);
      },
      // async (error) => {
      //   const originalRequest = error.config;
      //
      //   // 如果是刷新 token 的請求失敗，直接返回錯誤
      //   const routerBasename: string = import.meta.env.VITE_BO_ROUTER_BASENAME || '';
      //   const signInRoute = `${routerBasename}/login`;
      //   const isRefreshingFailed = originalRequest.url === '/auth/refresh'
      //   if (isRefreshingFailed) {
      //     this.processQueue(false, error);
      //     this.isRefreshing = false;
      //     this.clearToken();
      //     window.location.href = signInRoute;
      //     return Promise.reject(error);
      //   }
      //
      //   if (error.response.status === 401 && !originalRequest._retry) {
      //     originalRequest._retry = true;
      //     try {
      //       // const token = localStorage.getItem('access_token');
      //       const refreshToken = Cookies.get(BO_REFRESH_TOKEN);
      //       const response = await this.refreshToken(refreshToken);
      //       // this.setToken(response.accessToken, response.refreshToken);
      //       originalRequest.headers[
      //         'Authorization'
      //       ] = `Bearer ${response.accessToken}`;
      //       return this.instance(originalRequest);
      //     } catch (refreshError) {
      //       this.clearToken();
      //       window.location.href = signInRoute;
      //       return Promise.reject(refreshError);
      //     }
      //   }
      //
      //   // 如果是 401 錯誤且未進行過重試
      //   if (error.response?.status === 401 && !originalRequest._retry) {
      //     originalRequest._retry = true;
      //
      //     if (!this.isRefreshing) {
      //       this.isRefreshing = true;
      //
      //       try {
      //         const refreshToken = Cookies.get(BO_REFRESH_TOKEN);
      //         if (!refreshToken) {
      //           throw new Error('No refresh token available');
      //         }
      //
      //         const response = await this.refreshToken(refreshToken);
      //         // this.setToken(response.accessToken, response.refreshToken);
      //
      //         this.processQueue(true);
      //         this.isRefreshing = false;
      //
      //         originalRequest.headers[
      //           'Authorization'
      //         ] = `Bearer ${response.accessToken}`;
      //         return this.instance(originalRequest);
      //       } catch (refreshError) {
      //         this.processQueue(false, refreshError);
      //         this.isRefreshing = false;
      //         this.clearToken();
      //         window.location.href = signInRoute;
      //         return Promise.reject(refreshError);
      //       }
      //     }
      //
      //     // 如果已經在刷新，將請求加入隊列
      //     return new Promise((resolve, reject) => {
      //       this.failedQueue.push({ resolve, reject });
      //     });
      //   }
      //
      //   return Promise.reject(error);
      // }
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
    localStorage.setItem(BO_ACCESS_TOKEN, accessToken);
  }

  clearToken() {
    Cookies.remove(BO_ACCESS_TOKEN);
    // localStorage.removeItem(BO_ACCESS_TOKEN);
    // localStorage.removeItem(BO_REFRESH_TOKEN);
  }

  async login(loginDto: BoLoginDto): Promise<BoAuthResponse> {
    return this.post<BoAuthResponse>('/auth/login', loginDto);
    // this.setToken(response.accessToken, response.refreshToken);
  }

  async refreshToken(refreshToken: string): Promise<BoAuthResponse> {
    return await this.post<BoAuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
  }

  async check(): Promise<{authenticated: boolean}> {
    return this.get<{authenticated: boolean}>('/auth/check');
    // this.setToken(response.accessToken, response.refreshToken);
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

  async uploadPostImage(file: File | Blob): Promise<ApiResponse<UploadImageResponse>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.post('/posts/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async createBanner(postData: CreateBannerDto) {
    return this.post('/banners', postData);
  }

  async uploadBannerImage(file: File | Blob): Promise<ApiResponse<UploadImageResponse>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.post('/banners/upload/image', formData, {
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

  async getClientUsers(page = 1, limit = 10, filters: GetUsersFilters = {}): Promise<GetUsersResponse> {
    let queries = [];
    if (filters) {
      queries = Object.entries(filters).map(([key, value]) => {
        if (value === undefined || value === null) return undefined;
        return `${key}=${value}`
      });
    }
    let resourceUrl = `/users/clients?page=${page}&limit=${limit}`;
    if (queries.length > 0) {
      resourceUrl += ("&" + queries.join("&"));
    }

    return this.get(resourceUrl);
  }

  async deleteClientUser(id: string): Promise<MutateUserResponse> {
    return this.delete(`/users/clients/${id}`);
  }

  async verifyClientUser(id: string) {
    return this.post(`/users/clients/${id}/sync`);
  }

  async patchClientUser(memberId: string, payload: ClientUserUpdateDto): Promise<MutateUserResponse> {
    return this.patch(`/users/clients/${memberId}`, payload);
  }

  async createUser(userData: CreateBoUserDto): Promise<BoUser> {
    return this.post<BoUser>('/users', userData);
  }

  async listBoUsers(page = 1, limit = 10): Promise<GetUsersResponse> {
    return this.get(`/users?page=${page}&limit=${limit}`);
  }

  async deleteBoUser(userId: string): Promise<MutateUserResponse> {
    return this.delete(`/users/${userId}`);
  }

  async resetBoUserPassword(userId: string, payload: ResetBoUserPasswordDto) {
    return this.put<number>(`/users/${userId}/password/reset`, payload);
  }

  async listVehicles(
    page: number = 1,
    limit: number = 10,
    filters: GetVehiclesFilters = {},
  ): Promise<GetVehiclesResponse> {
    let queries = [];
    if (filters) {
      queries = Object.entries(filters).map(([key, value]) => {
        if (value === undefined || value === null) return undefined;
        return `${key}=${value}`
      });
    }
    let resourceUrl = `/vehicles?page=${page}&limit=${limit}`;
    if (queries.length > 0) {
      resourceUrl += ("&" + queries.join("&"));
    }

    return this.get(resourceUrl);
  }

  async patchVehicle(vehicleId: string, payload: UpdateVehicleDTO) {
    return this.put(`/vehicles/${vehicleId}`, payload);
  }

  async deleteVehicle(vehicleId: string) {
    return this.delete(`/vehicles/${vehicleId}`);
  }

  async verifyAllVehicles(): Promise<VerifyResult[]> {
    return this.post(`/vehicles/verification`);
  }

  async countTotalMember(from?: Date): Promise<number> {
    let resourceUrl = '/statistic/users/count';
    if (from) {
      resourceUrl += `?from=${from.toISOString()}`
    }
    return this.get(resourceUrl);
  }

  async countFailVerificationVehicles(): Promise<number> {
    const resourceUrl = '/statistic/vehicles/count/verified_failed';
    return this.get(resourceUrl);
  }

  async countVehiclesByField(field: string): Promise<{
    model: string;
    count: number;
  }[]> {
    const resourceUrl = `/statistic/vehicles/count?groupBy=${field}`;
    return this.get(resourceUrl);
  }
}

const publicApiURL: string = import.meta.env.VITE_BO_PUBLIC_API_URL || '';

const API = new Api(`${publicApiURL}/api/bo`);
// const API = new Api('/api/bo');
export default API;
