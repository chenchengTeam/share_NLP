<template>
  <div class="title">
    {{ props.title || "" }}
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const props = defineProps(["title"]);
</script>

<style scoped lang="scss">
// 公共组件 样式
@import "@/design/hooks.scss";
.title {
  width: 100%;
  height: 100%;
  @include center;
  justify-content: flex-start;
  font-size: 14px;
  color: black;
}
</style>
