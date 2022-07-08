// 商品列表api
import request from "@/utils/request";

// 获取商品列表
export const reqGoodList = ({ query, pagenum, pagesize }) => {
  return request.get("goods", {
    params: {
      query,
      pagenum,
      pagesize,
    },
  });
};

// 删除商品信息
export const reqDeleteGood = (id) => {
  return request.delete(`goods/${id}`);
};

// 根据id查询商品信息
export const reqGetGoodInfoById = (id) => {
  return request.get(`goods/${id}`);
};

// 更新商品信息
export const reqUpdateGoodInfo = (id, goodsBaseInfo) => {
  return request.put(`goods/${id}`, goodsBaseInfo);
};

// 添加商品
export const reqAddGoodInfo = (info) => {
  return request.post("goods", info);
};
