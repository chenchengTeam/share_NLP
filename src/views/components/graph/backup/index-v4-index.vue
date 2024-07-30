<template>
  <div class="graph">
    <el-input
      v-model="searchValue"
      class="grpah-input"
      @keyup.enter="handleEnter"
    />
    <div id="divid">
      <svg width="100%" height="1080"></svg>
    </div>
  </div>
</template>

<script setup lang="js">
// https://blog.csdn.net/qq_37477357/article/details/104857495
// https://relation-graph.com/#/index
// https://blog.csdn.net/Annexiaobin/article/details/107614704
// https://blog.csdn.net/diexinying0496/article/details/101453873
import { ref, onMounted, reactive, nextTick } from "vue";
import { graph, mock } from "@/const/const";
import { useDebounceFn } from "@vueuse/core";
import { getGraph } from "@/api/overviews/index.ts";

// 配置项
let options = {};

// 背景颜色 | 节点字体 | 节点字号 | 关系字体 | 关系字号 | 连线颜色 | 关系示例字体颜色
let backgroundColor, nodesFontType, nodesFontSize, lineFontType, lineFontSize, lineColor, examplesFontColor;

let LinkPath = null;
let LinkText = null;
let marker = null;
let pathElements = null;
let nodeElements = null;
let textElements = null;
let svg = null;
let zoomHandler = null;

// 拖拽节点方法
let dragDrop = null;

// 关系数据
let graphData = reactive({ links: [], nodes: [], apiLinks: [] });

// 搜索值
let searchValue = ref('无锡[江苏省地级市]');

// 默认hover的颜色 数值
let HoverRGB = '#0a92fd';

// 创建一个链接生成器
let linkGenerator = null;

// 力 的 模拟
let simulation = null;


// 实体颜色
let entityColors = ['#339f34',
  '#bcbc2f',
  '#e179c0',
  '#d42b27',
  '#8b564b',
  '#17becf',
  '#1f77b4',
  '#7f7f7f',
  '#ff7f0e',
  '#9467bd'];

// 定义处理按下回车键的方法
const handleEnter = () => {
  if (searchValue.value.trim() !== '') {
    // 执行你的搜索或其他逻辑
    getGraphData(searchValue.value);
  } else {
    // 如果没有值，可以给出提示或者不执行任何操作
    console.log('Search value is empty');
  }
};

// TEST: 点击请求数据
const getGraphData = async (centerName, d3) => {
  // 接口数据
  const graphs = await getGraph({ keyword: centerName });
  const { data } = graphs;
  if (graphData.links.filter((item) => item.center === centerName).length) return
  // 新节点
  const newNodes = Array.from(data.map((item) => {
    const { id, subjectName: target, objectName: source } = item;
    if (graphData.nodes.filter((item) => item.node == target).length) return
    return {
      id,
      node: target, // 节点
    }

  })).filter(item => item !== undefined)
  // 添加新节点
  graphData.nodes.push(...newNodes)
  // 新关系
  const newLinks = data.map((item) => {
    const { subjectName: target, objectName: source, relationType: relation } = item;
    // 自身 索引
    const targetIndex = graphData.nodes.findIndex((item) => item.node === target);
    // 中心点 索引
    const sourceIndex = graphData.nodes.findIndex((item) => item.node === source);
    return {
      target: targetIndex,
      source: sourceIndex, // 自身索引
      relation, // 描述关系
      center: source,
      node: target // 每一项自己
    }
  })

  // 添加新关系
  graphData.links.push(...newLinks)

  console.log(' 新的数据 :', newNodes, newLinks, graphData);
  // console.log('最新所有的节点 :', graphData.nodes);
  // console.log(' 新的数据 :', newNodes ,newLinks);
  // 更新数据
  update(newNodes, newLinks);



  // // 保存当前缩放的属性值
  // const transform = d3.event.transform;
  // // 路径更新  links
  // LinkPath.attr('transform', transform);
  // // 文本更新  links
  // LinkText.attr('transform', transform);
  // // 节点
  // nodeElements.attr('transform', transform);
  // // 节点文本
  // textElements.attr('transform', transform);
}

// 添加实体 和 路劲文本等
const update = (newNodes, newLinks) => {

  // 更新路径
  LinkPath = pathElements.selectAll("path")
    .data(graphData.links, (d) => `${d.center}+${d.node}`);
  LinkPath.exit().remove(); // 删除多余的路径
  LinkPath = LinkPath.enter()
    .append("path")
    .attr('class', 'edgelabel')
    .attr('marker-end', 'url(#resolved)')
    .attr("stroke", "#ffffff")
    .attr("d", "M0,-5L10,0L0,5")
    .merge(LinkPath);

  // 更新箭头
  marker = pathElements.select('marker');

  // 更新路径上的文字标签
  LinkText = pathElements.selectAll(".linetext")
    .data(graphData.links, (d) => `${d.center}+${d.node}`);
  LinkText.exit().remove(); // 删除多余的文字标签
  LinkText = LinkText.enter()
    .append('text')
    .merge(LinkText)
    .attr('class', 'linetext')
    .attr("font-size", 10)
    .style("fill", options.lineTextColor)
    .text((d) => {
      return d.relation;
    })

  // 更新节点
  nodeElements = nodeElements
    .data(graphData.nodes, (d) => d.node);
  nodeElements.exit().remove(); // 删除多余的节点
  nodeElements = nodeElements.enter()
    .append("circle")
    .attr("r", 15)
    .attr("fill", getRandomColorFromArray)
    .call(d3.drag()
      .on("start", (d) => {
        if (!d3.event.active) simulation.alphaTarget(0.01).restart()
        d.fx = d.x;
        d.fy = d.y;
        d3.event.subject.active = true
        console.log(' d :', d);
      })
      .on('drag', (d) => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }).on('end', (d) => {
        if (!d3.event.active) {
          simulation.alphaTarget(0)
        }
      }))
    .on('click', d => {
      const { node } = d;
      getGraphData(node);
    })
    .merge(nodeElements);

  // 更新文本
  textElements = textElements
    .data(graphData.nodes);
  textElements.exit().remove(); // 删除多余的文本
  textElements = textElements.enter()
    .append("text")
    .style("font-family", nodesFontType)
    .attr("font-size", 12)
    .attr("fill", "white")
    .attr("x", function (d) {
      const name = d.node;
      //如果小于四个字符，不换行
      if (name.length < 12) {
        d3.select(this)
          .append("tspan")
          .attr("dx", -10 * (name.length / 2))
          .attr("dy", -20)
          .text(() => {
            return name;
          });
      } else {
        const first = name.slice(0, 12);
        d3.select(this)
          .append("tspan")
          .attr("dx", -100)
          .attr("dy", -25)
          .text(() => {
            return first + '...';
          });
      }
    })
    .merge(textElements);

  // 更新其余参数
  simulation.nodes(graphData.nodes);
  simulation.force("link").links(graphData.links);
  simulation.alpha(1).restart();
}

// 初始化数据
const initD3 = async () => {
  // 处理数据
  graphData.apiLinks = await initData();

  // 初始化 echarts
  await showChart({ links: graphData.apiLinks });
};

// TODO:处理数据
const initData = async () => {
  // 请求关系数据
  // const graphs = mock['无锡[江苏省地级市]'] || await getGraph({ keyword: searchValue.value });
  const graphs = await getGraph({ keyword: searchValue.value });
  const { data: graohData } = graphs;
  // console.log(' 接口请求关系数据 :', graphs);
  let links = graohData.map((item, index) => {
    const { id, objectName, relationType, subjectName } = item;
    return {
      //  < 默认无锡 >
      id,
      data: { rzs: "线上描述" },
      source: objectName, // 实体中心点
      target: subjectName, // 每一项 被指向的实体
      relation: relationType,
      sourceColor: getRandomColorFromArray(),
      targetColor: getRandomColorFromArray(),
      sourceRadius: "20",
      targetRadius: "20",
    }
  })
  // console.log('关系links :', links);
  return links
}

// 加入数据
const showChart = (data) => {
  options.backgroundColor = "#11162a";
  options.nodesFontType = "SimHei";
  options.nodesFontSize = 16;
  options.lineFontType = "SimHei";
  options.lineFontSize = 12;
  options.lineColor = "#ffffff";
  options.showExamples = true;
  options.examplesX = 20;
  options.examplesY = 450;
  options.examplesFontColor = "#ffffff";
  options.lineTextColor = "#aaaaaa";
  drawChart("divid", options, data);
}

// 画图
const drawChart = (divid, options, data) => {
  // 数据
  const apiLinks = data.links;
  // 首个实体
  const firstLinks = apiLinks[0];
  // 实体
  const nodes = apiLinks.map((item, index) => {
    const { source, target, id } = item;
    return {
      id,
      node: target, // 节点
    }
  })

  nodes.unshift({ id: new Date().getTime(), node: firstLinks.source });
  // 每次更新
  graphData.nodes = nodes;

  // 关系
  const links = apiLinks.map((item, index) => {
    const { relation, source, target } = item;
    // 自身 索引
    const targetIndex = nodes.findIndex((item) => item.node === target);
    // 中心点 索引
    const sourceIndex = nodes.findIndex((item) => item.node === source);

    return {
      target: targetIndex,
      source: sourceIndex, // 自身索引
      relation, // 描述关系
      center: source,
      node: target // 每一项自己
    }
  })

  graphData.links = links;
  //画布宽
  const width = window.innerWidth;
  const height = 1080;
  // SVG 画布
  svg = d3.select("svg").attr('width', width).attr('height', height);

  // 开始的地方
  simulation = d3.forceSimulation(nodes)
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height / 2).strength(0.1))
    .force("link", d3.forceLink().distance(250))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("collide", d3.forceCollide(40));

  // 缩放
  zoomHandler = svg.call(d3.zoom().scaleExtent([0.5, 3]).on('zoom', () => {

    console.log(' 移动 ');
    // 保存当前缩放的属性值
    const transform = d3.event.transform;
    // 路径更新  links
    LinkPath.attr('transform', transform);
    // 文本更新  links
    LinkText.attr('transform', transform);
    // 节点
    nodeElements.attr('transform', transform);
    // 节点文本
    textElements.attr('transform', transform);

  })).on('dblclick.zoom', null);

  //  节点 拖拽
  dragDrop = d3.drag()
    .on("start", (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.01).restart()
      d.fx = d.x;
      d.fy = d.y;
      d3.event.subject.active = true
      console.log(' d :', d);
    })
    .on('drag', (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }).on('end', (d) => {
      if (!d3.event.active) {
        simulation.alphaTarget(0)
      }
    })


  // 连线容器元素
  pathElements = svg.append("g").attr('class', 'path');

  // 路径链接器
  LinkPath = pathElements.selectAll("line")
    .data(links, (d) => {
      if (!d) return
      return `${d.center}+${d.node}`
    })
    .enter()
    .append("path")
    .attr('class', 'edgelabel')//添加class样式
    .attr('marker-end', 'url(#resolved)')//设置线的末尾为刚刚的箭头
    .attr("stroke", "#ffffff")
    .attr("d", "M0,-5L10,0L0,5");


  // 连线文本元素集合
  LinkText = pathElements.selectAll('.linetext')
    .data(links, (d) => {
      if (!d) return
      return `${d.center}+${d.node}`
    })
    .enter()
    .append('text')
    .attr('class', 'linetext')
    .attr("font-size", 10)
    .style("fill", options.lineTextColor)
    .text((d) => {
      return d.relation
    })


  // 圆形实体
  nodeElements = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 15)
    .attr("fill", getRandomColorFromArray)
    .call(dragDrop)
    .on('click', function (d) {
      const { node } = d;
      // 鼠标点击d3
      getGraphData(node, d3);
      console.log(d3, ' 点击实体请求数据！！！！ :', '实体信息：', d);
    })


  // 实体文本
  textElements = svg.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .style("font-family", nodesFontType)
    .enter().append("text")
    .attr("font-size", 12)
    .attr("fill", "white") // 直接设置文本的颜色
    .attr("x", function (d) {
      const name = d.node;
      //如果小于四个字符，不换行
      if (name.length < 12) {
        d3.select(this)
          .append("tspan")
          .attr("dx", -10 * (name.length / 2))
          .attr("dy", -20)
          .text(() => {
            return name;
          });
      } else {
        const first = name.slice(0, 12);
        d3.select(this)
          .append("tspan")
          .attr("dx", -100)
          .attr("dy", -25)
          .text(() => {
            return first + '...';
          });
      }
    })

  //箭头
  marker = svg.append('marker')
    .attr('id', 'resolved')
    .attr('markerUnits', 'userSpaceOnUse')//用于确定marker是否进行缩放。取值strokeWidth和userSpaceOnUse，
    .attr("viewBox", "0 -5 10 10") // 坐标系的区域
    .attr('refX', 25)//箭头坐标
    .attr('refY', 0)
    .attr("markerWidth", 10) // 标识的大小
    .attr("markerHeight", 10)
    .attr('orient', 'auto')//绘制方向，可设定为：auto（自动确认方向）和 角度值
    .attr('stroke-width', 2)//箭头宽度
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')//箭头的路径
    .attr('fill', '#ffffff')//箭头颜色


  // 力学 每帧移动
  simulation.nodes(nodes).on('tick', () => {
    // 更新路径连线的位置
    LinkPath.attr("d", (d) => {
      // 根据节点的位置更新路径的起始点和终点
      return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
    });

    // 更新文本标签的位置
    LinkText.attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2);

    // 更新节点的位置
    nodeElements.attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);

    // 更新文本的位置
    textElements.attr("x", (d) => d.x)
      .attr("y", (d) => d.y);
  })

  simulation.force("link").links(links);
  // 重启
  simulation.alpha(1).restart();
}


onMounted(() => {
  initD3();
});

// 定义一个包含预设颜色的数组
const getRandomColorFromArray = () => {
  let randomIndex = Math.floor(Math.random() * entityColors.length);
  return entityColors[randomIndex];
}
</script>

<style scoped lang="scss">
@import "@/design/hooks.scss";

.graph {
  width: 100%;
  height: 1080px;
  position: relative;

  #divid {
    width: 100%;
    height: 1080px;

    > svg {
      background-color: rgb(17, 22, 42);
      @include center;
      color: red;
    }
  }

  .grpah-input {
    width: 640px;
    height: 50px;
    z-index: 5;
    top: 8%;
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
  }
}

.texts {
  color: white;
}
</style>

<style lang="scss">
@import "@/design/hooks.scss";

:not(svg) {
  transform-origin: 0px 0px;
}

#divid > svg {
  background-color: rgb(17, 22, 42);
  @include center;
  position: relative;
  overflow-clip-margin: content-box;
  overflow: hidden;

  > g {
    width: 100%;
    height: 100%;
  }
}

.btn {
  position: fixed;
  top: 10%;
  left: 50%;
  z-index: 5;
}

.graph .el-input__wrapper {
  text-align: center;
  font-size: 18px;
  border-radius: 100px;
  border: none;
  outline: none;
  line-height: 46px;

  .el-input__inner {
    text-align: center;
  }
}
</style>
