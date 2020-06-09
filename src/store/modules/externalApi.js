const baseUrl = process.env.VUE_APP_BASE_API
const externalApi = {
  state: {
    // 上传图片服务
    imgApi: baseUrl + 'api/img',
    // swagger
    swaggerApi: baseUrl + 'api/human'
  }
}

export default externalApi
