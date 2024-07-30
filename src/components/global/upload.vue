<template>
  <div class="upload">
    <div
      class="image-container"
      @click="createFileInput"
      @dragover.prevent
      @drop="handleDrop"
    >
      <img class="image" :src="imageUrl" v-if="imageUrl" alt="Uploaded Image" />
      <div class="container" v-else>
        <div class="icon">
          <global-svg name="icon-add" size="20px" />
        </div>
        <div class="text">点击上传图片或拖拽到此处</div>
      </div>
    </div>

    <!-- 清空按钮 -->
    <div class="fun-button">
      <el-button @click="clear">清空</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getOCR } from "@/api/overviews";

const emit = defineEmits(["resText"]);
// TODO：链接
const imageUrl = ref<string | null>(null);
//  Input框
const fileInput = ref<HTMLInputElement | null>(null);

// 动态 创建input框
const createFileInput = () => {
  if (!fileInput.value) {
    fileInput.value = document.createElement("input");
    fileInput.value.type = "file";
    fileInput.value.style.display = "none";
    fileInput.value.addEventListener("change", handleFileUpload);
    document.body.appendChild(fileInput.value);
  }
  fileInput.value.click();
};

// TODO:上传
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const read = new FileReader();
  read.onload = (e: any) => {
    const res = e.target.result;
    // console.log("结果 :", res);
  };
  read.readAsDataURL(file);
  const fileSize = formatBytes(file.size); // 调用函数将文件大小转换为友好格式
  const index = fileSize.indexOf(" ");
  // 单位
  const unit = fileSize.slice(index + 1);
  const size = parseFloat(fileSize.substring(0, index));
  if (unit === "MB" && size >= 16)
    return ElMessage({
      type: "error",
      message: "图片尺寸过大~~",
    });

  // TODO: 上传图片
  uploadImage(file);
};

// TODO:拖拽
const handleDrop = (event: DragEvent | any) => {
  event.preventDefault();
  const file = event.dataTransfer.files?.[0];
  if (!file) return;
  uploadImage(file);
};

// TODO: 上传图片
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await getOCR(formData);
  const { data } = response;
  imageUrl.value = URL.createObjectURL(file); // 更新图片预览
  emit("resText", data);
};

// TODO: 清空
const clear = () => {
  imageUrl.value = null;
  emit("resText", [], true);
};

// TODO：显示上传图片大小
const formatBytes = (bytes, decimals = 2) => {
  // 如果字节数为0，直接返回"0 Bytes"
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.upload {
  width: 100%;
  height: 100%;
  display: flex;
  @include center;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .image-container {
    width: 150px;
    height: 150px;
    background-color: #fafafa;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #777;
    border-radius: 5px;
    border: 1px dashed #777;
    cursor: pointer;

    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px;
      position: relative;

      &:hover {
        &::after {
          content: "删除";
          display: block;
          position: absolute;
          top: 5px;
          right: 5px;
          background-color: rgba(255, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 5px;
          cursor: pointer;
          z-index: 1;
        }
      }
    }

    .container {
      width: 100%;
      height: 100%;
      @include center;
      gap: 20px;
      flex-direction: column;

      .icon {
        font-size: 30px;
      }

      .text {
        font-size: 12px;
      }
    }
  }

  .fun-button {
    width: 300px;
    @include center;
    gap: 20px;
  }
}
</style>
