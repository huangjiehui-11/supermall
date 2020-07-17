import axios from 'axios'

export function request(config) {
  // 1.创建axios实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/n3',
    timeout: 5000
  })

  // 2.axios的拦截器

  // 2.1请求拦截
  instance.interceptors.request.use(
    config => {
      // console.log(config);
      // 1.比如config中的一些信息不符合服务器的要求，需要进行修改

      // 2.比如每次发送网络请求时，都希望在界面中显示一个请求的图标

      //3.某些网络请求(比如登陆(需要携带token))，必须携带一些特殊的信息
      return config;
      //必须return还回去，不然用到这个请求的其他地方无法发送真正的网络请求，被拦截下来了，无法到达服务器
    },
    err => {
      // console.log(err);
    }
  )

  // 2.2响应拦截
  instance.interceptors.response.use(
    res => {
      //必须把响应后的结果还回去，不然用到这个请求的地方所展示的结果是undefined，被拦截了
      return res.data
    },
    err => {
      console.log(err);
    }
  )

  // 3.发送真正的网络请求
  return instance(config)
}
