import axios from "axios";
import qs from "query-string";
import {PageQuery, PageRes, Pagination} from "@/types/global";

export interface SysUser {
    id: string;
    username: string;
    nickname: string;
    password: string;
    email: string;
    phone: string;
    avatar: string;
    description: string;
    status: string;
}
export interface UserQueryParams extends PageQuery{
    nickname?: string;
}


export function pageSysPage(req:UserQueryParams){
    return axios.get<PageRes<SysUser[]>>('/sys/user/page',{
        params: req
    })
}

export function saveSysUser(req:UserQueryParams){
    return axios.post<SysUser>('/sys/user/save', req
    )
}

export function updateSysUser(req:UserQueryParams){
    return axios.put<SysUser>('/sys/user/save', req
    )
}