import axios from 'axios'
import {Toast} from 'antd-mobile'
let instance = axios.create()

function isAuthenticated () {
  return !!(localStorage.getItem('useAuth:expires_at') && new Date().getTime() < localStorage.getItem('useAuth:expires_at'));
}

instance.interceptors.request.use(request => {
  if(isAuthenticated()) {
    request.headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken')
    return request
  }else {
    localStorage.removeItem('accessToken')
    return request
  }
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response.status === 401) {
    Toast.info('需要登录哦')
  }
  return Promise.reject(error)
})

export default instance