import {
  requestLoginUser,
  requestUserList,
  requestAddUser,
  requestSearchUserById,
  updateUserInfo,
  deleteUserInfo,
  requestUserState,
} from "@/api/user";

import { requestUserRoles } from "@/api/role";
import router from "@/router";
import { Message } from "element-ui";
const user = {
  actions: {
    // 登录用户
    async loginUser({ commit }, { username, password }) {
      let result = await requestLoginUser({ username, password });
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200) {
        // 本地存储token
        let token = data.token;
        if (!sessionStorage.getItem("token")) {
          sessionStorage.setItem("token", token);
        }
        Message({
          message: msg || "登录成功",
          type: "success",
          duration: 1 * 1000,
        });
        router.push({ name: "home" });
      } else {
        return Message({
          message: msg || "登录失败",
          type: "error",
          duration: 1 * 1000,
        });
      }
    },
    // 获取用户列表 搜索用户列表
    async getUserList({ commit }, { query, pagenum, pagesize }) {
      return await requestUserList({ query, pagenum, pagesize });
    },
    // 添加用户
    async addUserInfo({ commit }, user) {
      return await requestAddUser(user);
    },
    // 根据id查找用户
    async findUserById({ commit }, id) {
      return await requestSearchUserById(id);
    },
    // 更新用户信息
    async upDateUserInfo({ commit }, { id, email, mobile }) {
      return await updateUserInfo({ id, email, mobile });
    },
    // 删除用户
    async deleteUser({ commit }, id) {
      let result = await deleteUserInfo(id);
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200 || status === 201) {
        Message({
          message: msg || "用户信息删除成功",
          type: "success",
          duration: 1 * 1000,
        });
        return "ok";
      } else {
        Message({
          message: msg || "用户信息删除失败",
          type: "error",
          duration: 1 * 1000,
        });
        return "error";
      }
    },
    // 改变用户状态
    async changeUserState({ commit }, { id, mg_state }) {
      return await requestUserState({ id, mg_state });
    },
    // 改变用户角色
    async changeUserRoles({ commit }, { id, rid }) {
      return await requestUserRoles({ id, rid });
    },
  },
};
export default user;
