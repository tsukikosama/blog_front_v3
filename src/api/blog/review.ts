import axios from "axios";
import qs from "query-string";

export interface review {
    id: number;              // 主键
    content: string;         // 评论内容
    createTime: string;      // 评论时间（一般用 ISO 字符串，或 Date 类型）
    likes: number;           // 点赞数
    blogId: number;          // 博客ID
    replyId: number | null;  // 回复的是哪个评论的ID（主评论为 null 或 0）
    userId: number;          // 用户ID
    reviewType: number;      // 评论类型（可定义枚举）
    nickname:string;
    avatar:string;
    children?:review[],
}

export interface reviewParams {
    id:string;
    current: number;
    pageSize: number;
}

export interface reviewListRes {
    records: review[];
    total: number;
    size: number;
}
export function queryReview(params: reviewParams) {
    return axios.get<reviewListRes>('/admin/review/page', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}

export function deleteReviewById(id:number){
    return axios.post(`/admin/review/delete/${id}`)
}
