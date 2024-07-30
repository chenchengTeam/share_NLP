import { createRouter, createWebHashHistory } from "vue-router";
import beforeEach from "./before-each";

const routes = [
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout/index.vue"),
    redirect: "/overview", // 重定向
    children: [
      {
        path: "overview",
        name: "overview",
        component: () => import("@/views/index.vue"),
        children: [
          {
            //TODO 繁简转换
            path: "simpletDifficultTrans",
            name: "simpletDifficultTrans",
            component: () =>
              import("@/views/components/simpletDifficultTrans/index.vue"),
          },
          {
            //TODO ocr转换
            path: "ocr",
            name: "ocr",
            component: () => import("@/views/components/ocr/index.vue"),
          },

          {
            //TODO graph
            path: "graph",
            name: "graph",
            component: () => import("@/views/components/graph/index.vue"),
            // component: () => import("@/views/components/graph/index-v3.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "any",
    redirect: "/outFactory",
  },
];

// createRouter用于创建路由器实例，可以管理多个路由
const router = createRouter({
  // 路由的模式的设置
  history: createWebHashHistory(),
  routes,
});

beforeEach(router);

export default router;
