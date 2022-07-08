import {
  reqGoodCategory,
  reqCateGoryById,
  reqUpdateCateGoryInfo,
  deleteCateGoryById,
  reqAddCateGoryInfo,
  reqGetParamList,
  reqDeleteParamInfo,
  reqInsideParamInfo,
} from "@/api/category";
const category = {
  actions: {
    // 获取商品分类
    async getGoodCateGory({}, { type, pagenum, pagesize }) {
      return await reqGoodCategory({ type, pagenum, pagesize });
    },
    // 根据id获取分类信息
    async getCateGoryInfoById({}, id) {
      return await reqCateGoryById(id);
    },
    // 更新分类信息
    async updateCateGory({}, { id, cat_name }) {
      return await reqUpdateCateGoryInfo({ id, cat_name });
    },
    // 删除分类信息
    async reqDeleteCateGory({ commit }, id) {
      return await deleteCateGoryById(id);
    },
    // 添加分类
    async reqAddCateGoryMsg({ commit }, info) {
      return await reqAddCateGoryInfo(info);
    },

    // 获取分类参数
    async reqGetParams({}, { id, sel }) {
      return await reqGetParamList({ id, sel });
    },
    // 删除参数
    async reqDeleteParam({}, { id, attrid }) {
      return await reqDeleteParamInfo({ id, attrid });
    },
    // 删除动静态内部tag
    async reqInsideParam(
      {},
      { attr_id, cat_id, attr_sel, attr_name, attr_vals }
    ) {
      return await reqInsideParamInfo({
        attr_id,
        cat_id,
        attr_sel,
        attr_name,
        attr_vals,
      });
    },
  },
};
export default category;
