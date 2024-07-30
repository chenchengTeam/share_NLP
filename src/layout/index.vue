<script setup lang="ts">
import { ref } from "vue";
import Nav from "./components/nav.vue";
</script>

<template>
  <div class="layout">
    <!-- 顶部 -->
    <Nav class="layout-nav" />

    <!-- 内容 -->
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
@import "@/design/hooks.scss";
.layout {
  width: 100%;
  @include center;
  flex-direction: column;
  justify-content: flex-start;
  background-color: rgb(228, 230, 233);

  .layout-nav {
    height: 45px;
  }
}
</style>
