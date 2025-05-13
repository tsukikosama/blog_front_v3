import axios from "axios";
import qs from "query-string";
import {userResponse} from "@/api/blog/user";

export interface friendLink {
    /** 主键 */
    id: number;

    /** 网站链接 */
    webUrl: string;

    /** 网站名字 */
    webName: string;

    /** 网站描述 */
    webDescript: string;

    /** 添加时间（注意：可能需要格式化为字符串 'YYYY-MM-DD'） */
    webTime: string; // 或 Date，根据你的数据格式决定

    /** 网站图片 */
    webImg: string;

    /** 0 为未审核通过，1 为审核通过 */
    webAccess: number;

    /** 用户邮箱 */
    webEmail: string;
}

export interface friendLinkRes {
    records: friendLink[];
    total: number;
    size: number;
}

export interface friendLinkParams {
    nickname?: string;
    email?: string;
    ban?: string;
    userType?: string;
    current: number;
    pageSize: number;
}

export function queryFriendLink(params: friendLinkParams) {
    return axios.get<friendLinkRes>('/admin/friendLink/page', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}

export function saveFriendLink(params: friendLink) {
    return axios.post('/admin/friendLink/save',params);
}
export function updateFriendLink(params: friendLink) {
    return axios.post('/admin/friendLink/update',params);
}

export function getFriendLinkById(id : string){
    return axios.get<userResponse>('/admin/friendLink/detail',{
        params: {
            id,
        },
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
