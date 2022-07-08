import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Welcome from "@/components/Welcome";
import User from "@/components/Users";
import Roles from "@/components/Roles";
import Rights from "@/components/Rights";
import Goods from "@/components/Goods";
import Params from "@/components/Params";
import Categories from "@/components/Categories";
import Orders from "@/components/Orders";
import Reports from "@/components/Reports";
import Add from "@/pages/Add";
import NotFoundPage from "@/pages/NotFoundPage";
export default [
  {
    name: "login",
    path: "/login",
    component: Login,
    meta: { title: "用户登录" },
  },
  {
    name: "home",
    path: "/home",
    component: Home,
    meta: { title: "用户主页" },
    redirect: "/welcome",
    children: [
      {
        name: "welcome",
        path: "/welcome",
        component: Welcome,
        meta: { title: "欢迎来到后台管理项目 - 强仔" },
      },
      {
        name: "user",
        path: "/users",
        component: User,
        meta: { title: "用户管理 - 用户列表" },
      },
      {
        name: "roles",
        path: "/roles",
        component: Roles,
        meta: { title: "权限管理 - 角色列表" },
      },
      {
        name: "goods",
        path: "/goods",
        component: Goods,
        meta: { title: "商品管理 - 商品列表" },
      },
      {
        name: "rights",
        path: "/rights",
        component: Rights,
        meta: { title: "权限管理 - 权限列表" },
      },
      {
        name: "params",
        path: "/params",
        component: Params,
        meta: { title: "商品管理 - 分类参数" },
      },
      {
        name: "categories",
        path: "/categories",
        component: Categories,
        meta: { title: "商品管理 - 商品分类" },
      },
      {
        name: "orders",
        path: "/orders",
        component: Orders,
        meta: { title: "订单管理 - 订单列表" },
      },
      {
        name: "reports",
        path: "/reports",
        component: Reports,
        meta: { title: "数据统计 - 数据报表" },
      },
      {
        name: "add",
        path: "/goods/add",
        component: Add,
        meta: { title: "商品列表 - 添加商品" },
      },
    ],
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/404",
    component: NotFoundPage,
    hidden: true,
  },
  {
    path: "*",
    redirect: "/404",
  },
];
