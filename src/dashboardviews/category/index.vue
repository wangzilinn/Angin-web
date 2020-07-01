<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.name" size="mini" placeholder="名称" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="fetchData">
        查询
      </el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogVisible = true">
        新增
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          <!--递增序号-->
          {{(pageData.page - 1) * pageData.limit + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="文章数">
        <template slot-scope="scope">
          <span v-if="scope.row.articleId.length">{{ scope.row.articleId.length}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="handleDel(row.id)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pageData.totalPages>0" :total="pageData.totalPages" :page.sync="pageData.page" :limit.sync="pageData.limit" @pagination="fetchData" />

    <!-- 分类添加 -->
    <el-dialog title="修改/新增" :visible.sync="dialogVisible" width="30%" :append-to-body='true'
               :before-close="handleClose">
        <span>
            <el-input placeholder="请输入名称" v-model="form.name">
                <template slot="prepend">名称</template>
            </el-input>
        </span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAction">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import {deleteArticle, addCategory, updateCategory, getCategoriesList} from '@/api/category'
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
        form: {},
        dialogVisible: false,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getCategoriesList(this.pageData).then(response => {
          this.list = response.data.elements
          this.listLoading = false
          this.pageData.totalPages = response.data.totalPages
          this.pageData.page = response.data.currentPage
          console.log( this.list)
          console.log(`第${this.pageData.page}页/共${this.pageData.totalPages}页`)
        })
      },

      handleUpdate(row) {
        this.form = row
        this.dialogVisible = true
      },

      submitAction() {
        if (this.form.id === undefined) {
          addCategory(this.form).then(res => {
            this.$message.success(res.msg)
            this.fetchData()
          })
        } else {
          updateCategory(this.form).then(res => {
            this.$message.success(res.msg)
            this.fetchData()
          })
        }
        this.dialogVisible = false
        this.handleClose()
      },

      handleClose() {
        this.form = {}
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
