import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store";
import "@/assets/css/iconfont.css";
import "element-ui/lib/theme-chalk/index.css";
// 全局css
import "@/assets/css/global.css";
import {
  Container,
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Submenu,
  Header,
  Main,
  Aside,
  Menu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Dialog,
  Pagination,
  Select,
  Option,
  Tag,
  Cascader,
  Loading,
  Timeline,
  TimelineItem,
  MessageBox,
  Tree,
  Carousel,
  CarouselItem,
  Image,
  Upload,
  Alert,
  Steps,
  Step,
  Tabs,
  TabPane,
  Result,
  CheckboxGroup,
  Checkbox,
  Skeleton,
  SkeletonItem,
  Notification,
  Progress,
} from "element-ui";
Vue.component(Container.name, Container);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.component(Submenu.name, Submenu);
Vue.component(Header.name, Header);
Vue.component(Main.name, Main);
Vue.use(Aside);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Pagination);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tag);
Vue.use(Cascader);
Vue.use(Loading);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Tree);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Image);
Vue.use(Upload);
Vue.use(Alert);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Result);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Skeleton);
Vue.use(SkeletonItem);
Vue.use(Progress)
Vue.config.productionTip = false;
//定义时间格式化的过滤器，用于将毫秒转换为标准格式的时间
Vue.filter("dateFormat", function (originValue) {
  //将需要过滤的日期转成日期格式
  const dt = new Date(originValue);
  //获取年份
  const y = dt.getFullYear();
  //获取月份，不足两位的前面将以0补齐
  const m = (dt.getMonth() + 1 + "").padStart(2, "0"); //+1是因为起始月从0开始
  //获取日，不足两位的前面将以0补齐
  const d = (dt.getDate() + "").padStart(2, "0");
  //小时
  const hh = (dt.getHours() + "").padStart(2, "0");
  //分钟
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  //秒
  const ss = (dt.getSeconds() + "").padStart(2, "0");
  // 返回出 年-月-日 时:分:秒
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});
new Vue({
  render: (h) => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$message = Message;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$notify = Notification
  },
}).$mount("#app");
