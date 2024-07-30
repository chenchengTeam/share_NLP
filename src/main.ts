import { createApp } from "vue";
import "reset.css";
import App from "./App.vue";
// 导入路由组件
import router from "@/layout/router";
// 配置国际化
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
// 引入自定义插件对象：注册整个项目的全局组件
import globalComponents from "@/components";
//公共样式
import "@/design/index.scss";
// 导入仓库
import pinia from "@/store";
import { addDirective } from "@/directives/index";
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "virtual:svg-icons-register";

// 获取应用实例对象
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 获取应用实例对象
addDirective(app);
app.use(router);
app.use(globalComponents); // 安装全局路由组件
app.use(pinia); // 注册全局仓库
app.use(ElementPlus, { locale: zhCn }); // 配置中文国际化
app.mount("#app");
