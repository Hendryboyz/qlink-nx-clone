export enum BoRole {
  ADMIN = 'admin',
  VIEWER = 'viewer',
}

export interface BoUserEntity {
  id: string;
  username: string;
  password: string;
  role: BoRole;
  createdAt: Date;
  updatedAt: Date;
}

export type BoUser = Omit<BoUserEntity, 'createdAt' | 'updatedAt'>;

export type BOUserDTO = Omit<BoUserEntity, 'password' | 'updatedAt'>

export type ListBoUserDTO = {
  data: BOUserDTO[];
  total: number;
}

export interface BoLoginDto {
  username: string;
  password: string;
}

export interface BoAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<BoUser, 'password'>;
}

export interface CreateBoUserDto {
  username: string;
  password: string;
  role: BoRole;
}
