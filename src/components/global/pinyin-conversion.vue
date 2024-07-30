<template>
  <!-- 拼音转换器 组件 -->
  <div class="pinyin-conversion">
    <!-- 左侧下拉框 -->
    <div class="left-select">
      <el-dropdown @command="selectFn">
        <span class="el-dropdown-link">
          {{ selectInfo.list[selectInfo.currentLeftIndex].type }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              :command="{ type: 'left', i, index }"
              v-for="(i, index) in selectInfo.list"
              >{{ i.type }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="icon" @click="changeTransform"></div>

    <!-- 右侧下拉框 -->
    <div class="right-select">
      <el-dropdown @command="selectFn">
        <span class="el-dropdown-link">
          {{ selectInfo.list[selectInfo.currentRightIndex].type }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              :command="{ type: 'right', i, index }"
              v-for="(i, index) in selectInfo.list"
              >{{ i.type }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { pinyinMap } from "@/const/const.ts";
const emit = defineEmits(["requestApi"]);
// 下拉框信息
const selectInfo = reactive({
  list: [
    { type: "简体" },
    { type: "繁体" },
    { type: "台湾繁体" },
    { type: "香港繁体" },
  ],
  currentLeftIndex: 0,
  currentRightIndex: 1,
});

// 翻译  反转 转换
const changeTransform = () => {
  const lIndex = selectInfo.currentLeftIndex;
  const rIndex = selectInfo.currentRightIndex;
  selectInfo.currentRightIndex = lIndex;
  selectInfo.currentLeftIndex = rIndex;
  // 请求数据
  emit("requestApi");
};

// 转换后端字节
const transformByte = computed(
  () =>
    pinyinMap[
      `${selectInfo.list[selectInfo.currentLeftIndex].type}转${
        selectInfo.list[selectInfo.currentRightIndex].type
      }`
    ]
);

// 下拉框按键功能
const selectFn = (info) => {
  const { type, i, index } = info;
  if (type == "left") {
    if (index === selectInfo.currentRightIndex)
      return ElMessage({
        type: "error",
        message: "转义字符不能相同!!!",
      });
    selectInfo.currentLeftIndex = index;
  } else {
    if (index === selectInfo.currentLeftIndex)
      return ElMessage({
        type: "error",
        message: "转义字符不能相同!!!",
      });
    selectInfo.currentRightIndex = index;
  }

  // 请求数据
  emit("requestApi");
};

// 保留 转换 组合byte
defineExpose({ pinyinMsg: transformByte });
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.pinyin-conversion {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  @include center;
  justify-content: space-evenly;

  .left-select {
    @include center;
    min-width: 100px;
  }
  .right-select {
    @include center;
    min-width: 100px;
  }

  .icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    background: url("@/assets/images/global/transform.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
