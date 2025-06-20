import axios from "axios";
import qs from "query-string";
import {Blog, blogListRes, blogParams} from "@/api/blog/blog";

export interface Tag {
    id?: number | string; // 主键，自增
    tagName: string;
}

export interface typeParams {
    current: number;
    pageSize: number;
}

export function getTagList() {
    return axios.get<Tag[]>('/admin/tag/list', {
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
// export function queryType(params: typeParams) {
//     return axios.get<typeListRes>('/admin/type/page', {
//         params,
//         paramsSerializer: (obj) => {
//             return qs.stringify(obj);
//         },
//     });
// }

export function deleteTagById(ids : number[]){
    return axios.post('/admin/type/delete',ids)
}
