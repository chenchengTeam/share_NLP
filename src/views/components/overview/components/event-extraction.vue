<template>
  <!-- 事件 抽取 -->
  <div class="event-get">
    <!-- 小组件 title -->
    <coms-title :title="'事件抽取：'" style="height: 30px" />

    <div class="event-context">
      <!-- 事件表格 -->
      <div class="event-left-table" ref="left">
        <div
          class="table"
          v-for="(item, index) in tableList"
          :key="index + '_tableList'"
        >
          <!-- 全局 通用 表格 -->
          <overviews-table :list="item" />
        </div>
      </div>

      <!-- 事件抽取说明 -->
      <div class="event-explain-right" ref="right">
        <div class="tips">事件抽取说明</div>
        <div class="tips-context">
          抽取事件名称、事件主体、事件类型、事件客体、言论内容、事发时间、事发地点、相关人物、相关地区
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { setSameHeight, recoverDivHeight } from "@/utils/hooks";
// props
const props = defineProps(["resultData"]);
const left = ref<Element | any>(null);
const right = ref<Element | any>(null);
// 映射表
const KeyMap = {
  ARG0: "施事者",
  PRED: "事件动词",
  ARG1: "受事者",
  "ARGM-TMP": "时间",
  "ARGM-LOC": "地点",
};
// 接口数据源
let tableList = ref<{ [key: string]: any }[]>([]);

// 处理数据
const dealData = (apiData: { [key: string]: any }[]) => {
  // 赋值为空
  tableList.value = [];
  // TODO: 所有数据
  const { roles } = apiData as any;
  roles.map((arr, index) => {
    tableList.value[index] = [];
    Object.keys(arr).map((key, arrIndex) => {
      if (key === "text") {
        tableList.value[index].push({
          key: "句子",
          value: arr[key],
        });
      } else {
        // 值
        const value = arr[key].join("、");
        tableList.value[index].push({
          key: KeyMap[key],
          value,
        });
      }
    });
  });

  // console.log(" tableList.value :", tableList.value);
};

onMounted(() => {
  return;
  // 恢复到初始高度
  nextTick(() => recoverDivHeight(left.value, right.value));
  // 设置 右侧div高度
  nextTick(() => setSameHeight(left.value, right.value));
});

watch(
  () => props,
  () => {
    // 事件抽取 api数据
    const { eventExtraction } = props.resultData;

    // 恢复到初始高度
    nextTick(() => recoverDivHeight(left.value, right.value));

    // 事件抽取
    dealData(eventExtraction);

    // 设置 右侧div高度
    nextTick(() => setSameHeight(left.value, right.value));
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.event-get {
  width: 100%;
  height: 100%;
  @include center;
  flex-direction: column;

  .event-context {
    width: 100%;
    height: 100%;
    @include center;
    justify-content: space-between;

    .event-left-table {
      width: 670px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .table {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .table-list {
        width: 100%;
        height: 100%;
      }
    }

    .event-explain-right {
      width: 190px;
      height: 100%;
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
