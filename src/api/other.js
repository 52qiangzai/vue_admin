import request from "@/utils/request";
// 菜单接口
export const reqMenu = () => {
  return request.get("menus");
};

// 统计接口
export const reqReports = () => {
  return request.get("reports/type/1");
};

// 权限列表
export const reqRights = (type) => {
  return request.get(`rights/${type}`);
};

// 订单管理
export const reqOrders = ({ query, pagenum, pagesize }) => {
  return request.get("orders", {
    params: {
      query,
      pagenum,
      pagesize,
    },
  });
};

// 物流信息接口
export const reqWL = (id) => {
  return request.get(`kuaidi/${id}`);
};

// 图片上传接口
export const reqUploadImg = (file) => {
  return request.post("upload", file);
};
