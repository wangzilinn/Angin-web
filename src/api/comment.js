import request from '@/utils/request'

//第一个参数是查询的页数据, 第二个是具体的查询参数,格式为:
//{[条件1:value1],[条件2:value2]]
//当不传入第二个参数时 则为undefined
export function getCommentList(pageDate, query) {
  let added = ``
  if (query !== undefined) {
    query.forEach(function (item){
      added += `&${item.key}=${item.value}`;
    })
  }
  return request({
    url: `/api/comment/list?page=${query.page}&limit=${query.limit}${added}`,
    method: 'get',
  })
}

export function findAllComment() {
  return request({
    url: `/api/comment/findAll`,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: `/api/comment/${id}`,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: `/api/comment`,
    method: 'post',
    data
  })
}

export function getListForArticle(articleId, page) {
  return request({
    url: `/api/comment/listForArticle?articleId=${articleId}&page=${page}`,
    method: 'get'
  })
}

export function getListForAbout(page) {
  return request({
    url: `/api/comment/listForAbout?page=${page}`,
    method: 'get'
  })
}

export function getListForLink(page) {
  return request({
    url: `/api/comment/listForLink?page=${page}`,
    method: 'get'
  })
}
