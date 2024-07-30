import { defineAsyncComponent } from "vue";
// 获取要注册的全局组件
const components = import.meta.glob("./global/*.vue");

// 对外暴露插件
export default function install(app: any) {
  for (const [key, value] of Object.entries(components)) {
    const name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
    app.component(name, defineAsyncComponent(value as any));
  }
}