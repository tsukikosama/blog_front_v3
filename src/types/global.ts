export interface AnyObject {
  [key: string]: unknown;
}

export interface Options {
  value: unknown;
  label: string;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface GetParams {
  body: null;
  type: string;
  url: string;
}

export interface PostData {
  body: string;
  type: string;
  url: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

export type TimeRanger = [string, string];

export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number[] }>;
}

/** 接口返回数据格式 */
export interface ApiRes<T> {
  code: number
  data: T
  msg: string
  success: boolean
  timestamp: string
}

/** 分页响应数据格式 */
export interface PageRes<T> {
  records: T
  total: number
  current:number
  size:number
}

/** 分页请求数据格式 */
export interface PageQuery {
  current: number
  pageSize: number
}