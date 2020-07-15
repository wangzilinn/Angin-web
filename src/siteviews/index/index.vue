<template>
  <div class="index-page main-content">
    <div class="post-lists">
      <el-row type="flex" justify="center">
          <el-button :key="tag.name" v-for="tag in tagList" @click="handleClickTag(tag)" size="mini">{{tag.name}}</el-button>
        <el-button v-if="this.tag!==undefined" icon="el-icon-delete" size="mini" circle @click="handleDeleteTag"></el-button>
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
                <div class="item-meta-cat">{{refreshCategory}}</div>
                <!--<div class="item-meta-cat"><a href="https://www.linpx.com/c/tutorials/">{{refreshTag}}</a></div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lists-navigator clearfix">
      <ol class="page-navigator">
        <li v-if="current > 1" class="prev">
          <router-link :to="'/page/' + (current - 1)">←</router-link>
        </li>
        <li v-for="i in pages" :class="current === i ? 'current' : ''">
          <router-link :to="'/page/' + i">{{i}}</router-link>
        </li>
        <li v-if="current < pages" class="next">
          <router-link :to="'/page/' + (current + 1)">→</router-link>
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
        'category',
        'tag'
      ]),
      refreshCategory() {
        console.log("refreshCategory")
        console.log(this.category)
        this.current = 1
        this.fetchData(1)
        return this.category
      },
      //refreshTag() {
      //  console.log("refreshTag")
      //  this.fetchData()
      //  return this.tag
      //}
    },
    data() {
      return {
        articleList: [],
        tagList:[],
        current: 1,
        pages: 1,
        total: 1,
      }
    },
    created() {
      console.log(this.category)
      console.log(this.tag)
      console.log("fetchData")
      this.fetchData()
    },
    methods: {
      handleClickTag(item) {
        console.log(item)
        console.log("handleClickTag")
        this.$store.dispatch('content/setTag', item)
      },
      handleDeleteTag(item) {
        console.log("handleDeleteTag")
        console.log(item)
        this.$store.dispatch('content/setTag', undefined)
      },
      fetchData(page) {
        console.log("fetchData")
        this.articleList = []
        if (page === undefined) {
          page = this.$route.params.page
          if (page === undefined) {
            page = 1
          }
          this.current = page;
        }
        //进行分类查询
        let query = []
        if (this.category !== 'All') {
          query.push({key:"category", value:this.category})
        }
        console.log("1")
        if (this.tag !== undefined) {
          this.tagList = []
          query.push({key:"tag", value:this.tag.name})
          console.log("before push")
          console.log(this.tagList)
          console.log("before push")
          console.log(this.tag)
          console.log("before push")
          this.tagList.push(this.tag)
          console.log("after push")
          console.log(this.tagList)
        }else {
          console.log("3")
          getTagList(query).then(res=>{
            console.log("4")
            console.log(res.data)
            this.tagList = res.data
          })
        }
        console.log("5")
        console.log(query)
        getArticlePage({page: this.current, limit: 9}, query).then(res => {
          this.articleList = res.data.elements
          this.pages = res.data.totalPages
          this.total = res.data.totalNumber
        });
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

