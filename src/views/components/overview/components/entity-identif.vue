<template>
  <!-- 实体 分析 -->
  <div class="entity-identif">
    <!-- 文本加颜色分类 -->
    <word-add-color
      :data="data"
      :title="'实体识别：'"
      :tips="'实体类别图示:'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive, onMounted, watch } from "vue";

// props传输值
const props = defineProps(["resultData"]);
// 通用对象数组类型
type CommonKey = { [key: string]: any };

// 实体 分析 模拟数据
const data = reactive<CommonKey>({
  leftWords: [],
  rightWords: [],
});

// 设置 右侧词性
const setRightPartOfSpeech = (textList: CommonKey[]) => {
  if (!textList) return;
  const filterList = textList.reduce((acc: CommonKey[], current: CommonKey) => {
    // 检查 Map 中是否已经有这个 description 的对象
    if (!acc.some((obj) => obj.description === current.description)) {
      // 如果没有，添加到累加器数组中
      acc.push(current);
    }
    return acc;
  }, []);

  data.rightWords = filterList
    .map((item) => {
      if (item.description) return item;
    })
    .filter(
      (item) =>
        item != null &&
        (!Array.isArray(item) || item.length > 0) &&
        (!(typeof item === "object" && item !== null) ||
          Object.keys(item).length > 0)
    );
};

watch(
  () => props.resultData,
  () => {
    // 文本分析 api数据
    const { entityAnalysis } = props.resultData;
    if (!entityAnalysis.length) return;
    data.leftWords = entityAnalysis;
    // console.log("新的实体 分析：：：", entityAnalysis);
    // 设置词性
    setRightPartOfSpeech(entityAnalysis);
  },
  { deep: true, immediate: true }
);

onMounted(() => {});
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.entity-identif {
  width: 100%;
  height: 100%;
}
</style>
