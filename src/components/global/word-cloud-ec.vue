<!-- 树状 关系 图 -->
<template>
  <div class="word-cloud-ec">
    <chart-base-v3 :options="options"></chart-base-v3>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed } from "vue";

// props 传值
const props = defineProps({
  words: {
    type: Object,
    default: () => [
      { value: 50, name: "iPhone 13" },
      { value: 30, name: "VIVO" },
    ],
  },
});

// 仪表盘
const options = reactive({
  tooltip: {
    className: "word-cloud-tooltip",
    show: true,
    formatter: (params: any) => {
      const { name, value } = params;
      // 循环处理数据，展示数据
      var htmlText = `
              <div class='word-cloud-dialog'>
                <div class='keyWord'>关键词：${name}</div>
                <div class='weight'>权重：${value}</div>
              </div>`;
      return htmlText;
    },
  },
  series: [
    {
      type: "wordCloud",
      sizeRange: [16, 86],
      rotationRange: [-45, 90],
      textPadding: 0,
      autoSize: {
        enable: true,
        minSize: 6,
      },
      textStyle: {
        color: function () {
          return (
            "rgb(" +
            [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
            ].join(",") +
            ")"
          );
        },
      },
      emphasis: {
        shadowBlur: 10,
        shadowColor: "#333",
      },
      // // 渲染词典数据
      data: props.words || [],
    },
  ],
});

// 更新数据
const updateData = (words: object) => {
  options.series[0].data = Object.keys(words).map((wordsName, index) => {
    return {
      value: words[wordsName],
      name: wordsName,
    };
  });
};

// TODO: update
watch(
  () => props,
  () => {
    const { words } = props;
    updateData(words);
    // console.log(" 关键词 :", words);
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
// 公共组件 样式
@import "@/design/hooks.scss";

.word-cloud-ec {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
// 公共组件 样式
@import "@/design/hooks.scss";

.word-cloud-tooltip {
  padding: 0 !important;
  border: none !important;
  background-color: transparent !important;
  @include center;
  flex-direction: column;
}

.word-cloud-dialog {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
}
</style>
