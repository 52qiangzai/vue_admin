<template>
  <div class="myContain">
    <div class="login_box">
      <img
        src="https://q1.qlogo.cn/g?b=qq&nk=1724417279@qq.com&s=100&q6qcc=qiangzai"
      />
      <el-form
        label-width="60px"
        style="padding: 80px"
        :model="formUserInfo"
        ref="formUserInfoRef"
        :rules="loginFormRules"
      >
        <el-form-item label="账号:" prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="formUserInfo.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            prefix-icon="el-icon-key"
            type="password"
            v-model="formUserInfo.password"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="80px">
          <el-button
            type="primary"
            :loading="isLoading"
            @click="submitForm('formUserInfoRef')"
            >登录</el-button
          >
          <el-button type="info" @click="resetForm('formUserInfoRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      formUserInfo: {
        username: "admin",
        password: "123456",
      },
      isLoading: false,
      // 表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 5,
            message: "长度在 3 到 5 个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 登录验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading = true;
          this.$store.dispatch("loginUser", this.formUserInfo);
        } else {
          this.$message.error(`登录验证失败，请正确输入每一项`);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.myContain {
  height: 100%;

  position: relative;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #d9ecff;
    box-shadow: 10px 10px 5px #66b1ff;
    position: absolute;
    border-radius: 8px;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 5px snow solid;
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>