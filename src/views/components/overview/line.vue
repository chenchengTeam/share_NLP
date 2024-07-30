<template>
  <div class="overview-parting-line">
    <div class="left-tips">分析结果</div>
    <el-divider content-position="right"></el-divider>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";
.overview-parting-line {
  @include center;
  width: 100%;
  color: #565656;
  padding: 20px;
  justify-content: flex-start;

  .left-tips {
    white-space: nowrap;
    width: auto;
    height: 100%;
    font-size: 24px;
    padding-right: 20px;
    @include center;
    justify-content: flex-start;
  }
}
</style>
