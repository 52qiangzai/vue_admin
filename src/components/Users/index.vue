<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索视图 -->
      <el-row :gutter="20">
        <el-col :span="12"
          ><div class="grid-content bg-purple">
            <el-input
              placeholder="请输入搜索内容"
              prefix-icon="el-icon-search"
              v-model="searchWord"
            >
            </el-input></div
        ></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="getAllUser">搜索用户</el-button>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="success" @click="dialogFormVisible = true"
              >添加用户</el-button
            >
          </div></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table :data="userInfoList" border style="width: 100%">
        <el-table-column label="#" width="180" type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- switch开关 -->
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-tooltip
              :content="'当前状态: ' + scope.row.mg_state"
              placement="top"
            >
              <el-switch
                active-color="#13ce66"
                inactive-color="#ff4949"
                v-model="scope.row.mg_state"
                @change="changeState(scope.row)"
              >
              </el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :content="'编辑信息'" placement="top">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="'分配角色'" placement="top">
              <el-button
                type="warning"
                size="small"
                icon="el-icon-setting"
                @click="assignRoles(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="'删除用户'" placement="top">
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="deleteUser(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 10px">
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          background
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userInfoList.total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户信息对话框 -->
    <el-dialog
      title="添加用户信息"
      :visible.sync="dialogFormVisible"
      :show-close="false"
    >
      <el-form :model="form" ref="addUserRef" :rules="rules">
        <el-form-item
          label="姓名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          :label-width="formLabelWidth"
          prop="mobile"
        >
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm('addUserRef', 'dialogFormVisible')"
          >取 消</el-button
        >
        <el-button type="primary" @click="addUser('addUserRef')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改用户对话框
     -->
    <el-dialog title="修改用户信息" :visible.sync="editFormVisible">
      <el-form :model="userInfoTempObj" ref="updateUserRef" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input
            v-model="userInfoTempObj.username"
            :disabled="true"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input
            v-model="userInfoTempObj.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          :label-width="formLabelWidth"
          prop="mobile"
        >
          <el-input
            v-model="userInfoTempObj.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm('updateUserRef', 'editFormVisible')"
          >取 消</el-button
        >
        <el-button type="primary" @click="updateUserRef('updateUserRef')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 分配用户角色 -->
    <el-dialog
      title="分配用户角色"
      :visible.sync="roleFormVisible"
      :show-close="false"
    >
      <el-form :model="form" ref="changeUserRef">
        <el-form-item label="用户名:" :label-width="formLabelWidth">
          <el-input
            v-model="form.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="现在角色:" :label-width="formLabelWidth">
          <el-input
            v-model="form.role_name"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="新的角色：" :label-width="formLabelWidth">
          <el-select v-model="rid" placeholder="选择修改的角色">
            <el-option
              v-for="(k, v, i) in rolesObj"
              :key="i"
              :label="k"
              :value="v"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm('changeUserRef', 'roleFormVisible')"
          >取 消</el-button
        >
        <el-button type="primary" @click="changeRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      // 当前页码
      pagenum: 1,
      // 每页多少条
      pagesize: 10,
      searchWord: "",
      userInfoList: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, message: "长度最少5位", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "请输入正确的号码格式",
            trigger: "change",
          },
        ],
      },
      userInfoTempObj: {},
      dialogFormVisible: false,
      editFormVisible: false,
      roleFormVisible: false,
      deleteVisible: false,
      form: {},
      formLabelWidth: "120px",
      rolesObj: {
        30: "主管",
        31: "测试角色",
        34: "测试角色2",
        39: "大发送到",
        40: "test",
        41: "dsdf",
      },
      rid: "",
    };
  },

  created() {
    this.pagenum = +sessionStorage.getItem("pagenumUser") || 1;
    this.pagesize = +sessionStorage.getItem("pagesizeUser") || 10;
    this.getAllUser();
  },
  methods: {
    // 获取用户信息 && 搜索用户
    async getAllUser() {
      let result = await this.$store.dispatch("getUserList", {
        query: this.searchWord,
        pagenum: this.pagenum,
        pagesize: this.pagesize,
      });
      const {
        data,
        meta: { msg, status },
      } = result;
      // console.log(result);
      if (status === 200) {
        this.$message.success(msg);
        this.userInfoList = data.users;
      } else {
        this.$message.error(msg);
      }
    },
    // 表单取消函数
    cancelForm(formName, digLogName) {
      this.$refs[formName].resetFields();
      this[digLogName] = false;
      this.form = {};
      this.userInfoTempObj = {};
      this.rid = "";
    },
    // 添加用户
    addUser(forName) {
      this.$refs[forName].validate(async (valid) => {
        if (valid) {
          let result = await this.$store.dispatch("addUserInfo", this.form);
          const {
            meta: { msg, status },
          } = result;
          if (status === 200 || status === 201) {
            this.$message.success(msg);
            this.dialogFormVisible = false;
            this.getAllUser();
            this.form = {};
          } else {
            this.$message.error(msg);
          }
        } else {
          this.$message.error(`请正确输入每一项`);
        }
      });
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pagesize = val;
      this.getAllUser();
      sessionStorage.setItem("pagesizeUser", val);
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getAllUser();
      sessionStorage.setItem("pagenumUser", val);
    },
    // 修改用户弹窗显示页面操作
    async handleEdit(index, row) {
      let result = await this.$store.dispatch("findUserById", row.id);
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.$message.success(msg);
        this.userInfoTempObj = data;
        this.editFormVisible = true;
      } else {
        this.$message.error(msg);
      }
    },
    // 更新用户信息
    updateUserRef(forName) {
      this.$refs[forName].validate(async (valid) => {
        if (valid) {
          let result = await this.$store.dispatch(
            "upDateUserInfo",
            this.userInfoTempObj
          );
          const {
            meta: { msg, status },
          } = result;
          if (status === 200 || status === 201) {
            this.$message.success(msg);
            this.getAllUser();
            this.editFormVisible = false;
          } else {
            this.$message.error(msg);
          }
        } else {
          this.$message.error(`请正确输入每一项`);
        }
      });
    },
    // 分配角色操作弹窗
    assignRoles(index, row) {
      this.form = row;
      this.roleFormVisible = true;
    },
    // 删除用户操作
    deleteUser(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("deleteUser", row.id).then((res) => {
            if (res === "ok") {
              this.getAllUser();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 改变用户状态
    async changeState(v) {
      const { id, mg_state } = v;
      let result = await this.$store.dispatch("changeUserState", {
        id,
        mg_state,
      });
      const {
        meta: { msg, status },
      } = result;
      if (status === 200 || status === 201) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async changeRole() {
      if (this.rid === "" || this.rid === null) {
        this.$message.warning("角色不能为空");
      } else {
        let result = await this.$store.dispatch("changeUserRoles", {
          id: this.form.id,
          rid: this.rid,
        });
        const {
          meta: { msg, status },
        } = result;
        if (status === 200 || status === 201) {
          this.$message.success(msg);
          this.getAllUser();
          this.rid = "";
          this.roleFormVisible = false;
        } else {
          this.$message.error(msg);
        }
      }
    },
  },
};
</script>

<style lang='less' scoped>
</style>