import axios from "axios";

const BASE_URL = '/sys/dict'

export interface LabelValueState {
    label: string
    value: any
    extra?: string
}

/** @desc 查询字典列表 */
export function listCommonDict(code: string) {
    return axios.get<LabelValueState[]>(`${BASE_URL}/${code}`)
}
