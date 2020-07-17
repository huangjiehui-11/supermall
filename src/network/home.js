//default导出才可以不用大括号
import {request} from './request';

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}
