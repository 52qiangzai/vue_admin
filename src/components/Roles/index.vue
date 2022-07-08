<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="12"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="addRoleDialogFormVisible = true"
              >添加角色</el-button
            >
          </div></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="rolesList"
        style="width: 100%"
        border
        v-loading="!rolesList.length"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              style="text-align: center"
              v-for="(a, index) in scope.row.children"
              :key="a.id"
              :class="['bdbottom', index === 0 ? 'bdtop' : '']"
            >
              <el-col :span="5">
                <el-tag
                  >{{ a.authName
                  }}<i
                    class="el-icon-delete el-icon--right"
                    @click="deleteRoles(scope.row, a.id)"
                  ></i
                ></el-tag>
              </el-col>
              <el-col :span="19">
                <el-row v-for="b in a.children" :key="b.id">
                  <el-col :span="5">
                    <el-tag type="success"
                      >{{ b.authName
                      }}<i
                        class="el-icon-delete el-icon--right"
                        @click="deleteRoles(scope.row, b.id)"
                      ></i
                    ></el-tag>
                  </el-col>
                  <el-col :span="19">
                    <el-row v-for="c in b.children" :key="c.id">
                      <el-col>
                        <el-tag type="warning"
                          >{{ c.authName
                          }}<i
                            class="el-icon-delete el-icon--right"
                            @click="deleteRoles(scope.row, c.id)"
                          ></i
                        ></el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRole(scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-search"
              size="small"
              @click="assignPermissions(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogFormVisible"
      :before-close="clearFromInfo"
    >
      <el-form :model="addRoleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input
            v-model="addRoleForm.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input
            v-model="addRoleForm.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFrom">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色信息对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogFormVisible"
      :before-close="clearFromInfo"
    >
      <el-form :model="addRoleForm" v-loading="!addRoleForm.roleName">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input
            v-model="addRoleForm.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input
            v-model="addRoleForm.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFrom">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色权限对话框 -->
    <el-dialog
      title="分配权限列表"
      :visible.sync="disRoleDialogFormVisible"
      :before-close="clearFromInfo"
    >
      <!-- 树形权限列表 -->
      <el-tree
        :data="locRightsList"
        v-loading="!checkedKey.length"
        show-checkbox
        empty-text
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedKey"
        :props="defaultProps"
        ref="treeRef"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFrom">取 消</el-button>
        <el-button type="primary" @click="getAllKeys">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      formLabelWidth: "100px",
      addRoleForm: {},
      addRoleDialogFormVisible: false,
      editRoleDialogFormVisible: false,
      disRoleDialogFormVisible: false,
      defaultProps: {
        children: "children",
        label: "authName",
      },
      locRightsList: [],
      checkedKey: [],
      roleId: 0,
    };
  },
  methods: {
    // 清除表单
    clearFromInfo(done) {
      this.addRoleForm = {};
      this.checkedKey = [];
      done();
    },
    // 取消表单
    cancelFrom() {
      this.disRoleDialogFormVisible = false;
      this.addRoleDialogFormVisible = false;
      this.editRoleDialogFormVisible = false;
      this.addRoleForm = {};
      this.locRightsList = [];
      this.checkedKey = [];
    },
    // 获取角色列表
    async getAllRolesList() {
      let result = await this.$store.dispatch("getRoleInfo");
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.rolesList = data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 添加角色信息
    async addRole() {
      let result = await this.$store.dispatch("addRoleInfo", this.addRoleForm);
      const {
        meta: { msg, status },
      } = result;
      if (status === 201) {
        this.getAllRolesList();
        this.$message.success(msg);
        this.addRoleDialogFormVisible = false;
        this.addRoleForm = {};
      } else {
        this.$message.error(msg);
      }
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$store.dispatch("deleteRoleInfo", row.id);
          const {
            meta: { status, msg },
          } = result;
          if (status === 200) {
            this.getAllRolesList();
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑用户信息
    async editRole(row) {
      this.editRoleDialogFormVisible = true;
      const { id } = row;
      let result = await this.$store.dispatch("getRoleById", id);
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.addRoleForm = data;

        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 更新用户信息
    async updateRole() {
      let result = await this.$store.dispatch(
        "updateRoleInfo",
        this.addRoleForm
      );
      const {
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.getAllRolesList();
        this.editRoleDialogFormVisible = false;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 分配用户权限
    async assignPermissions(row) {
      this.disRoleDialogFormVisible = true;
      this.roleId = row.id;
      let result = await this.$store.dispatch("getRightList", "tree");
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.getLeafKeys(row, this.checkedKey);
        this.locRightsList = data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 删除权限
    async deleteRoles(row, rightId) {
      const { id: roleId } = row;
      let result = await this.$store.dispatch("deleteRoleRight", {
        roleId,
        rightId,
      });
      const {
        meta: { status, msg },
      } = result;
      if (status === 200) {
        this.getAllRolesList();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 获取所偶遇三级权限的id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((element) => {
        this.getLeafKeys(element, arr);
      });
    },
    // 分配权限
    async getAllKeys() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      let result = await this.$store.dispatch("addRoleRights", {
        roleId: this.roleId,
        rids: idStr,
      });
      const {
        meta: { status, msg },
      } = result;
      if (status === 200) {
        this.checkedKey = [];
        this.disRoleDialogFormVisible = false;
        this.getAllRolesList();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
  },
  created() {
    this.getAllRolesList();
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>