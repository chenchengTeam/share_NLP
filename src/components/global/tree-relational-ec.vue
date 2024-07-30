<!-- 树状 关系 图 -->
<template>
  <div class="tree-relational-ec">
    <chart-base-v3 :options="props.options"></chart-base-v3>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
// 关系图
const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style scoped lang="scss">
// 公共组件 样式
@import "@/design/hooks.scss";
.tree-relational-ec {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
// 公共组件 样式
@import "@/design/hooks.scss";
.tree-relational-ec {
}
</style>
