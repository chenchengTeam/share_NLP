<template>
  <!-- 关系 抽取 -->
  <div class="relation-extraction">
    <!-- 小组件 title -->
    <coms-title :title="'关系抽取：'" style="height: 30px" />

    <div class="event-context">
      <!-- 关系表格 -->
      <div class="event-left-table" ref="left">
        <div
          class="table-list"
          v-for="(item, index) in tableList"
          :key="index + '_tableList'"
        >
          <!-- 全局 通用 表格 -->
          <overviews-table :list="item" />
        </div>
      </div>

      <!-- 关系抽取说明 -->
      <div class="event-explain-right" ref="right">
        <div class="tips">关系抽取说明</div>
        <div class="tips-context">抽取人物、属性、关系</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from "vue";
import { setSameHeight, recoverDivHeight } from "@/utils/hooks";
// props
const props = defineProps(["resultData"]);
// 左右div
const left = ref<Element | any>(null);
const right = ref<Element | any>(null);
// 数据
const tableList = ref<{ [key: string]: any }[]>([]);

// 处理数据
const dealData = (relationExtraction: []) => {
  // 处理数据
  relationExtraction.map((item: { [key: string]: any }, index) => {
    const { object, predicate, subject, text } = item;
    tableList.value[index] = [
      { key: "主体", value: object },
      { key: "关系", value: predicate },
      { key: "客体", value: subject },
      { key: "句子", value: text },
    ];
  });

  // console.log("事件抽取最后数据:", tableList.value);
};

watch(
  () => props,
  () => {
    // 关系抽取 api数据
    const { relationExtraction } = props.resultData;

    tableList.value = []; //赋值为空

    // 恢复初始高度
    nextTick(() => recoverDivHeight(left.value, right.value));

    if (relationExtraction?.length > 0) {
      // 处理数据
      dealData(relationExtraction);
      // 设置 右侧div高度
      nextTick(() => setSameHeight(left.value, right.value));
    }
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";
.relation-extraction {
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

      .table-list {
        width: 100%;
        height: 100%;
        gap: 20px;
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
