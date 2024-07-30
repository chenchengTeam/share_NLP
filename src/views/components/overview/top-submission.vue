<template>
  <!-- 文本提交 -->
  <div class="text-submission">
    <el-input
      class="sub-input"
      v-model="textarea"
      style="width: 100%"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="请输入..."
      @input="debouncedUpdateInput(textarea)"
    />
    <el-button class="sub-button" type="primary" @click="subText"
      >提交文本</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { byteLength } from "@/const/const.ts";
import { useDebounceFn } from "@vueuse/core";
import {
  getTextSort,
  getTextAnalysis,
  getEntityAnalysis,
  getEmotionAnalysis,
  getKeywordExtraction,
  getTextAbstract,
  getSentenceAnalysis,
  getEventExtraction,
  getRelationExtraction,
} from "@/api/overviews/index.ts";
// 父子 事件
const emit = defineEmits(["subText"]);
// 文本
// const textarea = ref(
//   `习近平主席特使、全国人大常委会副委员长艾力更·依明巴海2019年12月10日在阿根廷首都布宜诺斯艾利斯出席阿新总统就职仪式，并于9日会见新任总统费尔南德斯。
//     艾力更·依明巴海向费尔南德斯转达了习近平主席的热烈祝贺和良好祝愿，并转交了习主席亲署函。艾力更·依明巴海表示，中方始终从战略高度和长远角度发展对阿关系，愿同阿方携手努力，加强全方位交往，推进各领域互利合作，密切人文领域交流，深化多边战略协作，推动中阿全面战略伙伴关系深入发展。`
// );

const textarea = ref(
  `除演艺事业外，李冰冰热心公益，发起并亲自参与多项环保慈善活动，积极投身其中，身体力行担起了回馈社会的责任于02年出演《少年包青天》，进入大家视线。《心理罪》是由凤凰联动影业和爱奇艺联合出品、根据作家雷米所著的同名系列小说改编而成的犯罪悬疑网络剧，由五百执导，顾小白编剧，陈若轩、付枚、王泷正、温心等联袂主演`
);

// 修改 输入框
const changeInput = (modelValue) => {
  const length = modelValue.length;
  if (length >= byteLength) {
    ElMessage({
      type: "error",
      message: `字符请不要超过${byteLength}个`,
    });
    textarea.value = textarea.value
      .slice(0, 2048)
      .replace(/[\n\r]+/g, "")
      .trim()
      .replace(/[\s\n\r]+/g, ""); // 截取前2048个字符
  } else {
    // console.log(" 没有超过最大值 :", textarea.value);
  }
};

// 更新 输入框内的内容
const debouncedUpdateInput = useDebounceFn(
  (modelValue) => changeInput(modelValue),
  100
);

// 提交文本 请求接口
const subText = async () => {
  const paramsData = textarea.value
    .replace(/[\n\r]+/g, "")
    .trim()
    .replace(/[\s\n\r]+/g, "");

  try {
    // 并行发起所有请求
    const [
      textSortData,
      textAnalysisData,
      entityAnalysisData,
      emotionAnalysisData,
      keywordExtractionData,
      textAbstractData,
      sentenceAnalysisData,
      eventExtractionData,
      relationExtractionData,
    ] = await Promise.all([
      getTextSort({ text: paramsData }),
      getTextAnalysis({ text: paramsData }),
      getEntityAnalysis({ text: paramsData }),
      getEmotionAnalysis({ text: paramsData }),
      getKeywordExtraction({ text: paramsData }),
      getTextAbstract({ text: paramsData }),
      getSentenceAnalysis({ text: paramsData }),
      getEventExtraction({ text: paramsData }),
      getRelationExtraction({ text: paramsData }),
    ]);

    // 构建结果数据集
    const resultMsg = {
      textSortData,
      textAnalysisData,
      entityAnalysisData,
      emotionAnalysisData,
      keywordExtractionData,
      textAbstractData,
      sentenceAnalysisData,
      eventExtractionData,
      relationExtractionData,
    };

    // 发送结果数据
    emit("subText", resultMsg);
  } catch (error) {
    console.error("请求接口出错:", error);
    // 处理错误
    // 可以考虑回滚或者其他处理逻辑
  }
};

onMounted(() => {});
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.text-submission {
  @include center;
  width: 100%;
  height: 100%;
  padding: 30px;
  margin-top: 50px;
  justify-content: space-around;
  flex-direction: column;
}
</style>

<style lang="scss">
.text-submission {
  .sub-input {
    width: 100%;
    height: 200px;

    > textarea {
      width: 100%;
      height: 100% !important;
      text-indent: 20px;
      letter-spacing: 1.5px;
      /* 设置缩进为20像素 */
    }
  }

  .sub-button {
    margin-left: auto;
  }
}
</style>
