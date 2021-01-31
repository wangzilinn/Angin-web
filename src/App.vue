<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  metaInfo: {
    // 如果子component中没有定义 metaInfo.title ，会默认使用这个title
    title: 'Angin',
    meta: [
      { name: 'description', content: '这是一个记录自己学习笔记的地方, 欢迎踩一踩' },
      { name: 'keywords', content: '王子林,wangzilin,Angin,java,后端' }
    ]
  },
  name: 'App'
}
</script>
