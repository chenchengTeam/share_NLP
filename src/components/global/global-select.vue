<template>
  <div class="global-select">
    <el-select
      v-model="selectValue"
      :remote="true"
      remote-show-suffix
      filterable
      clearable
      reserve-keyword
      placeholder="搜索卫星"
      :remote-method="remoteMethod"
      style="width: 240px"
      :suffix-icon="Search"
      @change="selectValueFn"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";

interface ListItem {
  value: string;
  label: string;
}

const emit = defineEmits(["searchFn"]);
// props 值
const props = defineProps({
  selectList: {
    type: Array,
    default: () => [],
  },
});

// 列表
const list = ref<{ [key: string]: any }>([]);
// 选项 延迟查找
const options = ref<ListItem[]>([]);
// 筛选值
const selectValue = ref<string[]>([]);

// 搜索过后显示的 fn
const remoteMethod = (query: string) => {
  // 是否有搜索值
  if (query) {
    options.value = list.value.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  } else {
    options.value = [];
  }
};

// 选中其中一值
const selectValueFn = () => {
  // 回传选中的id 或 唯一值
  selectValue ? emit("searchFn", selectValue) : null;
};

// 初始化数据
const initList = (props: { [key: string]: any }) => {
  // 筛选的列表
  const { selectList } = props;
  list.value = selectList.map((item) => {
    return { value: `value:${item}`, label: `${item}` };
  });
};

watch(
  () => props,
  () => {
    // 初始化数据
    initList(props);
  },
  { deep: true, immediate: true }
);

onMounted(() => {});
</script>
<style scoped lang="scss">
@import "@/design/hooks.scss";
.global-select {
  width: 100%;
  height: 100%;
  @include center;
}
</style>
