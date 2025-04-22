import axios from "axios";
import qs from "query-string";
import {Blog, blogListRes, blogParams} from "@/api/blog/blog";

export interface Types {
    id?: number | string; // 主键，自增
    tagName: string;
}
export interface typeListRes {
    records: Types[];
    total: number;
    size: number;
}

export interface typeParams {
    current: number;
    pageSize: number;
}
export function getTypeList() {
    return axios.get<Types[]>('/admin/type/list', {
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
export function queryType(params: typeParams) {
    return axios.get<typeListRes>('/admin/type/page', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}

export function deleteTagById(ids : number[]){
    return axios.post('/admin/type/delete',ids)
}
