<template>
  <div class="index-page main-content">
    <div class="post-lists">
      <el-row type="flex" justify="center">
        <div v-if="this.currentTag === undefined">
          <el-button :key="tag.name" v-for="tag in tagList" @click="handleClickTag(tag)" size="mini">{{tag.name}}
          </el-button>
        </div>
        <div v-else>
          <el-button size="mini">{{currentTag.name}}</el-button>
          <el-button icon="el-icon-delete" size="mini" circle
                     @click="handleDeleteTag"></el-button>
        </div>
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
                <!--<div class="item-meta-cat">{{//refreshCategory}}</div>-->
                <div class="item-meta-cat"><a href="">{{item.categoryName}}</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lists-navigator clearfix">
      <ol class="page-navigator">
        <!--<li v-if="currentPage > 1" class="prev">-->
        <!--  <el-button class="page" @click="handleClickPage(currentPage -1 )">←</el-button>-->
        <!--</li>-->
        <!--<li v-for="i in pages" :class="currentPage === i ? 'current' : ''">-->
        <!--  <el-button class="page" @click="handleClickPage(i)">{{i}}</el-button>-->
        <!--</li>-->
        <!--<li v-if="currentPage < pages" class="next">-->
        <!--  <el-button class="page" @click="handleClickPage(currentPage + 1 )">→</el-button>-->
        <!--</li>-->
          <el-pagination
            :current-page="currentPage"
            :total="total"
            @pre-click="(page) => handleClickPage(page - 1 )"
            @next-click="(page) => handleClickPage(page + 1 )"
            @current-change="(page) => handleClickPage(page)"
            prev-text="←"
            next-text="→"
            layout="prev, pager, next">
          </el-pagination>
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
      //...是把属性混入当前对象
      ...mapGetters([
        'imgApi',
        'category',
        'query'
      ]),
    },
    watch: {
      category: function (val, oldVal) {
        //类型页改变,重新配置tag等信息
        console.log("watch category")
        console.log(`new ${val}`)
        console.log(`old ${oldVal}`)
        if (val === undefined) {
          return
        }
        this.resetPageAndQuery()
        this.fetchData()
      },
      query: function (val, oldVal) {
        //layout进行了标题模糊查询
        console.log("watch query")
        console.log(`new ${val}`)
        if (val === undefined) {
          return
        }
        //重置本页信息
        this.resetPageAndQuery();
        this.tagList = []
        this.currentTitle = val
        this.fetchData()
      }
    },
    data() {
      return {
        articleList: [],
        tagList: [],
        currentTag: undefined,
        //模糊搜索标题用
        currentTitle: undefined,
        currentPage: 1,
        pages: 1,
        total: 1,
      }
    },
    created() {
      console.log("created")
      this.fetchData()
    },
    methods: {
      resetPageAndQuery() {
        this.currentPage = 1
        this.pages = 1
        this.total = 1
        this.currentTag = undefined
        this.currentTitle = undefined
      },
      handleClickPage(pageNum) {
        this.currentPage = pageNum
        this.fetchData()
      },
      handleClickTag(item) {
        console.log("handleClickTag")
        console.log(item)
        this.resetPageAndQuery()
        this.currentTag = item
        this.fetchData()
      },
      handleDeleteTag(item) {
        console.log("handleDeleteTag")
        console.log(item)
        this.resetPageAndQuery()
        this.fetchData()
      },
      fetchData() {
        console.log("fetchData")
        console.log(this.refreshCategory)

        let query = []
        //如果当前是模糊标题查询,则直接查询,不管分类和tag
        if (this.currentTitle !== undefined) {
          query.push({key: "title", value: this.currentTitle})
        } else {
          //进行分类查询
          if (this.category !== 'All') {
            query.push({key: "category", value: this.category});
          }
          //当选定了特定标签时:
          if (this.currentTag !== undefined) {
            query.push({key: "tag", value: this.currentTag.name})
          } else {
            //当未选定标签时
            getTagList(query).then(res => {
              console.log("getTagList")
              console.log(res.data)
              this.tagList = res.data
            })
          }
        }
        this.articleList = []
        getArticlePage({page: this.currentPage, limit: 9}, query).then(res => {
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

  .page {
    border:0
  }

  .el-tag {
    background-color: white;
    color: #956038;
    border-color: #956038;
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 5px;
  }

  .el-button {
    margin-right: 5px;
    margin-left: 5px;
  }
</style>

