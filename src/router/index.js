import { Message } from "element-ui";
import vue from "vue";
import VueRouter from "vue-router";
vue.use(VueRouter);
// 引入路由组件
import routes from "./routes";

// 先把VueRouter原型对象上的push保存一份
let originPush = VueRouter.prototype.push;
// 简写
VueRouter.prototype.push = function (location) {
  return originPush.call(this, location).catch((error) => error);
};
const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior() {
    //函数拥有 to和from参数
    //可以通过 return {x:0,y:0} 来控制滚动条
    //console.log(arguments)
    return { x: 0, y: 0 };
  },
});

// 路由导航守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta?.title || "404";
  // 如果用户直接访问登录界面可以直接放行
  if (to.name === "login") {
    if (sessionStorage.getItem("token")) {
      Message({
        type: "warning",
        message: "当前已登录，请先退出登录后，再重新登陆",
      });
      return next("/home");
    } else {
      return next();
    }
  }
  // 验证本地是否有token
  if (!sessionStorage.getItem("token")) {
    Message({
      type: "error",
      message: "身份验证失败,请重新登录",
    });
    return next("/login");
  }

  next();
});

export default router;
