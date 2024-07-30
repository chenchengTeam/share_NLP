<!-- 直线 关系图 -->
<template>
  <div class="relational-ec">
    <slot name="btn"></slot>
    <chart-base-v3 :options="options" @loadOver="loadOver"></chart-base-v3>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, reactive, watch } from "vue";
// props值
const props = defineProps({
  optionsData: {
    type: Object,
    default: () => {
      return {
        data: [],
        links: [],
        curveness: 0.35,
      };
    },
  },
});

// 关系图 ec 数据
const options = reactive<{ [key: string]: any }>({
  animationDurationUpdate: 1500,
  animationEasingUpdate: "quinticInOut",
  series: [
    {
      type: "graph", // 关系图
      layout: "none",
      roam: false,
      nodeScaleRatio: 0,
      label: {
        distance: 0,
        position: "top",
        show: true,
        offset: [0, 0],
        minMargin: 5,
        align: "center",
        verticalAlign: "top",
        backgroundColor: "#8ed6bc",
        padding: 4,
        height: 10,
        overflow: "trucate",
        ellipsis: "...",
      },
      zoom: 1,
      edgeSymbol: ["circle", "arrow"],
      edgeLabel: {
        show: true,
        fontSize: 12,
        color: "black",
        position: "middle",
        fontWeight: "bold",
        align: "center",
        lineHeight: 20,
        // padding: 5,
        formatter: (params) => {
          const { value } = params;
          return value || "默认";
        }, // 这里设置连线文字的显示格式，{c} 表示显示连接线的值
      },
      cursor: "pointer",
      bottom: -50,
      top: 150,
      left: 100,
      right: 100,
      height: 200,
      // labelLayout(params) {
      //   const { rect, labelRect } = params;
      //   const { width } = labelRect;
      //   return {
      //     moveOverlap: "shiftX",
      //     fontSize: Math.max(params.rect.width / 10, 5),
      //   };
      // },
      symbolOffset: ["0%", "0%"], // 节点标记相对于原本位置的偏移
      data: props.optionsData.data,
      // 连线的配置
      links: props.optionsData.links,
      // 指引线 俩段点和箭头的大小配置
      edgeSymbolSize: [0, 10],
      itemStyle: {
        // borderColor: "#ff0000",
      },
      // 指引线线的配置
      lineStyle: {
        opacity: 0.9,
        color: "green",
        width: 1, // 指引线粗细
        curveness: props.optionsData.curveness, // 指引线的曲率
        z: 3, // 设置曲线的 z 值，确保在节点上方
      },
    },
  ],
});

watch(
  () => props,
  () => {
    const { data, links } = props.optionsData;
    options.series[0].data = data;
    options.series[0].links = links;
  },
  { deep: true, immediate: true }
);

// echats加载完毕 回调
const emit = defineEmits(["loadOver"]);
const loadOver = (echat) => {
  emit("loadOver", echat);
};
</script>

<style scoped lang="scss">
// 公共组件 样式
@import "@/design/hooks.scss";
.relational-ec {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
