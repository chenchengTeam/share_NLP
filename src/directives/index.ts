// 转化 单位进制
const transUnit = (number: number) => {
  return number.toLocaleString("en-US");
};

export const addDirective = (app) => {
  // 进制单位
  app.directive("data-unit", {
    mounted(el, binding) {
      const { value } = binding;
      const { num, unit } = value;
      const n = transUnit(Number(num));
      el.innerHTML = `${unit} ${n}`;
    },

    // 组件更新时，也可能需要更新指令绑定的值
    update(el, binding) {
      const { value } = binding;
      const { num, unit } = value;
      const n = transUnit(num);
      el.innerHTML = `${unit} ${n}`;
    },
  });
};
