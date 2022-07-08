<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table
        :data="rightList"
        border
        style="width: 100%"
        v-loading="!rightList.length"
      >
        <el-table-column label="#" width="180" type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="权限路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-show="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-show="scope.row.level === '2'"
              >三级</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rightList: [],
    };
  },
  created() {
    this.getAllRightList();
  },
  methods: {
    async getAllRightList() {
      let result = await this.$store.dispatch("getRightList", "list");
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.rightList = data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
  },
};
</script>

<style>
</style>