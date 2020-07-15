<template>
  <div>
    <header id="header" class="header bg-white">
      <div class="navbar-container">
        <a href="/" class="navbar-logo">
          <img src="@/assets/layout/logo.png" alt="Het meisje met de parel">
        </a>
        <!--TODO:点击之后再请求-->
        <!-- @change="handleEnter" :回车时回调-->
        <el-autocomplete
          class="inline-input"
          suffix-icon="el-icon-search"
          v-model="searchArticleModel"
          :fetch-suggestions="this.findAllCategories"
          placeholder="选择文章分类或标题搜索"
          @select="this.handleSelectCategory"
          @change="this.handleSearchEnter"
          size="small"
        ></el-autocomplete>
        <!--<div class="item-meta-ico bg-ico-book"/>-->
        <div class="navbar-menu">
          <a href="/login" v-if="name">{{name}}</a>
          <a href="/logout" v-if="name">Logout</a>
          <a href="/login" v-else>Login</a>
          <a href="/about">About</a>
        </div>
        <div class="navbar-mobile-menu" onclick="">
          <span class="icon-menu cross"><span class="middle"></span></span>
          <ul>
            <a href="/login" v-if="name">{{name}}</a>
            <a href="/logout" v-if="name">Logout</a>
            <a href="/login" v-else>Login</a>
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
                <p>Theme is inspired by <a href="https://github.com/chakhsu/pinghsu" target="_blank">Pinghsu</a></p>
                <p>© 2020 <a href="https://zilinn.wang/">Wang zilin</a></p>
                <p><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=20012505">蜀ICP备20012505号-1</a>
                </p>
              </div>
            </div>
          </div>
          <div class="meta-item meta-posts">
            <canvas id="github-contribution-map"/>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  .navbar-logo img {
    height: 45px;
  }

  .navbar-logo {
    top: 45%;
  }

  .info-logo img {
    height: 50px;
  }

</style>
<script>
  import {getArticlePage} from "@/api/article";
  import {getCommentList} from "@/api/comment";
  import {drawContributions} from "github-contributions-canvas";
  import {mapGetters} from "vuex";
  import GithubCorner from "@/components/GithubCorner/index";
  import axios from 'axios'
  import {getGithubInfo} from "@/api/user";
  import {getCategoriesList} from "@/api/category";

  export default {
    name: "Layout",
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
      return {
        categoriesList: [],
        contributionData: null,
        showSearch: false,
        searchArticleModel: ''
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
        getCategoriesList().then(res => {
          res.data.forEach((item) => {
            //将过来的分类转换为搜索框能够接受的value属性
            this.categoriesList.push({"value":item.name})
          })
          this.categoriesList.push({"value":'All'})
        })
        getGithubInfo('wangzilinn').then(res => {
          this.contributionData = res.data
          drawContributions(document.getElementById("github-contribution-map"), {
            data: this.contributionData,
            username: "wangzilinn",
            themeName: "standard",
            footerText: "Made by @sallar - github-contributions.now.sh"
          });
        })
      },
      findAllCategories(queryString, callback) {
        console.log("query" + queryString)
        const categories = this.categoriesList;
        //const results = queryString ? categories.filter(this.createFilter(queryString)) : categories;
        callback(categories)
      },
      createFilter(queryString) {
        return (queryString) => {
          return (category.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectCategory(item) {
        console.log("select" + item.value)
        this.$store.dispatch('content/setCategory', item.value)
      //  重新加载index界面
      },
      handleSearchEnter(item) {
        if (item === '') {
          //当输入框为空时,不进行搜索
          return
        }
        this.$store.dispatch('content/setQuery', item)
        console.log("enter" + item);
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
