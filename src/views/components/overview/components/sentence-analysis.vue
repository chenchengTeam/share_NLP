<template>
  <!-- 句法分析 -->
  <div class="sentence-analysis">
    <!-- 小组件 title -->
    <coms-title :title="'句法分析：'" style="height: 30px" />

    <!-- 句法分析 echarts -->
    <sentence-analysis-ec :sentenceAnalysisInfo="sentenceAnalysisInfo" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
// import { list } from "@/const/const.ts";
// props
const props = defineProps(["resultData"]);

// 句法的分析
const sentenceAnalysisInfo = reactive({
  depRelList: [], // 关系数据
  resList: [], // 具体关系
});

watch(
  () => props,
  () => {
    // 句法分析 api数据
    const { sentenceAnalysis } = props.resultData;
    const { depRelList, resList } = sentenceAnalysis;
    sentenceAnalysisInfo.depRelList = depRelList;
    sentenceAnalysisInfo.resList = resList;
    // console.log(" 句法分析 api数据 :", sentenceAnalysis);
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
.sentence-analysis {
  width: 100%;
  height: 100%;
  color: black;
}
</style>
