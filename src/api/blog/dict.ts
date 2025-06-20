import axios from "axios";
import qs from "query-string";
import { typeParams, Types} from "@/api/blog/tag";

export interface Dict {
    id?: number | string; // 主键，自增
    tagName: string;
    children:Dict[]
}

export interface typeListRes {
    records: Dict[];
    total: number;
    size: number;
}

export function queryDict(params: typeParams) {
    return axios.get<typeListRes>('/admin/dict/page', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
