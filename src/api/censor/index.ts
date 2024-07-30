// 统一管理首页相关接口
import { http1 } from "@/utils/http";
// 统一管理接口
enum API {
  // 左侧
  MAIN_LEFT = "/text/category/getClassification",
}

// 顶部导航
export const getTextSort = (data) =>
  http1.post<any, { [key: string]: number | string | number[] | string[] }>(
    API.MAIN_LEFT
  );
