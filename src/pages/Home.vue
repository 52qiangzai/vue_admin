<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <router-link
        :to="{
          name: 'welcome',
        }"
      >
        <img
          src="https://q1.qlogo.cn/g?b=qq&nk=1724417279@qq.com&s=100&q6qcc=qiangzai"
          alt=""
          class="logo"
        />
        <span>强仔后台管理项目</span>
      </router-link>

      <el-button @click="logout" type="danger">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左侧栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#79bbff"
          text-color="#fff"
          active-text-color="#FDE2E2"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="showLinkStr"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.order"
          >
            <template slot="title">
              <i :class="'iconfont ' + iconObj[item.id]"></i>
              <!-- 一级 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级 -->
            <el-menu-item
              v-for="j in item.children"
              :index="'/' + j.path"
              :key="j.id"
              @click="showLink(j.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ j.authName }}</span></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主题 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "home",
  data() {
    return {
      isCollapse: false,
      iconObj: {
        125: "icon-yonghuguanli",
        103: "icon-quanxianguanli",
        101: "icon-shangpinguanli",
        102: "icon-dingdanguanli",
        145: "icon-shujuguanli",
      },
      // 高亮链接
      showLinkStr: sessionStorage.getItem("localLinkStr"),
    };
  },
  created() {
    this.$store.dispatch("getMenuList");
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      if (!sessionStorage.getItem("token")) {
        this.$message.warning("退出成功,请重新登录");
        this.$router.push({ name: "login" });
      }
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    showLink(path) {
      let localLinkStr = `/${path}`;
      sessionStorage.setItem("localLinkStr", localLinkStr);
    },
  },
  computed: {
    ...mapState({
      menuList: (state) => {
        return state.other.menuList;
      },
    }),
  },
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #409eff;
  color: #333;
  line-height: 60px;
  align-items: center;
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: #d9ecff solid 2px;
  }
  span {
    margin-left: 5px;
    color: #d9ecff;
    font-weight: 800;
    font-size: 20px;
  }
}

.el-aside {
  background-color: #79bbff;
  color: #333;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #d9ecff;
}
i {
  margin-right: 3px;
}
.toggle-button {
  text-align: center;
  background-color: #8cc5ff;
  color: #d9ecff;
  padding: 2px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>