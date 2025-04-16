import axios from "axios";
import qs from "query-string";

export interface Types {
    id?: number; // 主键，自增
    tagName: string;
}


export function list() {
    return axios.get<Types[]>('/admin/type/list', {
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
