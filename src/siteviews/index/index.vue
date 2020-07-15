<template>
  <div class="index-page main-content">
    <div class="post-lists">
      <el-row type="flex" justify="center">
        <!--<div>Current category:{{refresh}}</div>-->
        <el-tag :key="tag.name" v-for="tag in tagList" size="medium">{{tag.name}}</el-tag>
        <!--<el-tag size="medium">教程</el-tag>-->
        <!--<el-tag size="medium">MISC</el-tag>-->
      </el-row>
      <div class="post-lists-body">
        <div class="post-list-item" v-if="articleList == null || articleList.length === 0">
          <p>别急，服务器正在努力传输</p>
        </div>
        <div class="post-list-item" v-else v-for="item in articleList">
          <div class="post-list-item-container">
            <div class="item-thumb bg-deepgrey" :style="'background-image:url(' + getCoverUrl(item.cover) + ');'"></div>
            <router-link :to="'/article/' + item.id">
              <div class="item-desc">
                <p :text="item.content"></p>
              </div>
            </router-link>
            <div class="item-slant reverse-slant bg-deepgrey"></div>
            <div class="item-slant"></div>
            <div class="item-label">
              <div class="item-title">
                <router-link :to="'/article/' + item.id" v-text="item.title"></router-link>
              </div>
              <div class="item-meta clearfix">
                <div class="item-meta-ico bg-ico-code"
                     style="background: url(/bg-ico.png) no-repeat;background-size: 40px auto;"></div>
                <div class="item-meta-cat"><a href="https://www.linpx.com/c/tutorials/">{{refresh}}</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lists-navigator clearfix">
      <ol class="page-navigator">
        <li v-if="current > 1" class="prev">
          <a :href="'/page/' + (current - 1)">←</a>
        </li>
        <li v-for="i in pages" :class="current === i ? 'current' : ''">
          <a :href="'/page/' + i">{{i}}</a>
        </li>
        <li v-if="current < pages" class="next">
          <a :href="'/page/' + (current + 1)">→</a>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
  import {getArticlePage} from '@/api/article'
  import {getTagList} from "@/api/tag";
  import {mapGetters} from "vuex";

  export default {
    name: "index",
    computed: {
      //...是把imgApi混入当前对象
      ...mapGetters([
        'imgApi',
        'category'
      ]),
      refresh() {
        console.log("re fetchData")
        this.fetchData()
        return this.category
      }
    },
    data() {
      return {
        articleList: null,
        tagList:null,
        current: 0,
        pages: 0,
        total: 0
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData(tag) {
        this.articleList = []
        let page = this.$route.params.page
        if (page !== undefined) {
          this.current = page
        }
        if (page === undefined) {
          page = 1
        }
        //进行分类查询
        let query = []
        if (this.category !== 'All') {
          query.push({key:"category", value:this.category})
        }
        getArticlePage({page: page, limit: 9}, query).then(res => {
          this.articleList = res.data.elements
          this.current = res.data.currentPage
          this.pages = res.data.totalPages
          this.total = res.data.totalNumber
        });
        getTagList(query).then(res=>{
          this.tagList = res.data
        })
      },
      getCoverUrl(imgId) {
        if (imgId === '' || imgId === undefined) {
          return this.imgApi + "?sign=" + Math.random()  //获取随机图片
        }
        return this.imgApi + "/" + imgId;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/styles/style.min.css";

  .el-row {
    border-radius: 4px;
  }

  .inline-input {
    width: 70px;
    vertical-align: bottom;
    margin-top: 10px;
  }

  .el-tag {
    background-color: white;
    color: #956038;
    border-color: #956038;
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 5px;
  }
</style>

