import request from "@/utils/request";
// 获取商品分类
export const reqGoodCategory = ({ type = "", pagenum = "", pagesize = "" }) => {
  return request.get("categories", {
    params: {
      type,
      pagenum,
      pagesize,
    },
  });
};

// 根据id获取分类信息
export const reqCateGoryById = (id) => {
  return request.get(`categories/${id}`);
};

// 更新分类信息
export const reqUpdateCateGoryInfo = ({ id, cat_name }) => {
  return request.put(`categories/${id}`, { cat_name });
};

// 删除分类
export const deleteCateGoryById = (id) => {
  return request.delete(`categories/${id}`);
};

// 添加分类
export const reqAddCateGoryInfo = (info) => {
  return request.post("categories", info);
};

// 分类参数列表
export const reqGetParamList = ({ id, sel }) => {
  return request.get(`categories/${id}/attributes`, {
    params: {
      sel,
    },
  });
};

// 删除参数
export const reqDeleteParamInfo = ({ id, attrid }) => {
  return request.delete(`categories/${id}/attributes/${attrid}`);
};

// 删除/添加tag动静态参数
export const reqInsideParamInfo = ({
  attr_id,
  cat_id,
  attr_sel,
  attr_name,
  attr_vals,
}) => {
  return request.put(`categories/${cat_id}/attributes/${attr_id}`, {
    attr_sel,
    attr_name,
    attr_vals,
  });
};
