<template>
  <!-- 文本摘要 -->
  <div class="text-abstract">
    <coms-title :title="'文本摘要:'" style="width: 60%; height: 30px" />

    <!-- 摘要内容 -->
    <div class="text-abstract-content">
      <div class="right-top-tabs">
        <div
          :class="[
            'tabs-item',
            currentIndex === index ? 'tabs-item-active' : '',
          ]"
          v-for="(i, index) in tabs"
          :key="index + '_tabs'"
          @click="selectTabs(i, index)"
        >
          {{ i.tabsPer }}
        </div>
      </div>

      <!-- 文本块 -->
      <div class="textArea">{{ tabs[currentIndex].text || "暂无数据" }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

// 前端定死
const tabs = ref([
  { tabsPer: "60%", text: "" },
  { tabsPer: "50%", text: "" },
  { tabsPer: "40%", text: "" },
  { tabsPer: "30%", text: "" },
  { tabsPer: "20%", text: "" },
]);

// 当前的选项
const currentIndex = ref<number>(1);

// 点击tabs
const selectTabs = (item: object, index: number) => {
  currentIndex.value = index;
};

// props值
const props = defineProps(["resultData"]);

watch(
  () => props,
  () => {
    // 文本摘要 api数据
    const { textAbstract } = props.resultData;
    // 接口数据 接入进去
    textAbstract.map((text, index) => (tabs.value[index].text = text));
    // console.log(" 文本摘要 api数据 :", textAbstract);
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
@import "@/design/hooks";

.text-abstract {
  width: 100%;
  height: 100%;

  .text-abstract-content {
    width: 100%;
    height: 100%;

    .right-top-tabs {
      width: 300px;
      height: 30px;
      @include center;
      gap: 2px;
      margin-left: auto;

      .tabs-item {
        height: 100%;
        @include center;
        flex: 1;
        font-size: 12px;
        background-color: #337ab7;
        border-color: #2e6da4;
        cursor: pointer;
        border: 3px solid transparent;
        @include cannotSelect;

        &:hover {
          background-color: rgb(47, 123, 186);
          border: 3px solid #1900ff;
        }
      }

      .tabs-item-active {
        background-color: rgb(47, 123, 186);
        // border: 3px solid #27689d;
        border: 3px solid #1900ff;
      }
    }

    .textArea {
      min-height: 100px;
      @include cannotSelect;
      width: 100%;
      padding: 20px;
      margin-top: 20px;
      font-size: 13px;
      color: #488fce;
      letter-spacing: 1.5px;
      line-height: 20px;
    }
  }
}
</style>
