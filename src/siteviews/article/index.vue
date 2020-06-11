<template>

  <div class="content-index">
    <article class="main-content page-page">
      <div class="post-header">
        <h1 class="post-title" itemprop="name headline"> {{article.title}} </h1>
        <div class="post-data">
          <time v-if="article.editTime" itemprop="datePublished">This article was published in {{article.editTime}}
          </time>
          under the <a href="#">{{article.categoryName}} category</a>
        </div>
      </div>
      <div class="post-content" itemprop="articleBody">
        <p class="post-tags" v-if="article.tagNames != null">
          <a v-for="tagName in article.tagNames" href="#">{{tagName}}</a>
        </p>

        <div id="post-content" v-html="article.content" ref="content"></div>

        <p class="post-info">
          本文由 <a href="/">{{article.author}}</a> 创作，采用
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="external nofollow">知识共享署名4.0</a>
          国际许可协议进行许可<br>本站文章除注明转载/出处外，均为本站原创或翻译，转载前请务必署名<br>最后编辑时间为: {{article.editTime}}
        </p>
      </div>
    </article>

    <div id="directory-content" class="directory-content initial headroom--not-bottom headroom--not-top pinned">
      <div id="directory">
      </div>
    </div>

    <div @click="floatMenu" id="floatMenu">
      <a href="javascript:;" class="btn-goTop"></a>
    </div>

    <div id="respond-post-334" class="comment-container">
      <div id="comments" class="clearfix">
        <span class="title">Comments</span>
        <div class="radio">
          排序：
          <el-radio-group v-model="reverse">
            <el-radio :label="true">倒序</el-radio>
            <el-radio :label="false">正序</el-radio>
          </el-radio-group>
        </div>
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(comment, index) in comments"
            :key="index"
            :timestamp="comment.date"
            placement="top">
            <el-card>
              <div class="comment-header">
                <img class="avatar" src="/user.png" width="80" height="80">
                <span class="comment-author">
                  <span v-if="comment.username">{{comment.username}}</span>
                  <span v-else>匿名用户: {{comment.avatar}}</span>
                  </span>
              </div>
              <div class="comment-content">
                <span class="comment-author-at"></span>
                <p>{{comment.content}}</p>
                <p></p>
              </div>
              <div class="comment-meta">
                <span class="comment-reply">
                     <a href="#comments" rel="nofollow" @click="">Reply</a>
                </span>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <span class="response">Responses</span>
        <div class="radio">
          <el-radio-group v-model="anonymous" @change="changeCommentRole">
            <el-radio :label="false">当前用户
              <span v-if="this.name">: {{this.name}}</span>
            </el-radio>
            <el-radio :label="true">匿名</el-radio>
          </el-radio-group>
        </div>
        <form id="comment-form" class="comment-form" role="form">
          <input v-model="form.articleTitle = article.title" style="display: none;">
          <input v-model="form.articleId = article.id" style="display: none;">
          <p v-if="anonymous">
            <input type="email" v-model="form.avatar" class="form-control input-control clearfix" placeholder="avatar"
                   value="" required="">
          </p>
          <textarea v-model="form.content" class="form-control" placeholder="Your comment here. Be cool. "
                    required=""></textarea>
          <button type="button" class="submit" @click="submit">SUBMIT</button>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
  import {add, getCommentList} from "@/api/comment";
  import {findById} from '@/api/article'
  import {mapGetters} from "vuex";
  import GithubCorner from '@/components/GithubCorner'

  export default {
    name: "index",
    computed: {
      ...mapGetters([
        'name' //username
      ])
    },
    data() {
      //如果用户登陆了, 就默认不用匿名模式
      let anonymous = false
      if (this.name === ``)
        anonymous = true
      return {
        article: {},
        comments: {},
        form: {},
        currentCommentPage: 1,
        reverse: true,
        anonymous: anonymous,
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {
      setTimeout(() => {
        this.init();
      }, 400)
    },
    methods: {
      //页面加载时调用
      fetchData() {
        findById(this.$route.params.id).then(res => {
          this.article = res.data
        })
        this.fetchCommentData(this.currentCommentPage)
      },

      fetchCommentData(currentCommentPage) {
        getCommentList({page: currentCommentPage, limit: 4}, [{key: "id", value: this.$route.params.id}]).then(res => {
          this.comments = res.data.elements
          console.log(this.comments)
        })
      },
      changeCommentRole(isAnonymous) {
        console.log(`使用匿名: ${isAnonymous}`);
        if (!isAnonymous) {
          //判断是否登录
          if (this.name === '') {
            //未登录, 跳转到登陆界面
            this.$confirm('是否进行登录>', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push({path: `/login?redirect=/article/${this.$route.params.id}`})
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消登录, 只能使用匿名评论'
              });
              this.anonymous = true
            });
          }
        }
      },
      submit() {
        //如果是匿名,则需要填写昵称(如果不是匿名, 则会有用户名form.username
        if (this.anonymous) {
          if (this.form.avatar == null || this.form.avatar === '') {
            this.$message.warning('请填写昵称')
            return false
          }
        } else {
          this.form.username = this.name
        }
        if (this.form.content == null || this.form.content === '') {
          this.$message.warning('请填写留言内容')
          return false;
        }

        add(this.form).then(res => {
          if (res.code === 200) {
            this.$message.success('评论成功')
            this.fetchCommentData(this.currentCommentPage)
            this.clearForm()
          }
        })
      },

      reply(id, name) {
        this.form.pid = id
        this.form.cname = name
      },

      toPage(page) {
        this.currentCommentPage = page
        this.fetchCommentData(page)
      },

      clearForm() {
        this.form.username = ''
        this.form.content = ''
        this.form.avatar = ''
      },

      init() {
        //生成右侧目录导航
        var postDirectoryBuild = function () {
          var postChildren = function children(childNodes, reg) {
            var result = [],
              isReg = typeof reg === 'object',
              isStr = typeof reg === 'string',
              node, i, len;
            for (i = 0, len = childNodes.length; i < len; i++) {
              node = childNodes[i];
              if ((node.nodeType === 1 || node.nodeType === 9) &&
                (!reg ||
                  isReg && reg.test(node.tagName.toLowerCase()) ||
                  isStr && node.tagName.toLowerCase() === reg)) {
                result.push(node);
              }
            }
            return result;
          }
          var createPostDirectory = function (article, directory, isDirNum) {
            var contentArr = [],
              titleId = [],
              levelArr, root, level,
              currentList, list, li, link, i, len;
            levelArr = (function (article, contentArr, titleId) {
              var titleElem = postChildren(article.childNodes, /^h\d$/),
                levelArr = [],
                lastNum = 1,
                lastRevNum = 1,
                count = 0,
                guid = 1,
                id = 'directory' + (Math.random() + '').replace(/\D/, ''),
                lastRevNum, num, elem;
              while (titleElem.length) {
                elem = titleElem.shift();
                contentArr.push(elem.innerHTML);
                num = +elem.tagName.match(/\d/)[0];
                if (num > lastNum) {
                  levelArr.push(1);
                  lastRevNum += 1;
                } else if (num === lastRevNum ||
                  num > lastRevNum && num <= lastNum) {
                  levelArr.push(0);
                  lastRevNum = lastRevNum;
                } else if (num < lastRevNum) {
                  levelArr.push(num - lastRevNum);
                  lastRevNum = num;
                }
                count += levelArr[levelArr.length - 1];
                lastNum = num;
                elem.id = elem.id || (id + guid++);
                titleId.push(elem.id);
              }
              if (count !== 0 && levelArr[0] === 1) levelArr[0] = 0;
              return levelArr;
            })(article, contentArr, titleId);
            currentList = root = document.createElement('ul');
            var dirNum = [0];
            for (i = 0, len = levelArr.length; i < len; i++) {
              level = levelArr[i];
              if (level === 1) {
                list = document.createElement('ul');
                if (!currentList.lastElementChild) {
                  currentList.appendChild(document.createElement('li'));
                }
                currentList.lastElementChild.appendChild(list);
                currentList = list;
                dirNum.push(0);
              } else if (level < 0) {
                level *= 2;
                while (level++) {
                  if (level % 2) dirNum.pop();
                  currentList = currentList.parentNode;
                }
              }
              dirNum[dirNum.length - 1]++;
              li = document.createElement('li');
              link = document.createElement('a');
              link.href = '#' + titleId[i];
              link.innerHTML = !isDirNum ? contentArr[i] :
                dirNum.join('.') + ' ' + contentArr[i];
              li.appendChild(link);
              currentList.appendChild(li);
            }
            directory.appendChild(root);
          };
          createPostDirectory(document.getElementById('post-content'), document.getElementById('directory'), true);
        };
        postDirectoryBuild();
      },

      floatMenu() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }

    }
  }
</script>
<style scoped>
  @import "~@/styles/style.min.css";
  @import "~@/styles/xcode.min.css";

  .content-index {
    padding: 0
  }

  #comments .title {
    font-size: 20px;
    font-weight: 400;
    display: block;
    padding: 30px 0 30px 20px;
    color: #5f5f5f
  }

  #comments .radio {
    padding: 0 0 30px 20px;
  }

  .comment-meta .comment-reply {
    display: inline;
    float: right
  }

  .comment-author span {
    margin: 0;
    padding: 0;
    background-color: white;
    font-size: 1rem;
  }
</style>
