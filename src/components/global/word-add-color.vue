<template>
  <!-- 词性分析 -->
  <div class="word-add-color">
    <!-- 小组件 title -->
    <coms-title class="word-add-color-title" :title="props.title || ''" />

    <!-- 详细的内容 -->
    <div class="word-add-color-content">
      <!-- 左 -->
      <div class="content-left" ref="leftContent" v-if="contentStatus.left">
        <div class="word">
          <div
            class="words"
            :class="i.nature"
            :title="i.description || ''"
            :style="{
              backgroundColor: i.color,
              padding: i.description ? '5px' : '0px',
            }"
            v-for="(i, index) in props.data.leftWords"
            :key="index + '_leftWords'"
          >
            {{ i.word }}
          </div>
        </div>
      </div>

      <!-- 右 -->
      <div class="content-right" ref="rightContent" v-if="contentStatus.right">
        <div class="tips">{{ props.tips || "词性类别图示:" }}</div>
        <div class="content" v-if="contentStatus.right">
          <div
            class="word"
            :class="i.nature"
            v-for="(i, index) in props.data.rightWords"
            :style="{
              backgroundColor: i.color,
              padding: i.description ? '5px' : '0px',
            }"
            :key="index + '_leftWords'"
          >
            {{ i.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch, reactive } from "vue";
import { setSameHeight, recoverDivHeight } from "@/utils/hooks";
// 内容 显示隐藏的状态
const contentStatus = reactive({ left: false, right: false });

// 传值
const props = defineProps({
  title: {
    type: String,
    default: () => "",
  },
  tips: {
    type: String,
    default: () => "",
  },
  data: {
    type: Object,
    required: false,
    default: () => ({
      leftWords: [],
      rightWords: [],
    }),
  },
});

const leftContent = ref<Element | any>(null); // 左侧div
const rightContent = ref<Element | any>(null); // 右侧div

watch(
  () => props.data,
  () => {
    // NOTE:是否显示对应的左右模块
    contentStatus.left = props.data?.leftWords?.length > 0 || false;
    contentStatus.right = props.data?.rightWords?.length > 0 || false;

    // Review：每次重新渲染即重新设置整体高度
    nextTick(() => recoverDivHeight(leftContent.value, rightContent.value));
    nextTick(() => setSameHeight(leftContent.value, rightContent.value));
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.word-add-color {
  width: 100%;
  height: 100%;
  @include center;
  color: black;
  flex-direction: column;
  justify-content: flex-start;

  .word-add-color-title {
    width: 100%;
    height: 30px;
  }

  .word-add-color-content {
    width: 100%;
    height: 100%;
    @include center;
    justify-content: space-between;

    .content-left {
      width: 680px;
      padding: 20px 20px;
      font-size: 14px;
      height: 100%;
      @include center;
      flex-wrap: wrap;
      justify-content: flex-start;
      flex-direction: column;

      .word {
        @include center;
        flex-wrap: wrap;
        width: 100%;
        justify-content: flex-start;
        gap: 5px;

        .words {
          display: inline-block;
          padding: 5px;
        }
      }
    }

    .content-right {
      @include center;
      font-size: 14px;
      width: calc(100% - 680px);
      height: auto;
      // padding: 0px 12px;
      padding: 20px 20px;
      justify-content: flex-start;
      flex-direction: column;

      .tips {
        width: 100%;
        font-size: 16px;
        color: #979797;
        height: 45px;
        @include center;
        justify-content: flex-start;
      }

      .content {
        @include center;
        width: 100%;
        height: auto;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 5px;

        .word {
          display: inline-block;
          padding: 5px 5px;
        }
      }
    }
  }
}
</style>
