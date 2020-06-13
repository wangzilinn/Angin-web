<template>
  <div class="app-container">
    {{mode}}
    <el-card>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="文章标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" style="display: inline-block">
          <!--这里直接把category存进去了-->
          <el-select v-model="form.categoryName" placeholder="请选择文章分类" style="width:400px">
            <!--value值是选中的那个-->
            <el-option v-for="item in categoryList" :label="item.name" :key="item.id" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章标签" style="display: inline-block">
          <!--这里直接把tag存进去了-->
          <el-select multiple v-model="form.tagNames" placeholder="请选择文章标签" style="width: 500px">
            <el-option v-for="item in tagList" :label="item.name" :key="item.id" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容">
          <div class="editor-container">
            <markdown-editor ref="markdownEditor" :content="form.contentMd" @editor="editor" height="600px"></markdown-editor>
          </div>
        </el-form-item>
        <el-form-item class="cover" label="文章封面">
          <el-upload
            :headers="tokenHeader"
            class="avatar-uploader"
            :action="imgApi"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.cover" :src="coverUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="draftSubmit">存入草稿</el-button>
          <el-button v-if="this.mode === `edit`" type="primary" @click="updateSubmit">更新文章</el-button>
          <el-button v-if="this.mode === `new`" type="primary" @click="releaseSubmit">发表文章</el-button>
          <el-button type="warning" @click="resetSubmit">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {updateArticle, addArticle, findArticleById} from '@/api/article'
  import {getAllCategories} from '@/api/category'
  import {getAllTags} from "@/api/tag";
  import MarkdownEditor from './components/markdown'
  import {userInfo} from '@/store/modules/user.js'

  export default {
    name: "edit",
    components: {MarkdownEditor},
    computed: {
      ...mapGetters([
        'imgApi',
        'token'
      ])
    },
    data() {
      let mode='new'
      if(this.$route.params.id !== undefined){
        mode = 'edit'
      }
      return {
        //指示该页面是新建模式还是编辑模式
        mode: mode,
        form: {},
        tokenHeader: {},
        categoryList: null,
        tagList: null,
        coverUrl: '',
        articleId: this.$route.params.id
      }
    },
    created() {
      this.tokenHeader = {'Authorization': this.token}
      this.fetchData()
    },
    methods: {

      fetchData() {
        getAllCategories().then(response => {
          this.categoryList = response.data
        })
        getAllTags().then(res => {
          this.tagList = res.data
        })
        if (this.mode === 'edit') {
          findArticleById(this.articleId).then(res =>{
            this.form = res.data
            console.log(this.form)
            this.coverUrl = this.getCoverUrl(this.form.cover)
          })
        }
      },
      clearForm() {
        this.form = {}
      },
      getCoverUrl(imgId){
        return this.imgApi + "/"+ imgId;
      },
      //markdown编辑器数据变化时触发
      editor(val) {
        this.form.contentMd = val.md;
        this.form.content = val.html;
      },

      handleAvatarSuccess(res, file) {
        if (res.code === 500) {
          this.$message.error(res.msg)
        }
        if (res.code === 200) {
          this.$message.success(res.msg)
          //返回的结果中, data的内容是图片的id, 与imgApi组合形成图片网址
          this.form.cover = res.data;
          this.coverUrl = this.getCoverUrl(this.form.cover);
          console.log(this.coverUrl)
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //提交草稿
      draftSubmit() {
        this.form.state = 'release'
        addArticle(this.form).then(res => {
          console.log(res)
          this.$message.success(res.msg)
          this.$router.replace('/admin/article/list')
        })

      },
      //提交正式版
      releaseSubmit() {
        this.form.author = userInfo.name
        this.form.state = 'release'
        addArticle(this.form).then(res => {
          console.log(res)
          this.$message.success(res.msg)
          this.$router.replace('/admin/article/list')
        })
      },
      updateSubmit(){
        updateArticle(this.form).then(res => {
          console.log(res)
          this.$message.success(res.msg)
          this.$router.replace('/admin/article/list')
        })
      },
      resetSubmit() {
        this.clearForm()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .editor-container {
    margin-bottom: 30px;

    /deep/ .tui-editor-defaultUI .te-mode-switch-section {
      height: 40px !important;
    }
  }

  .cover {
    /deep/ .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    /deep/ .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    /deep/ .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    /deep/ .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
</style>
