<template>
  <!-- 关键词提取 -->
  <div class="opinion-extraction">
    <coms-title :title="'关键词提取: '" style="height: 30px" />

    <!-- 内容 -->
    <div class="opinion-extraction-context">
      <!-- 左 -->
      <div class="left" ref="left">
        <div class="ec">
          <!-- 情感仪表盘 -->
          <word-cloud-ec :words="words" />
        </div>
      </div>

      <!-- 右 -->
      <div class="right" ref="right">
        <div class="tips">关键词提取说明:</div>
        <!-- 情感分析具体内容 -->
        <div class="tips-context">
          关键词提取是对文本内容进行主题分析，在准确提炼和选定反映文本主题的关键词基础上，生成文本的一组主题词标识。
          文字的大小代表了关键词的权重，将鼠标指针停留在关键词上可查看权重的值。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { setSameHeight, recoverDivHeight } from "@/utils/hooks";
// 左右div
const left = ref<Element | any>(null);
const right = ref<Element | any>(null);

const props = defineProps(["resultData"]);
const words = ref(null);
watch(
  () => props,
  () => {
    // 恢复初始高度
    // nextTick(() => recoverDivHeight(left.value, right.value));

    // 关键词提取 api数据
    const { keywordExtraction } = props.resultData;

    //  赋值
    words.value = keywordExtraction;

    // 设置 右侧div高度
    nextTick(() => setSameHeight(left.value, right.value));

    // console.log(" 关键词提取 api数据 :", keywordExtraction);
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
@import "@/design/hooks";

.opinion-extraction {
  width: 100%;
  height: 100%;
  @include center;
  color: black;
  flex-direction: column;
  justify-content: flex-start;

  .opinion-extraction-context {
    @include center;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    .left {
      width: 75%;
      @include center;
      flex-direction: column;
      justify-content: space-between;

      .tips {
        width: 100%;
        @include center;
        justify-content: flex-start;
        font-size: 12px;
      }

      .ec {
        width: 100%;
        height: 226px;
        padding-right: 20px;
        @include center;
      }
    }

    .right {
      width: 25%;
      height: 226px;
      @include center;
      flex-direction: column;
      justify-content: flex-start;

      .tips {
        width: 100%;
        @include center;
        justify-content: flex-start;
        font-size: 16px;
        color: #979797;
        font-family: "Open Sans";
        font-weight: 700;
      }

      .tips-context {
        line-height: 1.42857143;
        margin-top: 22px;
        width: 100%;
        font-size: 12px;
        font-weight: 400;
        color: #777;
      }
    }
  }
}
</style>
