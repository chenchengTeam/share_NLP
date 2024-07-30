<!-- 树状 关系 图 -->
<template>
  <div class="qingan-ec">
    <chart-base-v3 :options="options"></chart-base-v3>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";

// props 传值
const props = defineProps({
  mark: {
    type: Number,
    default: () => 0,
  },
});

// 仪表盘
const options = reactive({
  series: [
    {
      min: -10, // 设置仪表盘的最小值为 -10
      max: 10, // 设置仪表盘的最大值为 10
      type: "gauge",
      radius: "90%",
      splitNumber: 10 * 2,
      axisLine: {
        lineStyle: {
          width: 10, // 调整轴线宽度为较小的值
          color: [
            [0.2, "#228b22"],
            [0.8, "#48b"],
            [1, "#ff4500"],
          ],
        },
      },
      pointer: {
        itemStyle: {
          color: "red",
        },
      },
      axisTick: {
        distance: -10, // 调整刻度线的距离
        length: 15,
        lineStyle: {
          color: "auto",
          width: 1,
        },
        interval: 1, // 显示所有整数刻度
      },
      splitLine: {
        distance: -10, // 调整分隔线的距离
        length: 20, // 调整分隔线的长度
        lineStyle: {
          width: 1.5,
          color: "auto",
        },
      },
      axisLabel: {
        color: "inherit",
        distance: 15, // 调整轴标签的距离
        fontSize: 9, // 适当调整轴标签的字体大小
        interval: 1, // 设置轴标签间隔为1，确保每个刻度都有标签
      },
      detail: {
        valueAnimation: true,
        formatter: "{value}",
        color: "red",
        fontSize: 20,
        offsetCenter: [0, "70%"], // 使详细信息在垂直方向上偏移至仪表盘中心的50%位置
      },
      data: [
        {
          value: props.mark,
          name: "情感分",
          title: {
            offsetCenter: [0, "-40%"],
            fontWeight: "bold",
            fontSize: 12,
          },
        },
      ],
    },
  ],
});

watch(
  () => props,
  () => {
    // 情感分析 api数据
    const { mark } = props;
    options.series[0].data[0].value = mark;
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
// 公共组件 样式
@import "@/design/hooks.scss";

.qingan-ec {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
// 公共组件 样式
@import "@/design/hooks.scss";
</style>
