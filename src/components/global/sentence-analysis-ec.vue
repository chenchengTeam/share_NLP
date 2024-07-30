<template>
  <!-- 句法分析 -->
  <div class="sentence-analysis-ec">
    <div class="showAll" @click="showAllReal()">显示所有关系</div>

    <div class="relation-ec-border">
      <!-- 句法分析 关系图 -->
      <relational-ec
        class="sentence-analysis-echarts"
        :optionsData="options"
        style="height: 300px"
        @loadOver="loadOver"
      >
        <!-- <template #btn>
          <div class="showAll" @click="showAllReal()">显示所有关系</div>
        </template> -->
      </relational-ec>
    </div>

    <!-- 关系 按钮 -->
    <div class="relational-buttton">
      <!-- 按钮 -->
      <div
        :class="[
          'button-item',
          currentBtnIndex === index ? 'button-item-active' : '',
        ]"
        @click="relationButtonFn(i, index)"
        v-for="(i, index) in relationButtonList"
      >
        {{ i?.buttonName || "" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, nextTick } from "vue";
// import { list as cc } from "@/const/const.ts";
// props
const props = defineProps(["sentenceAnalysisInfo"]);
// 关系按钮列表
const relationButtonList = ref<{ [key: string]: any }[]>([]);
// 当前 按钮的索引
const currentBtnIndex = ref<number>(-1);
// 关系图 ec 数据
const options = reactive<{ [key: string]: any }>({
  data: [],
  links: [],
  // 指示线 曲率
  curveness: 0.2,
});

// 所有 关系 信息
const allRealtionals = ref([]);

let allLength = 0; // 总长度

// 处理关系 数据
const dealOptionsData = (list: { [key: string]: any }[]) => {
  // 更新 options.data 的方法，确保响应性
  const updateData = () => {
    options.data = list.map(({ name, oldName, depRel }, index) => {
      const length = calculateLength(oldName); // 字符长度
      allLength += length; // 总长度
      // const currentPosition = allLength + length / 2;
      // const currentPosition = allLength + length / 2;
      // console.log("当前位置：", allLength, currentPosition);
      const ecData = {
        name,
        x: index,
        y: -30,
        symbol: "rect",
        // symbolSize: [length * 13, 20],
        label: {
          show: true,
          position: "insideTopLeft",
          formatter: (params) => {
            return [
              `{a|${params.name.replace(/_\d+\b/g, "")}}`,
              `{b|${depRel}}`,
            ].join("\n");
          },
          rich: {
            a: { color: "black" },
            b: { color: "#678f80", marginTop: 150, height: 20 },
          },
        },
        itemStyle: {
          color: "rgb(142, 214, 188)",
        },
      };
      return ecData;
    });
  };
  // 初始化时调用一次数据更新方法
  updateData();
  // 更新关系
  updateLinks(list);
};

// 更新 options.links 的方法，确保响应性
const updateLinks = (dataList) => {
  options.links = dataList.map(({ source, target, postag }, index) => ({
    source,
    target,
    value: `${postag}`,
    lineStyle: {
      curveness: source > target ? -options.curveness : options.curveness,
    },
  }));
  // console.log(" options.links  :", options.links);
};

// 关系按钮 点击 事件
const relationButtonFn = (
  { buttonName }: { [key: string]: any },
  index: number
) => {
  currentBtnIndex.value = index;
  // console.log("所有的关系", allRealtionals.value);
  const fiterList = allRealtionals.value.filter(
    (item: any) => buttonName === `${item?.postag}-${item?.depRel}`
  );

  // 更新关系
  updateLinks(fiterList);
};

// 获取数据
const getData = (resList) => {
  // 取第一句长度
  let firstSentenceIndex = props.sentenceAnalysisInfo.resList.findIndex(
    (item) => item.word === "。"
  );

  if (firstSentenceIndex === -1)
    firstSentenceIndex = props.sentenceAnalysisInfo.resList.length;

  // ec列表
  const ecList = resList
    .map(({ id, fatherId, word, depRel, postag }, index) => {
      return {
        name: `${word}_${index}`, // 名称
        source: id, // 自身id
        target: fatherId, // 目标id
        depRel, // 关系
        postag, // 类似 类名
        oldName: word,
        id: `${word}_${index}`,
      };
    })
    .slice(0, firstSentenceIndex);

  // 所有的关系集
  allRealtionals.value = ecList;

  // ec 关系按钮 初始的数据
  const initializedData = ecList.map((item) => ({
    buttonName: `${item.postag}-${item.depRel}`,
  }));
  const myMap = new Map();

  initializedData.forEach((item) => myMap.set(item.buttonName, item));
  // 关系按钮
  relationButtonList.value = Array.from(myMap.values());

  // 生成关系ec
  dealOptionsData(ecList);

  // 列表
  // console.log(" 列表 :", ecList);

  return firstSentenceIndex;
  // return 100;
};

// 显示所有的关系
const showAllReal = () => {
  // 更新关系
  updateLinks(allRealtionals.value);
};

// 图表自适应
const onResizeDiv = () => {
  const ecDiv = document.querySelector(".sentence-analysis-echarts") as
    | HTMLDivElement
    | any;

  // 句号第一次出现的位置索引
  let firstSentenceIndex = props.sentenceAnalysisInfo.resList.findIndex(
    (item) => item.word === "。"
  );

  if (firstSentenceIndex === -1)
    firstSentenceIndex = props.sentenceAnalysisInfo.resList.length;

  // 关系外框 div
  const realtionBorder = document.querySelector(".relation-ec-border");

  if (firstSentenceIndex <= 10) {
    // ecDiv.style.width = `${5 * 90}px`;
    ecDiv.style.width = `${firstSentenceIndex * 150}px`;
    realtionBorder?.classList.add("my-center");
  } else {
    ecDiv.style.width = `${firstSentenceIndex * 90}px`;
    realtionBorder?.classList.remove("my-center");
  }

  // 杨幂。
  // console.log("文本第一句长度:", firstSentenceIndex);
};

// 匹配长度
const calculateLength = (input: string): number => {
  // 使用正则表达式匹配连续的数字部分
  const digitPattern = /\d{1,2}/g; // 匹配连续的 1 到 2 个数字
  let length = 0;
  // 遍历字符串，计算长度
  let match;
  while ((match = digitPattern.exec(input)) !== null) {
    length += 1; // 每两个数字算作一个字符长度
  }
  // 普通文字部分的长度（去除数字部分后剩余的部分）
  const plainText = input.replace(digitPattern, "");
  length += plainText.length;
  return length;
};

// 加载 结束回调
const loadOver = (ecInstance: any) => {
  // console.log("ec加载完毕：：：：", ecInstance);
  ecInstance.on("click", { dataType: "node" }, (e) => {
    const { dataIndex } = e; // 第几项数据
    const { depRel, postag, id } = allRealtionals.value[dataIndex]; // 关系
    const index = relationButtonList.value.findIndex(
      (item) => item.buttonName === `${postag}-${depRel}`
    );
    console.log(" index :", `${postag}-${depRel}`, index);
    // 按钮 双向联动
    relationButtonFn({ buttonName: `${postag}-${depRel}` }, index);

    // 关系图的节点被点击时此方法被回调。
    // console.log("关系图的节点被点击时此方法被回调。", e);
  });
  ecInstance.on("click", { dataType: "edge" }, (e) => {
    // 关系图的边被点击时此方法被回调。
    console.log("关系图的边被点击时此方法被回调。", e);
  });
};
// 初始化
onMounted(() => {
  // getData();
  // 图表自适应
  // onResizeDiv();
});

watch(
  () => props,
  () => {
    // 句法分析 api数据
    const { depRelList, resList } = props.sentenceAnalysisInfo;
    // 获取 并处理api数据
    getData(resList);
    // 图表自适应
    nextTick(() => onResizeDiv());
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.sentence-analysis-ec {
  width: 100%;
  height: 100%;
  @include center;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;

  .my-center {
    @include center;
  }

  .relation-ec-border {
    width: 100%;
    height: 100%;
    overflow-x: auto;
    // @include center;
  }

  .showAll {
    z-index: 5;
    color: #376c50;
    font-size: 14px;
    cursor: pointer;
    left: 50%;
    top: 10%;
    transform: translate(-50%, -50%);
    position: absolute;
    cursor: pointer;
  }

  .relational-buttton {
    margin-top: 20px;
    width: 100%;
    @include center;
    // justify-content: flex-start;
    gap: 10px;
    flex-wrap: wrap;

    .button-item {
      white-space: nowrap;
      padding: 0px 17px;
      border: 1px solid #1b7959;
      color: #1b7959;
      line-height: 33px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }

    .button-item-active {
      background-color: #1b7959;
      color: #f0f9f6;
    }
  }
}
</style>
