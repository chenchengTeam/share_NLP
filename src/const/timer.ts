// 全局 请求接口频率 时间表
const apiTimerMap = {
  t1: 10 * 1000,
  t2: 60 * 1000,
  t3: 60 * 60 * 1000,
};

// echarts 轮播  时间表
const loopEventTimerMap = {
  t1: 1 * 1000,
  t2: 2 * 1000,
  t3: 3 * 1000,
};

export { apiTimerMap, loopEventTimerMap };
