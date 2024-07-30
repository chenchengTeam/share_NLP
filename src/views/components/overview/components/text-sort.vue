<template>
  <!-- 文本分类 -->
  <div class="text-sort">
    <!-- 小组件 title -->
    <coms-title :title="'文本分类：'" style="height: 30px" />

    <div class="tab">
      <div
        class="tabs-item"
        :contentValue="contentValue"
        :class="{ 'tabs-item-active': index === currentIndex }"
        v-for="(i, index) in tabs"
        :key="index + '_tabs'"
      >
        {{ i?.tabsName }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getTextSort, getTextSortList } from "@/api/overviews/index.ts";
// props传输值
const props = defineProps(["resultData"]);
// 切换栏tabs 数组
const tabs = ref<{ tabsName: string }[]>([]);
// 获取api 数据
const getApiData = async () => {
  // 获取分类的列表
  const msg = (await getTextSortList()) as { [key: string]: any };
  tabs.value =
    msg.data?.map((item) => {
      return {
        tabsName: item,
      };
    }) ?? [];
};

// 当前的tabs 索引
const currentIndex = ref(-1);
// css变量 选中哪一个了
const contentValue = ref("");
// 设置 tabs 功能
const setTabsFn = (props) => {
  return new Promise((reslove, reject) => {
    // 获取api 数据
    reslove(getApiData());
  }).then(() => {
    const { currentTabsName } = props.resultData.textSort;
    contentValue.value = currentTabsName;
    const index = tabs.value.findIndex(
      (item: { tabsName: string }) => item?.tabsName === currentTabsName
    );
    currentIndex.value = index;
  });
};
// 监听props
watch(
  () => props,
  () => setTabsFn(props),
  { deep: true, immediate: true }
);
// 初始化
onMounted(() => {});
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.text-sort {
  width: 100%;
  height: 140px;
  @include center;
  flex-direction: column;
  color: black;
  justify-content: flex-start;

  .tab {
    margin-top: 30px;
    width: 100%;
    @include center;
    .tabs-item {
      width: 86px;
      height: 41px;
      font-size: 16px;
      color: #fff;
      @include center;
      background: url("@/assets/images/overviews/text-sort-bg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: relative;
    }
    .tabs-item-active::after {
      position: absolute;
      @include center;
      content: attr(contentValue);
      width: 77px;
      height: 140%;
      font-size: 18px;
      color: black;
      background: url("@/assets/images/overviews/text-sort-bg-active.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
}
</style>
