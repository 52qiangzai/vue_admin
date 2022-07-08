<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addDialogFormVisible = true"
        >添加分类</el-button
      >
      <el-table
        :data="cateGory.result"
        style="width: 100%"
        border
        row-key="cat_id"
        :indent="20"
        stripe
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-loading="!cateGory.result"
      >
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="分类名称" prop="cat_name"> </el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i
              :class="`el-icon-${!scope.row.cat_deleted ? 'success' : 'error'}`"
              style="color: lightgreen"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-show="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="info" v-show="scope.row.cat_level === 2">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editCateGory(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRole(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateGory.total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog title="编辑分类" :visible.sync="editDialogFormVisible">
      <el-form :model="form" v-loading="!form.cat_id">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleEditDialog">取 消</el-button>
        <el-button type="primary" @click="updateEditCateGory">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级选择" :label-width="formLabelWidth">
          <el-cascader
            v-model="value"
            ref="unitAreacode"
            :options="cateGory.result"
            :props="{
              value: 'cat_pid',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleChangeArea"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleEditDialog">取 消</el-button>
        <el-button type="primary" @click="addCateGory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Categories",
  data() {
    return {
      cateGory: {},
      value: "",
      form: {},
      pagenum: 1,
      pagesize: 10,
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      formLabelWidth: "120px",
    };
  },
  created() {
    this.pagenum = +sessionStorage.getItem("pagenumCates") || 1;
    this.pagesize = +sessionStorage.getItem("pagesizeCates") || 10;
    this.getAllCateGory();
  },
  methods: {
    // 获取所有分类
    async getAllCateGory() {
      let result = await this.$store.dispatch("getGoodCateGory", {
        pagenum: this.pagenum,
        pagesize: this.pagesize,
      });
      const {
        data,
        meta: { status, msg },
      } = result;
      if (status === 200) {
        this.cateGory = data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    //编辑分类名称
    async editCateGory(row) {
      this.editDialogFormVisible = true;
      let result = await this.$store.dispatch(
        "getCateGoryInfoById",
        row.cat_id
      );
      const {
        data,
        meta: { status, msg },
      } = result;
      if (status === 200) {
        this.$message.success(msg);
        this.form = data;
      } else {
        this.$message.error(msg);
      }
    },
    // dialog取消函数
    cancleEditDialog() {
      this.form = {};
      this.editDialogFormVisible = false;
      this.addDialogFormVisible = false;
      this.value = "";
    },
    // 更新分类名称
    async updateEditCateGory() {
      const { cat_id, cat_name } = this.form;
      let result = await this.$store.dispatch("updateCateGory", {
        id: cat_id,
        cat_name,
      });
      const {
        meta: { status, msg },
      } = result;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      this.form = {};
      this.editDialogFormVisible = false;
      this.getAllCateGory();
    },
    // 删除分类
    async deleteRole(row) {
      let result = await this.$store.dispatch("reqDeleteCateGory", row.cat_id);
      const {
        meta: { status, msg },
      } = result;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      this.getAllCateGory();
    },
    // 添加分类
    async addCateGory() {
      let result = await this.$store.dispatch("reqAddCateGoryMsg", this.form);
      const {
        meta: { status, msg },
      } = result;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      this.value = "";
      this.getAllCateGory();
      this.form = {};
      this.addDialogFormVisible = false;
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pagesize = val;
      this.getAllCateGory();
      sessionStorage.setItem("pagesizeCates", val);
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getAllCateGory();
      sessionStorage.setItem("pagenumCates", val);
    },
    handleChangeArea(val) {
      this.form.cat_pid = val[val.length - 1];
      this.cat_level = this.$refs.unitAreacode.getCheckedNodes()[0].level;
    },
  },
};
</script>

<style>
</style>