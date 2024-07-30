/**
 *  @Author: cc
 *  @description: 设置盒子高度以两者最高高度为准
 *  @param {  2个div盒子  }
 *  @return { 无  }
 */
export const setSameHeight = (div1: HTMLElement, div2: HTMLElement): void => {
  // console.log(" div1 :", div1, div2);
  if (!div1 || !div2) return;
  const leftDivheight = div1.getBoundingClientRect().height;
  const rightDivheight = div2.getBoundingClientRect().height;
  if (leftDivheight > rightDivheight) {
    div2.style.height = leftDivheight + "px";
  } else {
    div1.style.height = rightDivheight + "px";
  }
  // console.log(
  //   "左侧：",
  //   leftDivheight,
  //   div1,
  //   "\n",
  //   "右侧：",
  //   rightDivheight,
  //   div2
  // );
};

/**
 *  @Author: cc
 *  @description: 恢复到初始高度
 *  @param { div1 div2  originalHeight:初始高度 }
 *  @return {  void }
 */
export const recoverDivHeight = (
  div1: HTMLElement,
  div2: HTMLElement
): void => {
  if (!div1 || !div2) return;
  div1.style.height = "100%";
  div2.style.height = "100%";
  // console.log(" 恢复到初始高度 :", div1, div2);
};
