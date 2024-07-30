<template>
  <div class="overviews-layout">
    <!-- 顶部标签 名 -->
    <coms-title :title="props.title || '默认标题' + ':'" style="height: 30px" />

    <!-- 布局内容 -->
    <div class="layout-context">
      <div class="left" ref="layoutLeft">
        <slot name="layoutLeft"></slot>
      </div>
      <div class="right">
        <slot name="layoutRight" ref="layoutRight"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
// 标题
const props = defineProps(["title"]);

onMounted(() => {
  setRightDivHeight();
});
const layoutLeft = ref<Element | any>(null);
const layoutRight = ref<Element | any>(null);
// 设置 右侧div高度
const setRightDivHeight = () => {
  return;
  nextTick(() => {
    const leftDivheight = layoutLeft.value.getBoundingClientRect().height as {
      [key: string]: any;
    };
    const rightDivheight = layoutRight.value.getBoundingClientRect().height as {
      [key: string]: any;
    };

    if (leftDivheight > rightDivheight) {
      layoutRight.value.style.height = leftDivheight + "px";
    } else {
      layoutLeft.value.style.height = rightDivheight + "px";
    }

    console.log(
      " 盒子左右 高度 :",
      leftDivheight,
      rightDivheight,
      layoutLeft.value,
      layoutRight.value,
      layoutRight.value.value
    );
  });
};
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";
.overviews-layout {
  width: 100%;
  height: 100%;
  @include center;
  flex-direction: column;
  justify-content: flex-start;
  .layout-context {
    width: 100%;
    height: 100%;
    @include center;
    justify-content: space-between;
    .left {
    }
    .right {
    }
  }
}
</style>
