<template>
  <!-- 返回顶部锚点 -->
  <el-backtop target="#app" :right="100" :bottom="100" v-if="true" />
  <!-- 路由 -->
  <router-view v-if="true" />

  <div class="ap" v-if="false">
    <!-- 通用 表格 -->
    <!-- <overviews-table style="width: 700px" /> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";
.ap {
  width: 100%;
  height: 100%;
  @include center;
}
</style>
