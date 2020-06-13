import request from '@/utils/request'

export function getList(data, query) {
  return request({
    url: `/api/article/tag?page=${query.page}&limit=${query.limit}`,
    method: 'post',
    data
  })
}

export function getAllTags() {
  return request({
    url: `/api/article/tag/list`,
    method: 'get'
  })
}

export function findById(id) {
  return request({
    url: `/api/article/tag/${id}`,
    method: 'get'
  })
}

export function updateTag(data) {
  return request({
    url: `/api/article/tag`,
    method: 'put',
    data
  })
}

export function addTag(data) {
  return request({
    url: `/api/tag`,
    method: 'post',
    data
  })
}

export function deleteTag(id) {
  return request({
    url: `/api/tag/${id}`,
    method: 'delete'
  })
}
