import axios from "axios";
import qs from "query-string";

export interface Blog {
    id?: number; // 主键，自增
    title?: string; // 标题
    picture?: string; // 图片链接
    content?: string; // 内容
    isValid?: number; // 是否有效
    tagId?: string; // 标签 id，多个用逗号分隔
    simpleTitle?: string; // 简要标题
    userId?: number; // 用户 ID
    state?: number; // 状态
}
export interface userListRes {
    records: Blog[];
    total: number;
    size: number;
}
export interface blogParams {
    nickname?: string;
    email?: string;
    ban?: string;
    userType?: string;
    current: number;
    pageSize: number;
}

export function queryBlog(params: blogParams) {
    return axios.get<userListRes>('/admin/blog/list', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
