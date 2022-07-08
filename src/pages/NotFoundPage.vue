<template>
  <div class="loading">
    <el-progress
      type="dashboard"
      :percentage="percentage"
      :color="colors"
    ></el-progress>
    <div class="tip">当前页面不存在，正在跳转{{ pageName }}</div>
  </div>
</template>

<script>
export default {
  name: "NotFoundPage",
  data() {
    return {
      percentage: 0,
      pageName: "登录页",
      RouteName: "login",
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
    };
  },
  created() {
    if (sessionStorage.getItem("token")) {
      this.pageName = "首页";
      this.RouteName = "home";
    }
    let timer = setInterval(() => {
      if (this.percentage === 100) {
        clearInterval(timer);
        this.$router.push({ name: this.RouteName });
      } else {
        this.percentage++;
      }
    }, 30);
  },
};
</script>

<style lang="less" scoped>
.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateX(50%) translateY(50%);
  width: 50vw;
  height: 50vh;
  text-align: center;
  .el-progress {
  }
  .tip {
    color: #ffffff;
    font-weight: 700;
    letter-spacing: 1px;
  }
}
</style>