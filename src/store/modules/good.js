import {
  reqGoodList,
  reqDeleteGood,
  reqGetGoodInfoById,
  reqAddGoodInfo,
} from "@/api/good";

const good = {
  actions: {
    // 获取商品数据
    async getGoodList({}, { query, pagenum, pagesize }) {
      return await reqGoodList({ query, pagenum, pagesize });
    },
    // 删除商品数据
    async deleteGoodInfo({}, id) {
      return await reqDeleteGood(id);
    },
    // 根据id查询商品基本信息
    async getGoodInfoById({}, id) {
      return await reqGetGoodInfoById(id);
    },
    // 添加商品信息
    async getAddGoodInfo({}, info) {
      return await reqAddGoodInfo(info);
    },
  },
};
export default good;
