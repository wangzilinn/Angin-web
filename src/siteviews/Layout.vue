<template>
  <div>
    <header id="header" class="header bg-white">
      <div class="navbar-container">
        <a href="/" class="navbar-logo">
          <img src="@/assets/layout/logo.png" alt="Het meisje met de parel">
        </a>
        <div class="navbar-menu">
          <a href="/login">Login</a>
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/about">About</a>
        </div>
        <div class="navbar-mobile-menu" onclick="">
          <span class="icon-menu cross"><span class="middle"></span></span>
          <ul>
            <a href="/login">Login</a>
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/about">About</a>
          </ul>
        </div>
      </div>
    </header>

    <router-view/>

    <footer id="footer" class="footer bg-white">
      <div class="footer-social">
        <div class="footer-container clearfix">
          <div class="social-list">
            <a class="social rss" target="blank" href="https://zilinn.wang/">BLOG</a>
            <a class="social douban" target="blank" href="https://www.douban.com/people/83078029/">DOUBAN</a>
            <a class="social github" target="blank" href="https://github.com/wangzilinn">GITHUB</a>
          </div>
        </div>
      </div>
      <div class="footer-meta">
        <div class="footer-container">
          <div class="meta-item meta-copyright">
            <div class="meta-copyright-info">
              <a href="/" class="info-logo">
                <img src="@/assets/layout/bottom_logo.png" alt="lover">
              </a>
              <div class="info-text">
                <p id="chakhsu">I work with J<span
                  style="color: rgb(255, 120, 71);">&amp;</span><span
                  style="color: rgb(255, 94, 99);">4</span><span
                  style="color: rgb(255, 94, 99);">U</span><span
                  style="color: rgb(191, 60, 175);">+</span><span style="color: rgb(226, 183, 47);">`</span>
                </p>
                <p>Theme is <a href="https://github.com/chakhsu/pinghsu" target="_blank">Pinghsu</a> by <a
                  href="https://www.linpx.com/" target="_blank">Chakhsu</a></p>
                <p>Powered by <a href="http://www.typecho.org" target="_blank" rel="nofollow">Typecho</a></p>
                <p>© 2020 <a href="https://zilinn.wang/">Wang zilin</a></p>
                <p><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=20012505">蜀ICP备20012505号-1</a>
                </p>
              </div>
            </div>
          </div>
          <!--这里显示最近的项目:tag是project的-->
          <div class="meta-item meta-posts">
            <h3 class="meta-title">RECENT PROJECTS</h3>
            <li v-if="recentProjectList != null" v-for="item in recentProjectList">
              <router-link :to="'/article/' + item.id">{{item.title}}</router-link>
            </li>
          </div>
          <!--这里显示最近的评论-->
          <div class="meta-item meta-comments">
            <h3 class="meta-title">RECENT ARTICLE COMMENTS</h3>
            <li v-if="recentArticleCommentList != null" v-for="item in recentArticleCommentList">
              <router-link :to="'/article/' + item.articleId">{{item.articleTitle}} : {{item.content}}</router-link>
            </li>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  .navbar-logo img {
    height: 40px;
  }

  .navbar-logo {
    top: 35%;
  }

  .info-logo img{
    height: 50px;
  }

</style>
<script>
  import {getArticleList} from "@/api/article";
  import {getCommentList} from "@/api/comment";

  export default {
    name: "Layout",
    data() {
      return {
        recentProjectList: null,
        recentArticleCommentList: null
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {
      this.init()
    },
    methods: {
      //创建页面时调用
      fetchData() {
        getArticleList({page:1, limit:8},[{key:`tag`, value:`project`}]).then(res => {
          this.recentProjectList = res.data.elements
        })
        getCommentList({page:1, limit:8}).then(res => {
          this.recentArticleCommentList = res.data.elements
        })
      },
      init() {
        let r = document.getElementById('chakhsu')
        if (r.loaded) {
          return false;
        }

        function t() {
          return b[Math.floor(Math.random() * b.length)]
        }

        function e() {
          return String.fromCharCode(94 * Math.random() + 33)
        }

        function n(r) {
          for (var n = document.createDocumentFragment(), i = 0; r > i; i++) {
            var l = document.createElement("span");
            l.textContent = e(), l.style.color = t(), n.appendChild(l)
          }
          return n
        }

        function i() {
          var t = o[c.skillI];
          c.step ? c.step-- : (c.step = g, c.prefixP < l.length ? (c.prefixP >= 0 && (c.text += l[c.prefixP]), c.prefixP++) : "forward" === c.direction ? c.skillP < t.length ? (c.text += t[c.skillP], c.skillP++) : c.delay ? c.delay-- : (c.direction = "backward", c.delay = a) : c.skillP > 0 ? (c.text = c.text.slice(0, -1), c.skillP--) : (c.skillI = (c.skillI + 1) % o.length, c.direction = "forward")), r.textContent = c.text, r.appendChild(n(c.prefixP < l.length ? Math.min(s, s + c.prefixP) : Math.min(s, t.length - c.skillP))), setTimeout(i, d)
        }

        var l = "I focus on ",
          o = ["Embedded-NN", "NILM", "Java", "Dart", "Vue", "Spring Boot", "Spring Cloud"].map(function (r) {
            return r + "."
          }), a = 2, g = 1, s = 5, d = 75,
          b = ["rgb(110,64,170)", "rgb(150,61,179)", "rgb(191,60,175)", "rgb(228,65,157)", "rgb(254,75,131)", "rgb(255,94,99)", "rgb(255,120,71)", "rgb(251,150,51)", "rgb(226,183,47)", "rgb(198,214,60)", "rgb(175,240,91)", "rgb(127,246,88)", "rgb(82,246,103)", "rgb(48,239,130)", "rgb(29,223,163)", "rgb(26,199,194)", "rgb(35,171,216)", "rgb(54,140,225)", "rgb(76,110,219)", "rgb(96,84,200)"],
          c = {text: "", prefixP: -s, skillI: 0, skillP: 0, direction: "forward", delay: a, step: g};
        i();
        r.loaded = true;
      }

    }
  }
</script>
