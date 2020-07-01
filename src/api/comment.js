import request from '@/utils/request'


export function addComment(data) {
  return request({
    url: `/api/comment`,
    method: 'post',
    data
  })
}

export function deleteComment(id) {
  return request({
    url: `/api/comment/${id}`,
    method: 'delete'
  })
}


//这个函数是查询评论时用的
//第一个参数是查询的页数据, 第二个是具体的查询参数,格式为:
//[{key:关键字1,value:限制1},{key:关键字2,value:限制2}]
//如:[{key:"id", value : this.$route.params.id}]
//当不传入第二个参数时 则为undefined
export function getCommentList(pageData, query) {
  let added = ``
  if (query !== undefined) {
    query.forEach(function (item){
      added += `&${item.key}=${item.value}`;
    })
  }
  return request({
    url: `/api/comment/list?page=${pageData.page}&limit=${pageData.limit}${added}`,
    method: 'get',
  })
}
//export function getContributionData() {
//  return request({
//    url:
//  })
//}

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


export function findAllComment() {
  return request({
    url: `/api/comment/findAll`,
    method: 'get'
  })
}




