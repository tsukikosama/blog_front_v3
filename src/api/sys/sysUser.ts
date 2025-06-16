import axios from "axios";
import qs from "query-string";
import {Pagination} from "@/types/global";

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
export interface UserQueryParams extends Pagination{
    nickname: string;
}

export interface UserPage extends Pagination{

}


export function pageSysPage(req:UserQueryParams){
    return axios.get<User[]>('/sys/user/page',{
        params: req
    })
}
