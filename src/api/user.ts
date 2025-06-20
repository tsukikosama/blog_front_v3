import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<string>('/sys/user/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/sys/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/sys/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/sys/user/menu');
}

