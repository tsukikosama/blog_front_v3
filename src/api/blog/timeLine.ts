import axios from "axios";
import qs from "query-string";
import {Types} from "@/api/blog/type";
import {Blog, blogListRes, blogParams} from "@/api/blog/blog";

export interface TimeLine {
    id: number;                // id
    moduleName: string;        // 模块名字
    moduleType: number;        // 0 表示未开发，1 表示已开发完成
    createTime: string;        // 创建时间（一般使用字符串格式 ISO8601）
    updateTime: string;        // 更新时间
}

export interface timeLineListRes {
    records: TimeLine[];
    total: number;
    size: number;
}
export interface timeLineParams {
    nickname?: string;
    email?: string;
    ban?: string;
    userType?: string;
    current: number;
    pageSize: number;
}

export function queryTimeLine(params: timeLineParams) {
    return axios.get<timeLineListRes>('/admin/timeLine/page', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}

export function deleteModules(ids : number[]){
    return axios.post('/admin/timeline/delete',ids)
}
