<template>
  <!-- ocr识别 -->
  <div class="ocr">
    <div class="container">
      <!-- 上传图片 -->
      <upload ref="upoloadComs" class="ocr-upload" @resText="resText" />

      <!-- 识别文本 -->
      <div class="ocr-text" v-if="textList.length">
        <div class="text-list" v-for="(t, index) in textList">
          {{ `${index + 1}: ${t}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
const upoloadComs = ref<HTMLHtmlElement>(); // 上传upload div
const textList = ref<string[]>([]); // 接口返回的文本
const resText = (res: string[] | any, isClear = false) => {
  if (isClear) {
    textList.value = [];
    return;
  }
  const { texts } = res || { texts: [] };
  textList.value = texts;
  textList.value.length
    ? ElMessage({
        type: "success",
        message: "OCR转换成功",
      })
    : ElMessage({
        type: "error",
        message: "OCR识别转换失败",
      });
};
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.ocr {
  width: 100%;
  @include center;
  margin-bottom: 20px;

  .container {
    width: 1164px;
    font-size: $base-font;
    flex-direction: column;
    @include center;

    .ocr-upload {
      margin-top: 20px;
      background-color: #d4d3d3;
      padding: 20px;
    }

    .ocr-text {
      margin-top: 20px;
      width: 100%;
      font-size: $base-font;
      @include center;
      flex-direction: column;
      gap: 10px;
      background-color: #d4d3d3;
      padding: 10px;
      .text-list {
        padding-left: 20px;
        width: 100%;
        height: 30px;
        @include center;
        justify-content: flex-start;
        color: black;
        letter-spacing: 1.5px;
        position: relative; /* 确保容器是相对定位，以便绝对定位的伪元素可以相对于其进行定位 */

        &:not(:last-child)::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%; /* 底部线条宽度与容器宽度相同 */
          height: 1px; /* 底部线条高度 */
          background-color: black; /* 底部线条颜色 */
          transform: scaleY(0.5); /* 缩放高度为原始的0.5倍 */
        }
      }
    }
  }
}
</style>
