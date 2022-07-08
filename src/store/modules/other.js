import {
  reqMenu,
  reqOrders,
  reqReports,
  reqRights,
  reqUploadImg,
  reqWL,
  reqRoles,
  reqDeleteRol,
} from "@/api/other";
const other = {
  state: {
    menuList: [],
  },
  mutations: {
    GETMENULIST(state, menuList) {
      state.menuList = menuList;
    },
  },
  actions: {
    // 获取菜单信息
    async getMenuList({ commit }) {
      let result = await reqMenu();
      if (result.meta.status === 200) {
        commit("GETMENULIST", result.data);
      }
    },
    // 获取统计报表
    async getReports({ commit }) {
      return await reqReports();
    },
    // 获取权限列表
    async getRightList({ commit }, type) {
      return await reqRights(type);
    },
    // 用户分配权限
    async getRoles({ commit }, { id, rids }) {
      let result = await reqRoles({ id, rids });
      const {
        meta: { status },
      } = result;
      if (status === 200) {
        return "ok";
      } else {
        throw Promise.reject("失败");
      }
    },
    // 删除角色权限
    async deleteRoles({ commit }, { roleId, rightId }) {
      let result = await reqDeleteRol({ roleId, rightId });
      // console.log(result);
      const {
        meta: { status },
      } = result;
      if (status === 200) {
        return "ok";
      } else {
        throw Promise.reject("失败");
      }
    },
    // 获取订单列表
    async getOrderList({ commit }, { query, pagenum, pagesize }) {
      return await reqOrders({ query, pagenum, pagesize });
    },
    // 获取物流信息
    async getWlMsg({ commit }, id) {
      return await reqWL(id);
    },

    // 图片上传
    async getImageUrl({ commit }, file) {
      let result = await reqUploadImg(file);
      // const {
      //   data,
      //   meta: { status },
      // } = result;
      console.log(result);
    },
  },
};
export default other;
