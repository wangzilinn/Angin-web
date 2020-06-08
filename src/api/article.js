import request from '@/utils/request'

//第一个参数是查询的页数据, 第二个是具体的查询参数,格式为:
//[[条件1:value1],[条件2:value2]]
//当不传入第二个参数时 则为undefined
export function getArticleList(pageDate, query) {
  let added = ``
  if (query !== undefined) {
    query.forEach(function (item){
      added += `&${item.key}=${item.value}`;
    })
  }
  return request({
    url: `/api/article/list?page=${pageDate.page}&limit=${pageDate.limit}${added}`,
    method: 'get',
  })
}


export function findArchives() {
  return request({
    url: `/api/article/archives`,
    method: 'get'
  })
}

//首页点击文章标题后跳转使用这个函数
export function findById(id) {
  return request({
    url: `/api/article?id=${id}`,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: `/api/article`,
    method: 'put',
    data
  })
}

export function add(data) {
  return request({
    url: `/api/article`,
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: `/api/article/${id}`,
    method: 'delete'
  })
}
