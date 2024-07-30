<template>
  <!-- 通用 表格 -->
  <div class="common-table">
    <div class="header">
      <div class="key">项目</div>
      <div class="value">值</div>
    </div>

    <div class="table-list">
      <div
        class="list-item"
        v-for="(i, index) in tableInfo.list"
        :key="index + '_list_item'"
      >
        <div class="key">{{ i?.key }}</div>
        <div class="value">{{ i?.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
// 表格 类型
interface List {
  key: string;
  value: string;
}

const props = defineProps({
  headers: {
    type: Array,
    default: () => ["项目", "值"],
  },
  list: {
    type: Array as () => List[],
    default: () => [
      {
        key: "默认key值",
        value: "默认vlaue值",
      },
    ],
  },
});

// 表格 信息
const tableInfo = reactive<{
  list: List[];
  headers: string[];
}>({
  list: [],
  headers: [],
});

watch(
  () => props,
  () => {
    // console.log(" 表格 :", props);
    if (!props?.list) return;
    tableInfo.list = props.list as List[];
    tableInfo.headers = props.headers as string[];
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.common-table {
  width: 100%;
  @include center;
  flex-direction: column;
  border: 1px solid #ddd;

  .header {
    width: 100%;
    @include center;
    width: 100%;

    > div {
      font-size: 13px;
      @include center;
      justify-content: flex-start;
      height: 35px;
      color: black;
      font-weight: bold;
      padding: 8px;
    }

    .key {
      width: 200px;
    }

    .value {
      border-left: 1px solid #ddd;
      width: calc(100% - 200px);
    }
  }

  .table-list {
    width: 100%;

    .list-item {
      @include center;
      justify-content: flex-start;
      border-top: 1px solid #ddd;
      color: black;
      // 对偶数行应用背景色
      &:nth-child(even) {
        background-color: #f6f6f6;
      }

      .key {
        padding: 8px;
        width: 200px;
        font-family: "Open Sans";
        font-size: 13px;
      }

      .value {
        line-height: 1.42857143;
        padding: 8px;
        font-family: "Open Sans";
        font-size: 13px;
        width: calc(100% - 200px);
        border-left: 1px solid #ddd;
      }
    }
  }
}
</style>
