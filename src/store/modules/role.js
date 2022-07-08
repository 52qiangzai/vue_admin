import {
  reqAddRoles,
  reqDeleteRoles,
  reqRoles,
  reqUpdateRoles,
  reqSearchRoleById,
  reqDeleteRoleRight,
  reqUserRoles,
} from "@/api/role";
const role = {
  actions: {
    // 获取角色信息
    async getRoleInfo({ commit }) {
      return await reqRoles();
    },
    // 根据id查询角色信息
    async getRoleById({ commit }, id) {
      return await reqSearchRoleById(id);
    },
    // 添加角色信息
    async addRoleInfo({}, { roleName, roleDesc }) {
      return await reqAddRoles({ roleName, roleDesc });
    },
    // 删除角色信息
    async deleteRoleInfo({}, id) {
      return await reqDeleteRoles(id);
    },
    // 更新角色信息
    async updateRoleInfo({}, roleInfo) {
      return await reqUpdateRoles(roleInfo);
    },
    // 删除角色指定权限
    async deleteRoleRight({}, { roleId, rightId }) {
      return await reqDeleteRoleRight({ roleId, rightId });
    },
    // 分配角色授权
    async addRoleRights({}, { roleId, rids }) {
      return await reqUserRoles({ roleId, rids });
    },
  },
};
export default role;
