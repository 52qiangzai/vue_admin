<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card" v-loading="isLoading">
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

export default {
  name: "Reports",
  data() {
    return {
      isLoading: true,
      option: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
      },
    };
  },
  created() {
    this.getAllData();
  },
  methods: {
    async getAllData() {
      let result = await this.$store.dispatch("getReports");
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.$message.success(msg);
        this.option.legend = data.legend;
        this.option.xAxis = data.xAxis;
        this.option.yAxis = data.yAxis;
        this.option.series = data.series;
        this.showChart("main");
        this.isLoading = false;
      } else {
        this.$message.error(msg);
      }
    },
    showChart(id) {
      let chartDom = document.getElementById(id);
      let myChart = echarts.init(chartDom);
      this.option && myChart.setOption(this.option);
    },
  },
};
</script>

<style lang="less" scoped>
#main {
  width: 100%;
  height: 50vh;
}
</style>