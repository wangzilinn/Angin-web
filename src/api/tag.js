import request from '@/utils/request'

export function getTagList(query) {
  let added = ``
  if (query !== undefined) {
    query.forEach(function (item){
      added += `&${item.key}=${item.value}`;
    })
  }
  return request({
    url: `/api/article/tag/list?${added}`,
    method: 'get',
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
