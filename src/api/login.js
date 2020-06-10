import request from '@/utils/request'

export function login(form) {
  return request({
    url: '/api/user/signIn',
    method: 'post',
    params: {
      username: form.username,
      password: form.password
    }
  })
}

export function signUp(form) {
  return request({
    url: '/api/user/signUp',
    method: 'post',
    params: {
      username: form.username,
      password: form.password
    }
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
