<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
      >
      </el-alert>

      <el-row :gutter="20">
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <el-tag>请选择商品分类</el-tag>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-cascader
              v-model="cascaderArr"
              :options="cateGoryList"
              :props="{
                expandTrigger: 'click',
                label: 'cat_name',
                value: 'cat_id',
              }"
              @change="getLastIndexNodeId"
            ></el-cascader>
          </div>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-button
          type="success"
          :disabled="cascaderArr.length === 0 ? true : false"
          @click="dialogFormVisible = true"
          >添加属性或参数</el-button
        >
        <el-tab-pane label="动态参数" name="first">
          <el-table
            style="width: 100%"
            border
            :data="attrList"
            row-key="attr_id"
            ref="attrRef"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form
                  label-position="center"
                  inline
                  class="demo-table-expand"
                >
                  <el-row>
                    <el-tag
                      v-for="tag in scope.row.attr_vals.split(',')"
                      :key="tag"
                      closable
                      @close="deleteAttr(tag, scope.row)"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput"
                      >+ New Tag</el-button
                    >
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="small"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <el-table
            style="width: 100%"
            border
            :data="attrList"
            row-key="attr_id"
            ref="attrRef"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form
                  label-position="center"
                  inline
                  class="demo-table-expand"
                >
                  <el-row>
                    <el-tag
                      v-for="tag in scope.row.attr_vals.split(',')"
                      :key="tag"
                      closable
                      @close="deleteAttr(tag, scope.row)"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="small"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 表格 -->
    <el-dialog title="请输入名称" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="属性或参数名" :label-width="formLabelWidth">
          <el-input v-model="form.attrName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addP">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      cascaderArr: [],
      activeName: "first",
      cateGoryList: [],
      type: "many",
      cat_id: 0,
      attrList: [],
      inputVisible: false,
      inputValue: "",
      attrName: "",
      form: {},
      dialogFormVisible: false,
      formLabelWidth: "120px",
    };
  },
  created() {
    this.getAllCateGory();
  },

  methods: {
    // 获取所有分类
    async getAllCateGory() {
      let result = await this.$store.dispatch("getGoodCateGory", {
        type: "",
      });
      const {
        data,
        meta: { status, msg },
      } = result;
      if (status === 200) {
        // console.log(data);
        this.cateGoryList = data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 切换动静态参数
    handleClick(tab) {
      this.attrList = [];
      tab.name === "first" ? (this.type = "many") : (this.type = "only");
      if (this.cascaderArr.length) {
        this.getParams({ id: this.cat_id, sel: this.type });
      }
    },
    // 根据分类id获取动静态参数
    async getParams({ id, sel }) {
      let result = await this.$store.dispatch("reqGetParams", { id, sel });
      const {
        data,
        meta: { status, msg },
      } = result;
      if (status === 200) {
        // console.log(data);
        this.attrList = data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 根据所选节点获取最后一个获取参数
    getLastIndexNodeId(arr) {
      this.cat_id = arr[arr.length - 1];
      this.getParams({ id: this.cat_id, sel: this.type });
    },
    // 删除参数
    async deleteAttr(tag, row) {
      // tag删除的参数，row当前行
      const arrA = row.attr_vals.split(",");
      arrA.splice(arrA.indexOf(tag), 1);
      row.attr_vals = arrA.join();
      let result = await this.$store.dispatch("reqInsideParam", {
        attr_id: row.attr_id,
        cat_id: row.cat_id,
        attr_sel: this.type,
        attr_name: row.attr_name,
        attr_vals: row.attr_vals,
      });
      const {
        meta: { status, msg },
      } = result;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 展示输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //添加参数
    async handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        console.log(this.$refs.attrRef.data[0]);
        const arr = this.$refs.attrRef.data[0].attr_vals.split(",");
        arr.push(inputValue);
        this.$refs.attrRef.data[0].attr_vals = arr.join();
        const { attr_id, cat_id, attr_name, attr_vals } =
          this.$refs.attrRef.data[0];
        let result = await this.$store.dispatch("reqInsideParam", {
          attr_id,
          cat_id,
          attr_sel: this.type,
          attr_name,
          attr_vals,
        });
        const {
          meta: { status, msg },
        } = result;
        if (status === 200) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //添加属性或者参数
    async addP() {
      let result = await this.$store.dispatch('getCateGoryInfoById',this.cat_id);
      console.log(result);
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag + .el-tag {
  margin-top: 5px;
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
  margin-top: 5px;
}
</style>