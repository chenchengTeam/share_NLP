// 统一管理首页相关接口
import { http1, http2 } from "@/utils/http";
// 统一管理接口
enum API {
  textSortList = "/text/category/getCategory",
  //  文本分类
  textSort = "/text/category/getClassification",
  // 词性分析
  textAnalysis = "/tokenizer/getParticipleResult",
  // 词性列表
  textType = "/tokenizer/getParticipleTypeList",
  // 实体识别
  entityAnalysis = "/name/recognition/get",
  // 情感分析
  emotionAnalysis = "/emotion/analysis/get",
  //关键词提取
  keywordExtraction = "/rs/abs/theme",
  // 文本摘要
  textAbstract = "/rs/abs/title",
  // 句法分析
  sentenceAnalysis = "/syntactic/analysis/getRelation",
  // 字体转化
  textTransfrom = "/rs/chinese/zh",
  // 事件抽取
  eventExtraction = "/ee",
  //关系抽取
  relationExtraction = "/re",
  // OCR
  ocr = "/ocr",
  // 知识图谱
  graph = "/graph/get",
}

// 首页 文本分类列表
export const getTextSortList = () =>
  http1.get<any, { [key: string]: number | string | number[] | string[] }>(
    API.textSortList
  );

// 首页 文本分类
export const getTextSort = (data: { text: string }) =>
  http1.post<any, { [key: string]: number | string | number[] | string[] }>(
    API.textSort,
    data
  );

// 词性分析
export const getTextAnalysis = (data: { text: string }) => {
  return http1.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.textAnalysis, data);
};

// 词性列表
export const getParticipleTypeList = () => {
  return http1.get<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.textType);
};

// 实体识别
export const getEntityAnalysis = (data: { text: string }) => {
  return http1.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.entityAnalysis, data);
};

// 情感分析
export const getEmotionAnalysis = (data: { text: string }) => {
  return http1.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.emotionAnalysis, data);
};

// 关键词提取
export const getKeywordExtraction = (data: { text: string }) => {
  return http1.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.keywordExtraction, data);
};

// 文本摘要
export const getTextAbstract = (data: { text: string }) => {
  return http1.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.textAbstract, data);
};

// 句法分析
export const getSentenceAnalysis = (data: { text: string }) => {
  return http1.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.sentenceAnalysis, data);
};

// 字体转换
export const getTextTransfrom = (data: { text: string; type: string }) => {
  return http1.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.textTransfrom, data);
};

// 事件抽取
export const getEventExtraction = (data: { text: string }) => {
  return http2.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.eventExtraction, data);
};

// 关系抽取
export const getRelationExtraction = (data: { text: string }) => {
  return http2.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.relationExtraction, data);
};

// ocr
export const getOCR = (data: FormData) => {
  return http2.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.ocr, data);
};

// 获取关系
export const getGraph = (data: { keyword: string }) => {
  return http1.post<
    any,
    { [key: string]: number | string | number[] | string[] }
  >(API.graph, data);
};
