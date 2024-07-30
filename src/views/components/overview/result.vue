<template>
  <!-- 分析结果 -->
  <div class="result">
    <!-- 左侧affix组件 -->
    <el-affix target=".overview-container" :offset="50">
      <div class="left-tabs">
        <!-- 左侧内容 -->
        <div
          @click="jumpToPosition(i, index)"
          class="tabs-item"
          :sort="index"
          :class="{ 'tabs-item-active': index === leftSelectedIndex }"
          v-for="(i, index) in leftTabs"
          :key="index + '_leftTabs'"
        >
          {{ i.name }}
        </div>
      </div>
    </el-affix>

    <!-- 右侧 内容 -->
    <div class="right-context">
      <div
        v-for="(i, index) in leftTabs"
        :id="i.id"
        :sort="index"
        :key="index + '_right_context'"
        :class="i.id"
        class="context-item"
      >
        <component :resultData="props.resultData" :is="i.component" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import { ref, onMounted, shallowRef, defineAsyncComponent } from "vue";

//  Review: 异步引入
const TextSort = defineAsyncComponent(
  () => import("./components/text-sort.vue")
);
const WordAnalysis = defineAsyncComponent(
  () => import("./components/word-analysis.vue")
);
const EntityIdentif = defineAsyncComponent(
  () => import("./components/entity-identif.vue")
);
const EmotionAnalysis = defineAsyncComponent(
  () => import("./components/emotion-analysis.vue")
);
const KeyWordExtraction = defineAsyncComponent(
  () => import("./components/keywords-extraction.vue")
);
const TextAbstract = defineAsyncComponent(
  () => import("./components/text-abstract.vue")
);
const SentenceAnalysis = defineAsyncComponent(
  () => import("./components/sentence-analysis.vue")
);
const EventExtraction = defineAsyncComponent(
  () => import("./components/event-extraction.vue")
);
const RelationExtraction = defineAsyncComponent(
  () => import("./components/relation-extraction.vue")
);
// props传输值
const props = defineProps(["resultData"]);

// 左侧列表
const leftTabs = ref<{ [key: string]: any }[]>([
  {
    name: "文本分类",
    id: "overview-文本分类",
    component: shallowRef(TextSort),
  },
  {
    name: "词性分析",
    id: "overview-词性分析",
    component: shallowRef(WordAnalysis),
  },
  {
    name: "实体识别",
    id: "overview-实体识别",
    component: shallowRef(EntityIdentif),
  },
  {
    name: "情感分析",
    id: "overview-情感分析",
    component: shallowRef(EmotionAnalysis),
  },
  {
    name: "关键词提取",
    id: "overview-关键词提取",
    component: shallowRef(KeyWordExtraction),
  },
  {
    name: "文本摘要",
    id: "overview-文本摘要",
    component: shallowRef(TextAbstract),
  },

  {
    name: "句法分析",
    id: "overview-句法分析",
    component: shallowRef(SentenceAnalysis),
  },

  {
    name: "事件抽取",
    id: "overview-事件抽取",
    component: shallowRef(EventExtraction),
  },

  {
    name: "关系抽取",
    id: "overview-关系抽取",
    component: shallowRef(RelationExtraction),
  },
]);

onMounted(async () => {
  // 滚动检测
  window.addEventListener("scroll", () => debouncedSelectTabs(), true);
});

// 当前选中的index
const leftSelectedIndex = ref(0);

// 元素是否在移动中
const isMoving = ref(false);

// 跳转至 指定的锚点位置
const jumpToPosition = (item: { [key: string]: any }, index: number) => {
  isMoving.value = true;
  const rightDiv = document.querySelector(`#${item.id}`);
  rightDiv?.scrollIntoView({ block: "start", behavior: "smooth" });
  leftSelectedIndex.value = index;
  // 可以进行 滚动了
  useDebounceFn(() => (isMoving.value = false), 800)();
};

// 判断选中的菜单
const judegeSelectedMenu = () => {
  if (isMoving.value) return;
  const menu = document.querySelector(".right-context") as Element;
  if (!menu.children) return;
  const childArr = Array.from(menu?.children);
  const winInnerHeight = window.innerHeight;
  const flagHeight = winInnerHeight / 5;
  const near = childArr.reduce((prev, curr) => {
    const { top: prevTop } = prev.getBoundingClientRect();
    const { top: currTop } = curr.getBoundingClientRect();
    return Math.abs(currTop - flagHeight) < Math.abs(prevTop - flagHeight)
      ? curr
      : prev;
  });
  const index: number = Number(near.getAttribute("sort") || 0);
  leftSelectedIndex.value = index;
  // console.log(" 滚动信息 :", index, near);
};

// 进行防抖处理 再次进入
const debouncedSelectTabs = useDebounceFn(() => judegeSelectedMenu(), 10);
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.result {
  width: 100%;
  height: 100%;
  @include center;
  justify-content: space-between;
  font-family: "TC-R";

  .right-context {
    width: 940px;
    height: 100%;
    gap: 20px;
    @include center;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 400px;

    .context-item {
      width: 100%;
      height: 100%;
      min-height: 200px;
      background-color: $white-background-color1;
      color: #fff;
      font-size: 20px;
      padding: 30px 20px;
    }
  }
}
</style>
<style lang="scss">
@import "@/design/hooks.scss";

// 左侧 锚点
.result .el-affix {
  width: 200px;
  margin-bottom: auto;

  .left-tabs {
    width: 200px;
    background-color: $white-background-color1;
    @include center;
    justify-content: flex-start;
    flex-direction: column;
    margin-bottom: auto;
    padding: 20px;
    gap: 10px;

    .tabs-item {
      width: 100%;
      height: 33px;
      @include center;
      position: relative;

      &:hover {
        color: $white;
        background-color: rgb(66, 142, 185);
        cursor: pointer;
      }
    }

    .tabs-item-active {
      color: $white;
      background-color: rgb(66, 142, 185);
    }

    .tabs-item::after {
      position: absolute;
      content: "";
      bottom: -5px;
      width: 100%;
      height: 1px;
      background-color: $white-background-color2;
    }
  }

  .left-tabs :last-child::after {
    display: none;
  }
}
</style>
