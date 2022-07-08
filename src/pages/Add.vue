<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="请完成商品信息" type="warning" show-icon center>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="上传商品"></el-step>
      </el-steps>
      <!-- 切换页 -->
      <el-form :model="addForm" :rules="rules">
        <el-tabs
          :tab-position="tabPosition"
          style="height: 100%"
          @tab-click="handleClick"
          v-model="active"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="商品基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateGoryList"
                :props="{
                  expandTrigger: 'click',
                  label: 'cat_name',
                  value: 'cat_id',
                }"
                @change="changeCateGoryStr"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals.split(',')">
                <el-checkbox
                  v-for="x in item.attr_vals.split(',')"
                  :label="x"
                  disabled
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="https://vue-admin-api.q6q.cc/api/private/v1/upload"
              :headers="myHeader"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">上传图片</el-button>

              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
            <el-button
              size="small"
              type="primary"
              v-show="pics.length"
              @click="dialogVisible = true"
              >查看图片</el-button
            >
          </el-tab-pane>
          <el-tab-pane label="确定上传" name="4">
            <button type="primary" @click="addGood">添加商品</button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片显示框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <img
        v-for="(item, index) in pics"
        :src="www + item.pic"
        width="100"
        :key="index"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Add",
  data() {
    return {
      www: "https://vue-admin-api.q6q.cc/",
      addForm: {},
      active: "0",
      tabPosition: "left",
      cateGoryList: [],
      rules: {
        goods_name: [
          { required: true, message: "商品名不能为空" },
          { min: 2, message: "长度最少两位", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空" },
          { type: "number", message: "商品价格必须为数字值" },
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空" },
          { type: "number", message: "商品数量必须为数字值" },
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空" },
          { type: "number", message: "商品重量必须为数字值" },
        ],
        goods_cat: {
          required: true,
          message: "不能为空",
          trigger: "blur",
        },
      },
      manyTableData: [],
      fileList: [],
      myHeader: {},
      pics: [],
      dialogVisible: false,
    };
  },
  created() {
    if (sessionStorage.getItem("token")) {
      this.myHeader = {
        Authorization: sessionStorage.getItem("token"),
      };
    }
    this.getAllCateGory();
  },
  methods: {
    // 获取商品分类
    async getAllCateGory() {
      let result = await this.$store.dispatch("getGoodCateGory", {
        type: "tree",
      });
      this.cateGoryList = result.data;
    },
    changeCateGoryStr(v) {
      // console.log(v);
      this.addForm.goods_cat = v.join();
    },
    // 改变tab标签
    async handleClick(tab, event) {
      if (this.active === "1") {
        console.log("动态参数面板");
        let result = await this.$store.dispatch("reqGetParams", {
          id: this.cateId,
          sel: "many",
        });
        const {
          data,
          meta: { status, msg },
        } = result;
        if (status === 200) {
          this.$message.success(msg);
          this.manyTableData = data;
        } else {
          this.$message.error(msg);
        }
      }
    },
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && Object.keys(this.addForm).length !== 5) {
        this.$message.info("请正确填入每一项");
        return false;
      }
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.pics = this.pics.filter((item) => {
        return item.pic !== file.response.data.tmp_path;
      });
    },
    // 图片上传
    handleSuccess(response, file, fileList) {
      const {
        data: { tmp_path, url },
        meta: { status, msg },
      } = response;
      if (status === 200) {
        console.log(tmp_path, url);
        this.pics.push({ pic: tmp_path });
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 添加商品
    async addGood() {
      let result = await this.$store.dispatch("getAddGoodInfo", {
        ...this.addForm,
        pics: this.pics,
        attrs: this.attrs,
      });
      const {
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      this.$router.push({ name: "goods" });
    },
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat.split(",")[
        this.addForm.goods_cat.split(",").length - 1
      ];
    },
    attrs() {
      let tempObj = {};
      let result = [];
      this.manyTableData.forEach((item) => {
        tempObj.attr_id = item.attr_id;
        tempObj.attr_vals = item.attr_vals.split(",");
        result.push(tempObj);
      });
      return result;
    },
  },
};
</script>

<style>
</style>