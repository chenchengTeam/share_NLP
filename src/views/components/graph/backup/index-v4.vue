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
import { ref, onMounted, reactive, nextTick } from "vue";
import { graph, mock } from "@/const/const";
import { useDebounceFn } from "@vueuse/core";
import { getGraph } from "@/api/overviews/index.ts";

// 配置项
let options = {};

// 背景颜色 | 节点字体 | 节点字号 | 关系字体 | 关系字号 | 连线颜色 | 关系示例字体颜色
let backgroundColor, nodesFontType, nodesFontSize, lineFontType, lineFontSize, lineColor, examplesFontColor;

// 关系数据
let graphData = reactive({ links: [] });

// 搜索值
let searchValue = ref('无锡[江苏省地级市]');

// 默认hover的颜色 数值
let HoverRGB = '#0a92fd';

// 创建一个链接生成器
let linkGenerator = null;


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
    console.log('搜索实体名称:', searchValue.value);
    graphData.links = [];
    getGraphData(searchValue.value);

  } else {
    // 如果没有值，可以给出提示或者不执行任何操作
    console.log('Search value is empty');
  }
};

// TODO: 添加数据
const getGraphData = async (centerName) => {
  // 存在 中心实体 直接删除
  if (graphData.links.filter((item) => item.source === centerName).length) return

  // 请求关系数据
  const graphs = await getGraph({ keyword: centerName });
  const { data: graohData } = graphs;

  if (graohData.length == 0) return // 无数据返回

  let newLinks = graohData.map((item, index) => {
    // 实体中心 objectName 目标 subjectName
    const { id, objectName, relationType, subjectName } = item;
    return {
      //  < 默认无锡 >
      source: objectName, // 中心点
      data: { rzs: "线上描述" },
      // 每一项 被指向的实体
      target: subjectName,
      relation: relationType,
      sourceImg: "",
      targetImg: "",
      sourceColor: getRandomColorFromArray(),
      targetColor: getRandomColorFromArray(),
      sourceRadius: "20",
      targetRadius: "20",
    }
  })

  /**
   * 点击获取最新的中心实体
   * 去找之前links中是否有该实体的双向关系
   * 移除最新links中存在双向关系的一项
   * 合并最新links
   */
  const nowSoucre = newLinks[0].source || null;
  // 重复的实体名称
  const lastSource = graphData.links.filter((item) => item.target === nowSoucre)[0]?.source || null;
  // 剩下的一项
  const remainingData = newLinks.filter((item) => item.target !== lastSource);
  // console.log('处理解决后数据:', lastSource ,remainingData);

  // linkGenerator.links(remainingData);  // 更新链接生成器的链接数据
  // d3.layout.force("link", linkGenerator); // 链接器
  // d3.layout.force.alpha(1).restart(); // 重新启动模拟

  // 合并
  graphData.links.push(...remainingData);

  // 重新 数据 加载
  showChart({ links: graphData.links });
}
const _getGraphData = (centerName) => {
  if (!mock[centerName]) return;
  let { data } = mock[centerName];
  let { entity, domain, desc, image, avp, tag } = data;
  // 是否有圆心实体
  if (graphData.links.filter((item) => item.source === centerName).length) return

  // < 中心点 >
  // let centerNode = avp[0][1];
  let centerNode = centerName;

  // TODO: 去除名称相同的实体
  let filterAvp = removeRepeat(avp.slice(1).filter((item) => item[1] !== centerNode))

  // 全新关系
  let newLinks = filterAvp.map((item, index) => {
    let relation = item[0];
    let targetNode = item[1];
    return {
      //  < 默认无锡 >
      source: centerNode,
      data: {
        rzs: "线上描述",
      },
      // 每一项 被指向的实体
      target: targetNode,
      relation: relation,
      sourceImg: "",
      targetImg: "",
      sourceColor: getRandomColorFromArray(),
      targetColor: getRandomColorFromArray(),
      sourceRadius: "20",
      targetRadius: "20",
    }
  })

  // 合并
  graphData.links.push(...newLinks);

  // 重新 数据 加载
  showChart({ links: graphData.links });

  console.log('对比假数据 :', graphData.links);
}

// 初始化数据
const initD3 = async () => {
  // 处理数据
  graphData.links = await initData();

  // 初始化 echarts
  await showChart({ links: graphData.links });
};

// TODO:处理数据
const initData = async () => {
  // 请求关系数据
  const graphs = mock['无锡[江苏省地级市]'] || await getGraph({ keyword: searchValue.value });
  const { data: graohData } = graphs;
  // console.log(' 接口请求关系数据 :', graphs);
  let links = graohData.map((item, index) => {
    const { id, objectName, relationType, subjectName } = item;
    return {
      //  < 默认无锡 >s
      source: objectName, // 中心点
      data: { rzs: "线上描述" },
      // 每一项 被指向的实体
      target: subjectName,
      relation: relationType,
      sourceImg: "",
      targetImg: "",
      sourceColor: getRandomColorFromArray(),
      targetColor: getRandomColorFromArray(),
      sourceRadius: "20",
      targetRadius: "20",
    }
  })
  // console.log('关系links :', links);
  return links

  // // mock数据 中心词无锡
  // let { data } = graph;
  // let { entity, domain, desc, image, avp, tag } = data;
  // // 中心点 < 默认无锡 >
  // let centerNode = avp[0][1];
  // // TODO: 去除名称相同的实体
  // let filterAvp = avp.slice(1).filter((item) => item[1] !== centerNode)
  // // 设置关系
  // let links = filterAvp.map((item, index) => {
  //   let relation = item[0];
  //   let targetNode = item[1];
  //   return {
  //     //  < 默认无锡 >
  //     source: centerNode,
  //     data: {
  //       rzs: "线上描述",
  //     },
  //     // 每一项 被指向的实体
  //     target: targetNode,
  //     relation: relation,
  //     sourceImg: "",
  //     targetImg: "",
  //     sourceColor: getRandomColorFromArray(),
  //     targetColor: getRandomColorFromArray(),
  //     sourceRadius: "20",
  //     targetRadius: "20",
  //   }
  // })

  // console.log(links, 'links');
  // return links
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


const getNeighbors = (node) => {
  return links.reduce(
    function (neighbors, link) {
      if (link.target.id === node.id) {
        neighbors.push(link.source.id);
      } else if (link.source.id === node.id) {
        neighbors.push(link.target.id);
      }
      return neighbors;
    },
    [node.id]
  );
}

const isNeighborLink = (node, link) => {
  return link.target.id === node.id || link.source.id === node.id;
}

const getNodeColor = (node, neighbors) => {
  if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
    return node.level === 1 ? "blue" : "green";
  }
  return node.level === 1 ? "red" : "gray";
}

const getLinkColor = (node, link) => {
  return isNeighborLink(node, link) ? "green" : "#E5E5E5";
}

const getTextColor = (node, neighbors) => {
  return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1
    ? "green"
    : "black";
}

const selectNode = (selectedNode) => {
  var neighbors = getNeighbors(selectedNode);

  // we modify the styles to highlight selected nodes
  nodeElements.attr("fill", function (node) {
    return getNodeColor(node, neighbors);
  });
  textElements.attr("fill", function (node) {
    return getTextColor(node, neighbors);
  });
  linkElements.attr("stroke", function (link) {
    return getLinkColor(selectedNode, link);
  });
}


// 画图
const drawChart = (divid, options, datas) => {
  console.log(' datas :', datas);
  // 数据
  const apiLinks = datas.links;
  // 首个实体
  const firstLinks = apiLinks[0];

  const nodes = apiLinks.map((item, index) => {
    const { data, relation, source, sourceColor, sourceImg, sourceRadius,
      target, targetColor, targetImg, targetRadius } = item;
    return {
      name: target, group: 0, relation, level: 1,source
    }
  })

  nodes.unshift({ name: firstLinks.source, group: 0, relation: firstLinks.relation, level: 1 });
  // console.log(' nodes :', nodes);

  const links = apiLinks.map((item, index) => {
    const { data, relation, source, sourceColor, sourceImg, sourceRadius,
      target, targetColor, targetImg, targetRadius } = item;
    return {
      target: target, source: source, strength: 0, relation
    }
  })


  //画布宽
  const width = window.innerWidth;
  const height = 1080;

  // SVG 画布
  const svg = d3.select("svg").attr('width', width).attr('height', height);

  // 开始的地方
  const simulation = d3.forceSimulation(nodes)
    .force('charge', forceManyBody)
    .force('link', forceLink)
    .force('center', d3.forceCenter(width / 2, height / 2))



  // 连线容器元素
  const LINK_CONTAINER = svg.append("g").attr('class', 'path');

  // 缩放
  svg.call(d3.zoom().scaleExtent([0.5, 3]).on('zoom', () => {
    // 保存当前缩放的属性值
    const transform = d3.event.transform;
    // 路径links
    LINK_CONTAINER.attr('transform', transform)
    // 节点
    nodeElements.attr('transform', transform);
    // 节点文本
    textElements.attr('transform', transform);
  })).on('dblclick.zoom', null);


  //  节点 拖拽
  const dragDrop = d3.drag().on('start', (node) => {
    node.fx = node.x
    node.fy = node.y
  }).on("start", (d) => {
    if (!d3.event.active) {
      //              拖拽开始回调
      simulation.alphaTarget(1).restart() // 这个方法可以用在在交互时重新启动仿真，比如拖拽了某个节点，重新进行布局。这个必须要进行设置不然会拖动不了。
    }
    d.fixed = true //偏移后固定不动
    //            d3.event.sourceEvent.stopPropagation()
    d.fx = d.x//记录当前默认位置（x - 节点当前的 x-位置，如果要为某个节点设置默认的位置，则需要为该节点设置如下两个属性:fx =x位置）
    d.fy = d.y
  })
    .on('drag', (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }).on('end', (d) => {
      if (!d3.event.active)
        simulation.alphaTarget(0);
    })

  // 圆形实体
  const nodeElements = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 15)
    .attr("fill", getRandomColorFromArray)
    .call(dragDrop)
    .on('click', selectNode)


  // 实体文本
  const textElements = svg.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .style("font-family", nodesFontType)
    .enter().append("text")
    .attr("font-size", 12)
    .attr("fill", "white") // 直接设置文本的颜色
    .attr("x", function (d) {
      const name = d.name;
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
        const first = d.name.slice(0, 12);
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
  const marker = LINK_CONTAINER.append('marker')
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


  // 路径链接器
  const LinkPath = LINK_CONTAINER.selectAll("line")
    .data(links)
    .enter()
    .append("path")
    .attr('class', 'edgelabel')//添加class样式
    .attr('marker-end', 'url(#resolved)')//设置线的末尾为刚刚的箭头
    .attr("stroke", "#ffffff")
    .attr("d", "M0,-5L10,0L0,5");


  // 连线文本元素集合
  const LinkText = LINK_CONTAINER.selectAll('.linetext')
    .data(links)
    .enter()
    .append('text')
    .attr('class', 'linetext')
    .attr("font-size", 10)
    .style("fill", options.lineTextColor)
    .text((d) => {
      return d.relation
    })




  // 力学 每帧移动
  simulation.nodes(nodes).on('tick', () => {

    // 连线
    LinkPath.attr('d', function (d) {
      var path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
      return path
    })

    //更新连接线 文本
    LinkText.attr('x', function (d) {
      return (d.source.x + d.target.x) / 2
    })
    LinkText.attr('y', function (d) { return (d.source.y + d.target.y) / 2 })
    // 圆形节点
    nodeElements.attr('cx', (node) => node.x).attr('cy', (node) => node.y)
    // 圆形节点文本
    textElements.attr('x', (node) => node.x).attr('y', (node) => node.y)
  })

  simulation.force("link").links(links);
  // 重启
  // simulation.alpha(1).restart();
}

// 分配編號
const setLinkNumber = (group) => {
  if (group.length == 0) return;
  if (group.length == 1) {
    group[0].linknum = 0;
    return;
  }
  let maxLinkNumber =
    group.length % 2 == 0 ? group.length / 2 : (group.length - 1) / 2;
  if (group.length % 2 == 0) {
    let startLinkNum = -maxLinkNumber + 0.5;
    for (let i = 0; i < group.length; i++) {
      group[i].linknum = startLinkNum++;
    }
  } else {
    let startLinkNum = -maxLinkNumber;
    for (let i = 0; i < group.length; i++) {
      group[i].linknum = startLinkNum++;
    }
  }
}

onMounted(() => {
  initD3();
});

// 定义一个包含预设颜色的数组
const getRandomColorFromArray = () => {
  let randomIndex = Math.floor(Math.random() * entityColors.length);
  return entityColors[randomIndex];
}

// [] 去除数组第二项重复的数据
const removeRepeat = (data) => {
  return data.reduce((acc, current) => {
    // 获取当前子数组的第二项作为唯一标识符
    let key = current[1];
    // 如果记录对象中不存在这个唯一标识符，则将其添加到结果数组中，并记录在对象中
    if (!acc.map[key]) {
      acc.map[key] = true;
      acc.result.push(current);
    }
    return acc;
  }, { result: [], map: {} }).result;
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
