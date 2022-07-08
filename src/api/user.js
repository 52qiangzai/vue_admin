import request from "@/utils/request";

// 登录接口
export const requestLoginUser = (userInfo) => {
  return request.post("login", userInfo);
};

// 获取用户列表
export const requestUserList = ({ query = "", pagenum, pagesize }) => {
  return request.get("users", {
    params: {
      query,
      pagenum,
      pagesize,
    },
  });
};
// 通过id搜索用户
export const requestSearchUserById = (id) => {
  return request.get(`users/${id}`);
};
// 删除用户
export const deleteUserInfo = (id) => {
  return request.delete(`users/${id}`);
};
// 添加用户
export const requestAddUser = (user) => {
  return request.post("users", user);
};

// 更新用户信息
export const updateUserInfo = ({ id, email, mobile }) => {
  return request.put(`users/${id}`, { email, mobile });
};
// 改变用户状态
export const requestUserState = ({ id, mg_state }) => {
  return request.put(`users/${id}/state/${mg_state}`);
};
