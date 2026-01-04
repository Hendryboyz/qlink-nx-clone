/* eslint-disable @typescript-eslint/no-explicit-any */
export * from './auth';
export * from './otp-v2';
export * from './user';
export * from './posts'
export * from './product'
export * from './moto'
export * from './bo/index'

export interface ErrorDto {
    bizCode: number;
    message?: string;
}
export interface ApiResponse<T = any> {
    bizCode: number;
    data: T;
    message?: string;
  }
