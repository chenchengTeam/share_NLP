<template>
  <!-- 繁简转换 -->
  <div class="compare">
    <!-- 内容 -->
    <div class="container">
      <!-- 拼音转换器 -->
      <pinyin-conversion
        style="width: 300px; height: 50px; margin-top: 20px"
        ref="pinyinType"
        @requestApi="requestApi"
      />

      <!-- 复制按钮 -->
      <div class="right-copy" @click="copyFn">
        <global-svg name="icon-copy" size="20px" />
      </div>

      <!-- 文本区域 -->
      <div class="text-area">
        <!-- 旧文本 -->
        <div class="old-text">
          <el-input
            class="sub-input"
            v-model="textAreaInfo.input"
            style="width: 100%; height: 100%"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入需要转换字符..."
            @input="debouncedUpdateInput(textAreaInfo.input)"
            :show-word-limit="false"
          />
        </div>

        <!-- 转换文本 -->
        <div class="transform-text">
          {{ textAreaInfo.output || "暂无转换结果..." }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { byteLength } from "@/const/const.ts";
import { getTextTransfrom } from "@/api/overviews";
const pinyinType = ref<HTMLDivElement | any>(null); // pingyin选择组件

// 输入文本域信息
const textAreaInfo = reactive<{ [key: string]: any }>({
  input: `这是一段测试文本~`,
  output: ``,
});

// 复制到剪切板
const copyFn = async () => {
  await copyTextToClipboard(textAreaInfo.output);
};

// 修改 输入框
const requestApi = async (modelValue = textAreaInfo.input) => {
  const length = modelValue.length;
  if (length >= byteLength) {
    ElMessage({
      type: "error",
      message: `字符请不要超过${byteLength}个`,
    });
    textAreaInfo.input = textAreaInfo.input
      .slice(0, 2048)
      .replace(/[\n\r]+/g, "")
      .trim()
      .replace(/[\s\n\r]+/g, ""); // 截取前2048个字符
  } else {
    // console.log(" 没有超过最大值 :", textAreaInfo.input);
  }

  // 请求转换
  const { data } = await getTextTransfrom({
    text: modelValue
      .replace(/[\n\r]+/g, "")
      .trim()
      .replace(/[\s\n\r]+/g, ""),
    type: pinyinType.value.pinyinMsg,
  });
  textAreaInfo.output = data as string;
  // console.log(" pingyin选择组件 :", modelValue, pinyinType.value.pinyinMsg);
  // console.log(" 转换结果 :", data);
};

// 左侧输入内容
const debouncedUpdateInput = useDebounceFn(
  (modelValue) => requestApi(modelValue),
  100
);

// 复制函数
const copyTextToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  } else {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      // console.log("Fallback: Copying text command was " + msg);
      successful
        ? ElMessage({
            type: "success",
            message: "已复制",
          })
        : "";
    } catch (err) {
      // console.log("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
  }
};

onMounted(() => {
  // 初始化请求一次
  requestApi(textAreaInfo.input);
});
</script>

<style lang="scss">
@import "@/design/hooks.scss";

.old-text .el-textarea .el-textarea__inner {
  width: 100%;
  height: 100% !important;
  font-family: "TC-R" !important;
  color: black !important;
}
</style>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.compare {
  width: 100%;
  height: 100%;
  @include center;

  .container {
    width: 1164px;
    font-size: $base-font;
    @include center;
    flex-direction: column;

    .right-copy {
      margin-top: 10px;
      margin-right: 10px;
      margin-left: auto;
      width: 40px;
      height: 40px;
      background: rgba(5, 18, 107, 0.059);
      cursor: pointer;
      border-radius: 50%;
      @include center;
      transition: background-color 0.3s ease;
      /* 添加背景颜色变化的过渡效果 */

      .copy-icon {
        width: 15px;
        height: 15px;
        // background: url("@/assets/images/global/copy.png");
        // background: url("@/assets/svgs/copy.svg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      &:hover {
        // background-color: rgb(248, 239, 239);
        opacity: 0.8;

        .copy-icon {
          color: red;
        }
      }
    }

    .text-area {
      width: 100%;
      height: 400px;
      margin-top: 0px;
      padding: 10px;
      gap: 20px;
      @include center;

      .old-text {
        flex: 1;
        height: 100%;
      }

      .transform-text {
        font-family: "TC-R";
        padding: 10px;
        flex: 1;
        height: 100%;
        background-color: #fff;
        border-radius: 4px;
        letter-spacing: 1.5px;
        line-height: 20px;
      }
    }
  }
}
</style>
