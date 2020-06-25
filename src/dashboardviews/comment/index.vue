<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.name" size="mini" placeholder="昵称" style="width: 200px;" class="filter-item"/>
      <el-input v-model="query.url" size="mini" placeholder="网址" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="fetchData">
        查询
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size="mini"
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          <!--递增序号-->
          {{(pageData.page - 1) * pageData.limit + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="留言文章" width="100">
        <template slot-scope="scope">
          {{ scope.row.articleTitle }}
        </template>
      </el-table-column>
      <el-table-column label="留言人" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.username">{{scope.row.username}}</span>
          <span v-else>匿名:{{ scope.row.avatar }}</span>
        </template>
      </el-table-column>
      <el-table-column label="留言内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDel(row.id)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pageData.totalPages>0" :total="pageData.totalPages" :page.sync="pageData.page" :limit.sync="pageData.limit" @pagination="fetchData" />

  </div>
</template>

<script>
  import { getCommentList, deleteComment} from '@/api/comment'
  import Pagination from '@/components/Pagination/index'

  export default {
    components: { Pagination },
    data() {
      return {
        list: null,
        listLoading: true,
        pageData: {
          limit: 20,
          page:1,
          totalPages: 1,
        },
        query: {},
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getCommentList(this.pageData).then(response => {
          this.list = response.data.elements
          this.listLoading = false
          this.pageData.totalPages = response.data.totalPages
          this.pageData.page = response.data.currentPage
          console.log( this.list)
          console.log(`第${this.pageData.page}页/共${this.pageData.totalPages}页`)
        })
      },

      handleDel(id) {
        this.$confirm('你确定永久删除此条记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteComment(id).then(response => {
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
