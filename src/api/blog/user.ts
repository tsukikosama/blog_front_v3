import axios from 'axios';
import { PolicyListRes, PolicyRecord } from '@/api/list';
import qs from 'query-string';

export interface userResponse {
  id: number; // 主键 ID
  username: string; // 登录账号
  avatar: string; // 用户头像
  createTime: string; // 创建时间 (日期格式，通常为字符串)
  userType: number; // 1 会员，0 普通人
  isValid: number; // 0 不合法，1 合法
  version: number; // 乐观锁
  email: string; // 邮箱
  about: string; // 个人签名
  nickname: string; // 用户昵称
  ban: string; // 1 正常，0 禁用
  updateTime: string; // 更新时间 (通常为 ISO 字符串)
}
export interface userListRes {
  records: userResponse[];
  total: number;
  size: number;
}

export interface userParams {
  nickname?: string;
  email?: string;
  ban?: string;
  userType?: string;
  current: number;
  pageSize: number;
}
export function queryUser(params: userParams) {
  return axios.get<userListRes>('/admin/user/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function resetPwd(ids:number[]){
  return axios.post('/admin/user/resetPwd',ids)
}

export function getUserInfoById(id : string){
  return axios.get<userResponse>('/admin/user/detail',{
        params: {
          id,
        },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function deleteUserById(ids : number[] ){
  return axios.post('/admin/user/deleteBatch',ids)
}

export function saveUser(user : userResponse){
  return axios.post('/admin/user/save',user);
}
