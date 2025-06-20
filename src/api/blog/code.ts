import axios from "axios";
import qs from "query-string";
import { typeParams, Types} from "@/api/blog/tag";
import {saveBlog} from "@/api/blog/blog";

export interface Code {
    id?: number | string; // 主键，自增
    tagName: string;

}

export interface CodeListRes {
    records: Code[];
    total: number;
    size: number;
}

export interface saveCode {
    id?:string,
    code:string,
    value:string
}
export function queryCodeList() {
    return axios.get<CodeListRes>('/admin/code/list', {
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}

export function updateCode(param : saveCode){
    return axios.post('/admin/code/save',param)
}

export function saveCode(param : saveCode){
    return axios.post('/admin/code/update',param)
}
