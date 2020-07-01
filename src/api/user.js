import request from '@/utils/request'

export function user(simpleLoginInfo) {
  return request({
    url: '/api/user/signIn',
    method: 'post',
    data:simpleLoginInfo
  })
}

export function signUp(simpleLoginInfo) {
  return request({
    url: '/api/user/signUp',
    method: 'post',
    simpleLoginInfo
  })
}

export function getInfo() {
  return request({
    url: '/api/user/info',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: '/api/user',
    method: 'put',
    data
  })
}

export function getGithubInfo(username) {
  return request({
    url:"/api/user/github/" + username,
    method: 'get'
  })
}
