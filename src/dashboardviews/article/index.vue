<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.title" size="mini" placeholder="文章标题" style="width: 200px;" class="filter-item"/>
      <el-select v-model="query.category" size="mini" placeholder="选择分类" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in categoryList" :label="item.name" :key="item.id" :value="item.name" />
      </el-select>
      <el-select multiple v-model="query.tags" size="mini" placeholder="文章标签"  class="filter-item" style="width: 200px">
        <el-option v-for="item in tagList" :label="item.name" :key="item.id" :value="item.name"></el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="fetchData">
        查询
      </el-button>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh" @click="resetFilter">
        重置
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size="mini"
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          <!--递增序号-->
          {{(pageData.page - 1) * pageData.limit + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.categoryName }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="最后编辑时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.editTime }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag type="success">{{scope.row.state}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标签" width="110" align="center">
        <template slot-scope="scope">
          <!--这后面的:key="t"要有, 否则会有警告-->
          <el-tag type="primary" v-for="t in scope.row.tagNames" :key="t">{{t}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            Edit
          </el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="handleDel(row.id)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pageData.totalPages>0" :total="pageData.totalPages" :page.sync="pageData.page" :limit.sync="pageData.limit" @pagination="fetchData" />
  </div>
</template>

<script>
  import { getArticleList, deleteArticle } from '@/api/article'
  import { getAllCategories } from '@/api/category'
  import Pagination from '@/components/Pagination/index'
  import {getAllTags} from "@/api/tag";

  export default {
    components: { Pagination },
    data() {
      return {
        list: null,
        categoryList: null,
        tagList:null,
        listLoading: true,
        pageData: {
          limit: 20,
          page:1,
          totalPages: 1,
        },
        query:{}
      }
    },
    created() {
      this.fetchData()
      getAllCategories().then(res => {
        this.categoryList = res.data
      })
      getAllTags().then(res => {
        this.tagList = res.data
      })
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getArticleList(this.pageData).then(response => {
          this.list = response.data.elements
          this.listLoading = false
          this.pageData.totalPages = response.data.totalPages
          this.pageData.page = response.data.currentPage
          console.log(`第${this.pageData.page}页/共${this.pageData.totalPages}页`)
        })
      },
      resetFilter(){
        this.query = {}
      },
      handleUpdate(id) {
        this.$router.replace('/admin/article/edit/' + id)
      },

      handleDel(id) {
        this.$confirm('你确定永久删除此条记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteArticle(id).then(response => {
            this.$message.success(response.msg)
            this.fetchData();
          });
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      }
    }
  }
</script>
