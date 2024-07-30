<template>
  <!-- 词性分析 -->
  <div class="word-analysis">
    <!-- 文本加颜色分类 -->
    <word-add-color :data="data" :title="'词性分析:'" :tips="'词性类别图示:'" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive, onMounted, watch } from "vue";
// 通用对象数组类型
type CommonKey = { [key: string]: any };

// props传输值
const props = defineProps(["resultData"]);

// 词性分析 模拟数据
const data = reactive<CommonKey>({
  leftWords: [],
  rightWords: [],
});

// 设置 右侧词性
const setRightPartOfSpeech = (textList: CommonKey[]) => {
  data.rightWords = textList.reduce((acc: CommonKey[], current: CommonKey) => {
    // 检查 Map 中是否已经有这个 description 的对象
    if (!acc.some((obj) => obj.description === current.description)) {
      // 如果没有，添加到累加器数组中
      acc.push(current);
    }
    return acc;
  }, []);
};

watch(
  () => props.resultData,
  () => {
    // TODO: 文本分析 api数据 长度不够直接return
    const { textAnalysis } = props.resultData;
    if (!textAnalysis.length) return;
    data.leftWords = textAnalysis;
    // 设置词性
    setRightPartOfSpeech(textAnalysis);

    // console.log("文本分析 api数据-文本分析 api数据");
  },
  { deep: true, immediate: true }
);

onMounted(() => {});
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.word-analysis {
  width: 100%;
  height: 100%;
}
</style>
