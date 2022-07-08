<template>
  <div>
    <el-card class="box-card">
      <el-skeleton :rows="10" animated :loading="isLoading">
        <el-alert
          title="欢迎来到强仔后台管理系统"
          type="success"
          center
          show-icon
        >
        </el-alert>
        <el-carousel :interval="2000" type="card" height="300px">
          <el-carousel-item v-for="item in imageList" :key="item">
            <el-image :src="item" :fit="'contain'"></el-image>
          </el-carousel-item>
        </el-carousel>
        <el-alert :title="musicInfo.content" type="success" effect="dark">
        </el-alert>

        <el-button
          type="primary"
          size="small"
          style="margin-top: 10px"
          @click="nextRP"
          >换个热评</el-button
        >
        <el-button
          type="primary"
          size="small"
          style="margin-top: 10px"
          @click="nextMusic"
          >换个音乐</el-button
        >
        <el-button
          type="primary"
          size="small"
          style="margin-top: 10px"
          @click="jumpGit"
          >git仓库</el-button
        >
        <audio
          ref="musicRef"
          :src="musicUrl"
          controls="controls"
          preload="load"
          autoplay="autoplay"
          loop="loop"
          v-show="false"
        >
          您的浏览器尚未支持播放当前音乐，建议更换浏览器再来。
        </audio>
      </el-skeleton>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Welcome",
  data() {
    return {
      isLoading: true,
      musicInfo: {},
      musicUrl:
        "http://m801.music.126.net/20220708112051/a05940b9474fc4177dce34f86e6e5584/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096612333/8f11/051b/3e91/8dbfd7d3fa7687f2408b19d1dfddf174.mp3",
      imageList: [
        "https://cdn.jsdelivr.net/gh/52qiangzai/vue_admin/public/images/AddGood.png",
        "https://cdn.jsdelivr.net/gh/52qiangzai/vue_admin/public/images/CateGoryAdmin.png",
        "https://cdn.jsdelivr.net/gh/52qiangzai/vue_admin/public/images/GoodAdmin.png",
        "https://cdn.jsdelivr.net/gh/52qiangzai/vue_admin/public/images/GoodCateGory.png",
        "https://cdn.jsdelivr.net/gh/52qiangzai/vue_admin/public/images/LoginUser.png",
        "https://cdn.jsdelivr.net/gh/52qiangzai/vue_admin/public/images/OrderAdmin.png",
        "https://cdn.jsdelivr.net/gh/52qiangzai/vue_admin/public/images/ReportAdmin.png",
        "https://cdn.jsdelivr.net/gh/52qiangzai/vue_admin/public/images/RightAdmin.png",
        "https://cdn.jsdelivr.net/gh/52qiangzai/vue_admin/public/images/RoleAdmin.png",
        "https://cdn.jsdelivr.net/gh/52qiangzai/vue_admin/public/images/UserAdmin.png",
      ],
    };
  },
  methods: {
    getMusicInfo() {
      axios
        .get("https://api.uomg.com/api/comments.163")
        .then((res) => {
          if (res.data.code === 1) {
            this.$notify({
              title: "成功",
              message: "获取热评信息成功",
              type: "success",
            });
            this.musicInfo = res.data.data;
            this.isLoading = false;
          }
          // this.$nextTick(() => {
          //   this.$refs.musicRef.play();
          // });
        })
        .catch((error) => {
          this.$notify.error({
            title: "错误",
            message: error,
          });
        });
    },
    nextRP() {
      this.getMusicInfo();
    },
    nextMusic() {
      axios
        .get("https://api.uomg.com/api/comments.163")
        .then((res) => {
          if (res.data.code === 1) {
            this.$notify({
              title: "成功",
              message: "获取音乐信息成功",
              type: "success",
            });
            this.musicUrl = res.data.data.url;
          }
        })
        .catch((error) => {
          this.$notify.error({
            title: "错误",
            message: error,
          });
        });
    },
    jumpGit() {
      location.href = "https://github.com/52qiangzai/vue_admin";
    },
  },
  mounted() {
    setTimeout(() => {
      this.getMusicInfo();
    }, 1000);
  },
};
</script>

<style lang="less" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.is-active {
  box-shadow: 10px 10px 5px #7fb9f7;
}
</style>