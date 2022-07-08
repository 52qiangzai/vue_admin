<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="12"
          ><div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              v-model="query"
              class="input-with-select"
              clearable
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchOrder"
              ></el-button>
            </el-input></div
        ></el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="orderObj.goods"
        border
        style="width: 100%"
        v-loading="!Object.keys(orderObj).length"
      >
        <el-table-column label="#" width="180" type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否支付">
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="warning" v-show="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope"
            >{{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :content="'修改地址'" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="addrDialogVisible = true"
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="'物流状态'" placement="top">
              <el-button
                type="success"
                icon="el-icon-location-information"
                @click="showWL(scope.$index, scope.row)"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderObj.pagenum * 1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderObj.total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址 -->
    <el-dialog title="修改地址" :visible.sync="addrDialogVisible" width="30%">
      <el-form
        :model="addrForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省份/市区">
          <el-cascader
            v-model="addrForm.city"
            :options="cityOptions"
            @change="changeProvince"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="name">
          <el-input v-model="addrForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流状态 -->
    <el-dialog
      title="物流状态信息"
      :visible.sync="kdDialogVisible"
      width="30%"
      :before-close="closeWlDialog"
    >
      <el-timeline v-loading="!wuliu.length">
        <el-timeline-item
          v-for="(activity, index) in wuliu"
          :key="index"
          :timestamp="activity.ftime"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityOptions from "@/assets/js/city_data2017_element";
export default {
  name: "Orders",
  data() {
    return {
      orderObj: [],
      query: "",
      pagenum: 1,
      pagesize: 10,
      addrDialogVisible: false,
      kdDialogVisible: false,
      addrForm: {},
      cityOptions: cityOptions,
      wuliu: [],
    };
  },
  created() {
    this.pagenum = +sessionStorage.getItem("pagenumOrder") || 1;
    this.pagesize = +sessionStorage.getItem("pagesizeOrder") || 10;
    this.getAllOrderList();
  },
  methods: {
    // 获取全部订单列表
    async getAllOrderList() {
      let result = await this.$store.dispatch("getOrderList", {
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize,
      });
      console.log(result);
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.orderObj = data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 修改地址后打印地址
    changeProvince(value) {
      console.log(value);
    },
    // 关闭物流信息时，清空wuliu
    closeWlDialog(done) {
      this.wuliu = [];
      done();
    },
    // 物流信息
    async showWL(index, row) {
      this.kdDialogVisible = true;
      let result = await this.$store.dispatch("getWlMsg", "1106975712662");
      const {
        data,
        meta: { status },
      } = result;
      if (status === 200) {
        this.wuliu = data;
        this.$message.success("物流信息获取成功");
      } else {
        this.$message.error("物流信息获取失败");
      }
    },
    // 搜索物流信息
    searchOrder() {
      this.getAllOrderList();
    },
    // 改变页表数
    handleSizeChange(val) {
      this.pagesize = val;
      this.getAllOrderList();
      sessionStorage.setItem("pagesizeOrder", val);
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getAllOrderList();
      sessionStorage.setItem("pagenumOrder", val);
    },
  },
};
</script>

<style>
</style>