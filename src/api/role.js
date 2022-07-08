import request from "@/utils/request";

// 角色列表接口
export const reqRoles = () => {
  return request.get("roles");
};

// 根据id查询角色信息
export const reqSearchRoleById = (id) => {
  return request.get(`roles/${id}`);
};

// 添加角色信息
export const reqAddRoles = ({ roleName, roleDesc }) => {
  return request.post("roles", { roleName, roleDesc });
};

// 删除角色信息
export const reqDeleteRoles = (id) => {
  return request.delete(`roles/${id}`);
};

// 更新角色信息
export const reqUpdateRoles = ({ roleId, roleName, roleDesc }) => {
  return request.put(`roles/${roleId}`, { roleName, roleDesc });
};

// 删除角色权限
export const reqDeleteRoleRight = ({ roleId, rightId }) => {
  return request.delete(`roles/${roleId}/rights/${rightId}`);
};

// 用户角色分配权限
export const reqUserRoles = ({ roleId, rids }) => {
  return request.post(`roles/${roleId}/rights`, {
    rids,
  });
};


