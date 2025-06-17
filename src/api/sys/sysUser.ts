import axios from "axios";
import qs from "query-string";
import {PageQuery, PageRes, Pagination} from "@/types/global";

export interface User {
    id: number;
    username: string;
    nickname: string;
    email: string;
    phone: string;
    avatar: string;
    description: string;
    deptId: string;
}
export interface UserQueryParams extends PageQuery{
    nickname: string;
}




export function pageSysPage(req:UserQueryParams){
    return axios.get<PageRes<User[]>>('/sys/user/page',{
        params: req
    })
}
