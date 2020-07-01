<template>
  <div>
    <article class="main-content page-page">
      <div class="post-header"><h1 class="post-title" itemprop="name headline"> About </h1>
        <div class="post-data">
          <time datetime="2020-05-14 23:08" itemprop="datePublished">Published on 5 28, 2020</time>
        </div>
      </div>
      <div id="post-content" class="post-content">
        <h3>Hello</h3>
        <p>我是王子林, 四川大学计算机学院研究生</p>
        <p>喜欢古典音乐,喜欢猫咪,<strong>超级喜欢自己的女朋友,我们在一起已经{{togetherDays}}天啦!</strong></p>
        <p>本科阶段一直在嵌入式的坑里面挣扎, 忙于各种比赛, 研究生阶段转向了向上层应用, 发现又是一个大坑</p>
        <p>目前我的研究方向是NILM, 期望能发好的论文出来</p>
        <p>还在涉猎一个小方向, 嵌入式神经网络, 感觉可以做出很有意思的应用</p>
        <h3>关于Blog</h3>
        <p>这个Blog是从<a href="https://github.com/TyCoding/tumo" target="_blank">Tumo</a>获得的灵感, 从头开始学Vue, 一点一点搭建而成的</p>
        <p>前端是Vue, 后端是Spring全家桶</p>
        <p>由于将来很有可能从事后端工作, 本着学习的目的, 后端的框架用的会多一些,包括但不限于</p>
        <ul>
          <li>spring boot</li>
          <li>spring security</li>
          <li>spring cloud</li>
          <li>mybatis plus</li>
          <li>Feign</li>
          <li>MySQL</li>
          <li>MongoDB</li>
          <li>jsr303校验</li>
        </ul>
        <h3>联系</h3>
        <p>以下是我的github, 虽然技术很菜, 但是也做了一些我觉得很有意思的东西</p>
        <ul>
          <li><p><a href="https://github.com/wangzilinn" target="_blank">Github</a></p></li>
        </ul>
      </div>
    </article>
    <div id="respond-post-334" class="comment-container">
      <div id="comments" class="clearfix">
        <span class="response">Responses</span>
        <form id="comment-form" class="comment-form" role="form">
          <input v-model="form.sort = 2" style="display: none;">
          <input type="text" v-model="form.name" maxlength="12" class="form-control input-control clearfix"
                 placeholder="Name (*)" value="" required="">
          <input type="email" v-model="form.email" class="form-control input-control clearfix" placeholder="Email (*)"
                 value="" required="">
          <input type="url" v-model="form.url" class="form-control input-control clearfix" placeholder="Site (http://)"
                 value="">
          <textarea v-model="form.content" class="form-control" placeholder="Your comment here. Be cool. "
                    required=""></textarea>
          <button type="button" class="submit" @click="submit">SUBMIT</button>
        </form>
        <ol v-if="data.rows != null && data.rows.length > 0" class="comment-list">
          <li v-for="parent in data.rows" :id="'li-comment-' + parent.id"
              class="comment-body comment-parent comment-even">
            <div :id="'comment-' + parent.id">
              <div class="comment-view" onclick="">
                <div class="comment-header">
                  <img class="avatar" src="/user.png" width="80" height="80">
                  <span class="comment-author">
                      <a :href="parent.url" target="_blank" rel="external nofollow">{{parent.name}}</a>
                      <span>{{parent.device}}</span>
                  </span>
                </div>
                <div class="comment-content">
                  <span class="comment-author-at"></span>
                  <p>{{parent.content}}</p>
                  <p></p>
                </div>
                <div class="comment-meta">
                  <time class="comment-time">{{parent.time}}</time>
                  <span class="comment-reply">
                     <a href="#comments" rel="nofollow" @click="reply(parent.id, parent.name)">Reply</a>
                </span>
                </div>
              </div>
            </div>
            <div v-if="parent.children != null && parent.children.length > 0" class="comment-children">
              <ol class="comment-list">
                <li v-for="child in parent.children" :id="'li-comment-' + child.id"
                    class="comment-body comment-child comment-level-odd comment-odd">
                  <div :id="'comment-' + child.id">
                    <div class="comment-view" onclick="">
                      <div class="comment-header">
                        <img class="avatar" src="/user.png" width="80" height="80">
                        <span class="comment-author">
                            <a :href="child.url" target="_blank" rel="external nofollow">{{child.name}}</a>
                            <span>{{child.device}}</span>
                        </span>
                      </div>
                      <div class="comment-content">
                        <span class="comment-author-at"><a :href="'#comment-' + child.pId">@{{child.target}}</a></span>
                        <p>{{child.content}}</p>
                        <p></p>
                      </div>
                      <div class="comment-meta">
                        <time class="comment-time">{{child.time}}</time>
                        <span class="comment-reply">
                            <a href="#comments" rel="nofollow" @click="reply(parent.id, child.name)">Reply</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </li>
        </ol>
        <div v-if="data.pages > 0" class="lists-navigator">
          <ol class="page-navigator">
            <li v-if="data.current > 1" class="prev">
              <a @click="toPage(data.current - 1)" href="#comments">←</a>
            </li>
            <li v-for="i in data.pages" :class="data.current == i ? 'current' : ''">
              <a @click="toPage(i)" href="#comments">{{i}}</a>
            </li>
            <li v-if="data.current < data.pages" class="next">
              <a @click="toPage(data.current + 1)" href="#comments">→</a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {getListForAbout, addComment} from "@/api/comment";

  export default {
    name: "index",
    data() {
      return {
        data: {},
        form: {},
        current: 1,
        togetherDays: NaN,
      }
    },
    created() {
      this.fetchData(1)
      this.countThDaysTogether()
    },
    methods: {
      fetchData(current) {
        getListForAbout(current).then(res => {
          this.data = res.data
        })
      },
      countThDaysTogether() {
        let start = new Date('2019/5/1 09:36:0')  //开始时间
        let now = new Date()    //结束时间
        let diff = now.getTime() - start.getTime()//时间差秒
        this.togetherDays = Math.floor(diff / (24 * 3600 * 1000))
      },
      submit() {
        if (this.form.name == null || this.form.name == '') {
          this.$message.warning('请填写昵称')
          return false;
        }
        if (this.form.email == null || this.form.email == '') {
          this.$message.warning('请填写邮箱')
          return false
        }
        if (this.form.url == null || this.form.url == '') {
          this.$message.warning('请填写个性域名')
          return false
        }
        if (this.form.content == null || this.form.content == '') {
          this.$message.warning('请填写留言内容')
          return false;
        }

        addComment(this.form).then(res => {
          if (res.code == 200) {
            this.$message.success('评论成功')
            this.fetchData(this.current)
            this.clearForm()
          }
        })
      },

      reply(id, name) {
        this.form.pid = id
        this.form.cname = name
      },

      toPage(page) {
        this.current = page
        this.fetchData(page)
      },

      clearForm() {
        this.form.name = ''
        this.form.email = ''
        this.form.url = ''
        this.form.content = ''
        this.form.pid = ''
        this.form.cname = ''
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/styles/style.min.css";
</style>

