<style scoped lang="scss">
@import "@/design/hooks.scss";

.overview {
  width: 100%;
  // height: auto;
  height: 100%;

  min-height: 1080px;
  @include center;
  flex-direction: column;
  position: relative;
  justify-content: flex-start;
  // overflow: auto;

  .overview-top {
    width: 1164px;
    height: auto;

    .overview-sub {
      width: 100%;
      height: 331px;
      background-color: #f6f6f6;
    }
  }

  .overview-container {
    width: 1164px;
    // height: auto;
    height: 100%;

    .container-result {
      width: 100%;
      // height: auto;
      height: 100%;
    }
  }
}
</style>

<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  ref,
  reactive,
  onMounted,
  watch,
  nextTick,
  defineAsyncComponent,
} from "vue";
import TopSub from "./components/overview/top-submission.vue";
import OverviewPartingLine from "./components/overview/line.vue";
import Loading from "./components/loading.vue";
import directiveVue from "./components/overview/result.vue";
//  Review: 异步引入
// const Result = defineAsyncComponent(
//   () => import("./components/overview/result.vue")
// );

const Result = defineAsyncComponent({
  loader: () => import("./components/overview/result.vue"),
  // loader: () =>
  //   new Promise((resolve, reject) =>
  //     setTimeout(() => {
  //       resolve(directiveVue);
  //     }, 1000)
  //   ),
  // 加载异步组件时要使用的组件
  loadingComponent: Loading,
  // 加载失败时要使用的组件
  // errorComponent: ErrorComponent,
  // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
  delay: 10000,
});

// 是否有返回接口 判断字符
const haveResult = ref(false);

// NOTE：分割线
const partLineDiv = ref<HTMLDivElement | any>();

// 分析的结果
const resultData = reactive({
  // 文本分类
  textSort: {
    currentTabsName: "",
  },
  // 词性分析
  textAnalysis: {},
  // 实体识别
  entityAnalysis: {},
  // 情感分析
  emotionAnalysis: {},
  // 关键词提取
  keywordExtraction: {},
  // 摘要提取
  textAbstract: {},
  // 句法分析
  sentenceAnalysis: {},
  // 事件抽取
  eventExtraction: {},
  // 关系抽取
  relationExtraction: {},
});

// 提交 文本
const subText = (resultMsg: { [key: string]: any }) => {
  // 接口返回 所有的结果数据集
  const {
    textSortData,
    textAnalysisData,
    entityAnalysisData,
    emotionAnalysisData,
    keywordExtractionData,
    textAbstractData,
    sentenceAnalysisData,
    eventExtractionData,
    relationExtractionData,
  } = resultMsg;

  ElMessage({ type: "success", message: "接口请求成功~" }); // TIPS

  // 当前的反馈的 tabs
  resultData.textSort.currentTabsName = textSortData.data;
  resultData.textAnalysis = textAnalysisData.data;
  resultData.entityAnalysis = entityAnalysisData.data;
  resultData.emotionAnalysis = emotionAnalysisData.data;
  resultData.keywordExtraction = keywordExtractionData.data;
  resultData.textAbstract = textAbstractData.data;
  resultData.sentenceAnalysis = sentenceAnalysisData.data;
  resultData.eventExtraction = eventExtractionData.data;
  resultData.relationExtraction = relationExtractionData.data;

  // Review:是否加载完毕
  haveResult.value =
    textSortData &&
    textAnalysisData &&
    entityAnalysisData &&
    emotionAnalysisData &&
    keywordExtractionData &&
    textAbstractData &&
    sentenceAnalysisData &&
    eventExtractionData &&
    relationExtractionData
      ? true
      : false;

  nextTick(() => {
    // console.log(
    //   " 数据div :",
    //   resultData,
    //   isOverViews.value,
    //   haveResult.value
    // );

    const partLineDiv = document.querySelector(".partLine") as
      | HTMLDivElement
      | any;

    // NOTE: 滚动到指定位置
    partLineDiv?.scrollIntoView({ block: "start", behavior: "smooth" });
  });
};

// 是否是首页
const isOverViews = ref(false);
// 路由 信息
const route = useRoute();

watch(
  () => route,
  (to, from) => {
    // 是否为首页  首页显示首页内容
    isOverViews.value = to.name === "overview";
    // 结果清空
    haveResult.value = false;
  },
  { deep: true, immediate: true }
);
// 初始化
onMounted(() => {});
</script>

<template>
  <!--TODO overview 首页 -->
  <div class="overview">
    <!-- 顶部 文本域提交区域 -->
    <div class="overview-top" v-if="isOverViews">
      <!-- 文本提交 -->
      <TopSub class="overview-sub" @subText="subText" />
    </div>

    <!--TODO 提交 解析 结果区域 -->
    <div class="overview-container" v-if="haveResult && isOverViews">
      <!-- <div class="overview-container"> -->
      <!-- 分析结构 分割线 -->
      <OverviewPartingLine class="partLine" ref="partLineDiv" />
      <!-- 详细的内容 -->
      <Result :resultData="resultData" class="container-result"></Result>
    </div>

    <!--TODO 其他模块 -->
    <router-view />
  </div>
</template>
