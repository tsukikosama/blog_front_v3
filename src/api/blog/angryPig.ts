import axios from "axios";
import qs from "query-string";
import {Blog} from "@/api/blog/blog";

export interface angryPig {
    /** 主键 */
    id: number;

    /** 用户 */
    name: string;

    /** 原因 */
    cause: string;

    /** 时间 */
    createTime: string; // ISO 时间字符串，例如 "2025-05-13T10:00:00"

    /** 创建人 */
    createUser: number;

    /** 类型 */
    type: number;
}

export interface angryPigRes {
    records: angryPig[];
    total: number;
    size: number;
}

export interface angryPigParams {
    nickname?: string;
    email?: string;
    ban?: string;
    userType?: string;
    current: number;
    pageSize: number;
}

export interface saveAngryPig {
    id?:string,
    title:string,
    picture:string,
    content:string,
    tagId:number[],
}

export function queryAngryPig(params: angryPigParams) {
    return axios.get<angryPigRes>('/admin/angryPig/page', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}

export function saveAngryPig(param : saveAngryPig){
    return axios.post('/admin/blog/save',param)
}

export function updateAngryPig(param : saveAngryPig){
    return axios.post('/admin/blog/update',param)
}

export function getAngryPigById(id:string){
    return axios.get<Blog>(`/admin/blog/${id}`)
}
