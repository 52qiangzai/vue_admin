<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
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
                @click="searchGoods"
              ></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="8" style="margin-left: 10px"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="addGood"> 添加商品</el-button>
          </div></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsObj.goods" border style="width: 100%">
        <el-table-column label="#" width="60" type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="350">
        </el-table-column>
        <el-table-column prop="goods_price" label="价格（元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :content="'修改商品'" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="editGood(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="'删除商品'" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteGood(scope.row)"
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
        :current-page="pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsObj.total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑信息" :visible.sync="editDialogFormVisible">
      <el-form :model="editGoodForm" v-loading="!editGoodForm.goods_id">
        <el-form-item label="商品id" :label-width="formLabelWidth">
          <el-input
            v-model="editGoodForm.goods_id"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input
            v-model="editGoodForm.goods_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input
            v-model="editGoodForm.goods_price"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品重量" :label-width="formLabelWidth">
          <el-input
            v-model="editGoodForm.goods_weight"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-carousel :interval="1000" type="card" height="200px">
            <el-carousel-item
              v-for="item in editGoodForm.pics"
              :key="item.pics_id"
            >
              <h3 class="medium">
                <el-image :src="item.pics_mid_url" :fit="'fill'"></el-image>
              </h3>
            </el-carousel-item>
          </el-carousel>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 10,
      goodsObj: {},
      editGoodForm: {},
      editDialogFormVisible: false,
      formLabelWidth: "120px",
    };
  },
  created() {
    this.pagenum = +sessionStorage.getItem("pagenumGoods") || 1;
    this.pagesize = +sessionStorage.getItem("pagesizeGoods") || 10;
    this.getAllGoods();
  },
  methods: {
    addGood() {
      this.$router.push({ name: "add" });
    },
    // 获取商品信息
    async getAllGoods() {
      let result = await this.$store.dispatch("getGoodList", {
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize,
      });
      const {
        data,
        meta: { status, msg },
      } = result;
      if (status === 200) {
        this.goodsObj = data;
        // console.log(data);
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 搜索商品信息
    searchGoods() {
      this.pagenum = 1;
      this.getAllGoods();
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pagesize = val;
      this.getAllGoods();
      sessionStorage.setItem("pagesizeGoods", val);
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getAllGoods();
      sessionStorage.setItem("pagenumGoods", val);
    },
    // 删除商品
    deleteGood(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$store.dispatch(
            "deleteGoodInfo",
            row.goods_id
          );
          const {
            meta: { status, msg },
          } = result;
          if (status === 200) {
            this.$message.success(msg);
            this.getAllGoods();
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
    //修改商品
    async editGood(row) {
      this.editDialogFormVisible = true;
      let result = await this.$store.dispatch("getGoodInfoById", row.goods_id);
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.editGoodForm = data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
  },
};
</script>

<style>
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
</style>