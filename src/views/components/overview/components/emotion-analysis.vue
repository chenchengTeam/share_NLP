<template>
  <!-- 情感分析 -->
  <div class="emotion-analysis">
    <coms-title :title="'情感分析：'" style="height: 30px" />

    <!-- 内容 -->
    <div class="emotion-analysis-context">
      <!-- 左 -->
      <div class="left">
        <div class="ec">
          <!-- 情感仪表盘 -->
          <qingan-ec :mark="mark" />
        </div>
      </div>

      <!-- 右 -->
      <div class="right">
        <div class="tips">情感分析说明:</div>
        <!-- 情感分析具体内容 -->
        <div class="tips-context">
          仪表盘表示整个文本的的褒贬程度，取值范围在[-10,10]，负数表示贬义的程度，负的越多，贬义程度越大，正数表示褒义的程度，正的越多，褒义程度越大
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive, onMounted, watch } from "vue";

// props传输值
const props = defineProps(["resultData"]);
const mark = ref<number>(0); // 情感分

watch(
  () => props,
  () => {
    // 情感分析 api数据
    const { emotionAnalysis } = props.resultData;
    mark.value = Number(emotionAnalysis);
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
@import "@/design/hooks";

.emotion-analysis {
  width: 100%;
  height: 100%;
  @include center;
  color: black;
  flex-direction: column;
  justify-content: flex-start;

  .emotion-analysis-context {
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
        padding-right: 200px;
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
