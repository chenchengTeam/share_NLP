<template>
  <div class="graph">
    <el-input
      v-model="searchValue"
      class="grpah-input"
      @keyup.enter="handleEnter"
    />

    <!-- <el-button class="btn" type="primary" @click="getGraphData"
      >模拟请求数据</el-button >-->

    <div id="divid"></div>
  </div>
</template>

<script setup lang="js">
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

// 画图
const drawChart = (divid, options, datas, dataFilter) => {

  backgroundColor = options.backgroundColor; //背景颜色
  nodesFontType = options.nodesFontType; //节点字体
  nodesFontSize = options.nodesFontSize; //节点字号
  lineFontType = options.lineFontType; //关系字体
  lineFontSize = options.lineFontSize; //关系字号
  lineColor = options.lineColor; //连线颜色
  examplesFontColor = options.examplesFontColor; //关系示例字体颜色

  // const width = window.innerWidth; //画布宽
  // const height = window.innerHeight; //画布高

  const width = window.innerWidth; //画布宽
  const height = 1080;
  const svgChart = d3.select("svg");
  svgChart.remove();
  const sourceDatas = {};
  sourceDatas.links = [];
  // 分析 每一项
  for (let i = 0; i < datas.links.length; i++) {
    let jsonObj = {};
    jsonObj.source = datas.links[i].source;
    jsonObj.target = datas.links[i].target;
    jsonObj.relation = datas.links[i].relation;
    jsonObj.sourceImg = datas.links[i].sourceImg;
    jsonObj.targetImg = datas.links[i].targetImg;
    jsonObj.sourceColor = datas.links[i].sourceColor;
    jsonObj.targetColor = datas.links[i].targetColor;
    jsonObj.sourceRadius = datas.links[i].sourceRadius;
    jsonObj.targetRadius = datas.links[i].targetRadius;
    // 根据关系类型添加连接线的颜色
    jsonObj.lineColor = lineColor;
    jsonObj.data = datas.links[i].data;
    sourceDatas.links.push(jsonObj);
  }
  let nodes = {}; // 节点
  // 关系links
  let links = sourceDatas.links;
  //关系分组
  let linkGroup = {};
  //对连接线进行统计和分组，不区分连接线的方向，只要属于同两个实体，即认为是同一组
  let linkmap = {};

  for (let i = 0; i < links.length; i++) {
    let key =
      links[i].source < links[i].target
        ? links[i].source + ":" + links[i].target
        : links[i].target + ":" + links[i].source;
    if (!linkmap.hasOwnProperty(key)) {
      linkmap[key] = 0;
    }
    linkmap[key] += 1;
    if (!linkGroup.hasOwnProperty(key)) {
      linkGroup[key] = [];
    }
    linkGroup[key].push(links[i]);
  }

  //为每一条连接线分配size属性，同时对每一组连接线进行编号
  for (let i = 0; i < links.length; i++) {
    let key =
      links[i].source < links[i].target
        ? links[i].source + ":" + links[i].target
        : links[i].target + ":" + links[i].source;
    links[i].size = linkmap[key];
    //同一组的关系进行编号
    let group = linkGroup[key];
    //给节点分配编号
    setLinkNumber(group);
  }

  for (let i = 0; i < links.length; i++) {
    links[i].source =
      nodes[links[i].source] ||
      (nodes[links[i].source] = {
        name: links[i].source,
        color: links[i].sourceColor,
        image: links[i].sourceImg,
        radius: links[i].sourceRadius,
      });
    links[i].target =
      nodes[links[i].target] ||
      (nodes[links[i].target] = {
        name: links[i].target,
        color: links[i].targetColor,
        image: links[i].targetImg,
        radius: links[i].targetRadius,
      });
  }

  nodes = d3.values(nodes); // 分析为节点

  //绑定相连节点
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < links.length; j++) {
      if (nodes[i].name == links[j].source.name) {
        nodes[i][links[j].target.name] = {
          name: links[j].target.name,
        };
      }
      if (nodes[i].name == links[j].target.name) {
        nodes[i][links[j].source.name] = {
          name: links[j].source.name,
        };
      }
    }
  }

  // NO1： D3力导向布局
  let force = d3.layout.force().nodes(nodes).links(links).size([width, height])
    .linkDistance(350)
    .charge(-1500)
    // .friction(0.1) // 摩擦
    // .gravity(0.1) // 重力
    // .linkStrength(0.5) // 设置链接（边）的强度，影响链接的紧密度
    // .alpha(10)
    // .theta(1) // 电荷作用的精度
    .start();
  // console.log(' d3.layout.force() :', d3.layout.force());

  // TODO: 缩放函数
  let zoomFn = () => {
    if (!d3.event) return; // 检查 d3.event 是否存在
    // console.log("开始移动了", d3.event, container);
    let { translate, scale } = d3.event;
    container.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  }

  // 全图 缩放器 最大最小缩放点
  let zoom = d3.behavior.zoom().scaleExtent([0.2, 2.5]).on("zoom", () => zoomFn());

  // 画布 svg
  let svg = d3.select("#" + divid).append("svg").attr('id', 'mySvg').attr("width", width).attr("height", height)
    .attr("style", "background-color:" + backgroundColor)
    .call(zoom)
    .on("dblclick.zoom", null);

  // 缩放层（位置必须在 container 之前）
  let zoomOverlay = svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}  `) // 坐标系的区域
    .style("fill", "none")
    .style("pointer-events", "all");

  // TODO:v3  设置缩放
  const zoomFit = (targtScale, transitionDuration = 0) => {
    let bounds = svg.node().getBBox();
    let parent = svg.node().parentElement;
    let fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
      fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
    let width = bounds.width,
      height = bounds.height;
    let midX = bounds.x + width / 2,
      midY = bounds.y + height / 2;
    if (width == 0 || height == 0) return; // nothing to fit
    let scale = targtScale / Math.max(width / fullWidth, height / fullHeight);
    let translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
    // console.trace("zoomFit", translate, scale);
    svg
      .transition()
      .duration(transitionDuration)
      .call(zoom.translate(translate).scale(scale).event);
  }

  zoomFit(0.8, 100); // NOTE: 调用缩放


  // 初始化  svg
  let container = svg.append("g").attr("class", "container").attr('id', 'myG');

  let edges_path = container.selectAll(".edgepath").data(links).enter()
    .append("path")
    .attr("marker-end", function (d, i) {
      let arrowMarker = container
        .append("marker")
        .attr("id", "arrow" + i)
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10") // 坐标系的区域
        .attr("refX", 10) // 箭头坐标
        .attr("refY", 0)
        .attr("markerWidth", 15) // 标识的大小
        .attr("markerHeight", 15)
        .attr("orient", "auto")
        .attr('stroke-width', 2)
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5") // 箭头的路径
        .attr("fill", () => {
          // 箭头颜色
          return (d.lineColor = "" ? lineColor : d.lineColor);
        });

      return "url(#arrow" + i + ")";
    })
    .style("stroke", (d) => {
      // 线的颜色
      if (d.lineColor == "") {
        return lineColor;
      } else {
        return d.lineColor;
      }
    })
    .style("stroke-width", 1.5)
    .on("mouseover", (d, i) => {
      // console.log("放到连接线段  ", d);
      // 线条 变色
      edges_path.style("stroke", (edge, i) => d.target === edge.target ? HoverRGB : '#ffffff');
      // 箭头
      edges_path.attr('marker-end', (edge, i) => {
        if (d.target === edge.target) {
          d3.select("#arrow" + i + " path").attr("fill", HoverRGB);
          return "url(#arrow" + i + ")";
        } else {
          d3.select("#arrow" + i + " path").attr("fill", "#ffffff")
          return "url(#arrow" + i + ")";
        }
      })
      // 文字颜色
      edges_text.attr('fill', (edge, i) => {
        if (d.target === edge.target) {
          edges_text[0][i].children[0].style.fill = HoverRGB;
        } else {
          edges_text[0][i].children[0].style.fill = options.lineTextColor;
        }
      });
    })
    .on("mouseout", (d, i) => {
      // console.log('移开连接线段:', d, i);
      // 箭头
      edges_path.attr('marker-end', () => {
        d3.select("#arrow" + i + " path").attr("fill", "#ffffff")
        return "url(#arrow" + i + ")";
      })
      // 线
      edges_path.each(function (edge, index) {
        if (index === i) d3.select(this).style("stroke", "#ffffff");
      });
      // 线上文字 文本
      edges_text.attr('fill', (edge, i) => edges_text[0][i].children[0].style.fill = options.lineTextColor);
    });

  //边上的文字  实体之间的 连接线
  let edges_text = container
    .selectAll(".linetext")
    .data(links)
    .enter()
    .append("svg:g")
    .attr("class", "linetext")
    .attr("fill-opacity", 1);

  // 提示文本   颜色
  edges_text
    .append("svg:text")
    .style("font-size", 18 + "px")
    .style("font-family", lineFontType)
    .style("fill", options.lineTextColor)
    .attr("y", ".33em")
    .attr("text-anchor", "middle")
    .text((d) => {
      return d.relation;
    }).on("mouseover", (d, i) => {
      // return
      // console.log("放到文本上？？？", d);
      // 线条 变色
      edges_path.style("stroke", (edge, i) => d.target === edge.target ? HoverRGB : '#ffffff');
      // 箭头
      edges_path.attr('marker-end', (edge, i) => {
        if (d.target === edge.target) {
          d3.select("#arrow" + i + " path").attr("fill", HoverRGB);
          return "url(#arrow" + i + ")";
        } else {
          d3.select("#arrow" + i + " path").attr("fill", "#ffffff")
          return "url(#arrow" + i + ")";
        }
      })
      // 文字颜色
      edges_text.attr('fill', (edge, i) => {
        if (d.target === edge.target) {
          edges_text[0][i].children[0].style.fill = HoverRGB;
        } else {
          edges_text[0][i].children[0].style.fill = options.lineTextColor;
        }
      });
    }).on("mouseout", (d, i) => {
      // return
      // 箭头
      edges_path.attr('marker-end', () => {
        d3.select("#arrow" + i + " path").attr("fill", "#ffffff")
        return "url(#arrow" + i + ")";
      })
      // 线
      edges_path.each(function (edge, index) {
        if (index === i) d3.select(this).style("stroke", "#ffffff");
      });
      // 线上文字 文本
      edges_text.attr('fill', (edge, i) => edges_text[0][i].children[0].style.fill = options.lineTextColor);
    });


  // 鼠标hover 离开圆圈
  const debouncedsCircleOver = useDebounceFn(
    (d, i) => {
      // console.log(' 放到圆圈上？？？ :', d);

      // 线条 变色
      edges_path.style("stroke", (edge) => {
        if (edge.source === d || edge.target === d) return HoverRGB;
        if (edge.source !== d && edge.target !== d) return '#ffffff';
      });

      // 箭头
      edges_path.attr('marker-end', (edge, i) => {
        // i 是箭头的索引，用于选择对应的箭头元素
        // 如果箭头的目标是当前中心点 d，那么将所有箭头路径填充为蓝色
        if (edge.target === d) {
          d3.select("#arrow" + i + " path").attr("fill", HoverRGB);
          return "url(#arrow" + i + ")";
        } else {
          // 否则，只将当前箭头路径填充为蓝色，其他箭头路径填充为白色
          if (edge.source === d) {
            d3.select("#arrow" + i + " path").attr("fill", HoverRGB);
            return "url(#arrow" + i + ")";
          } else {
            d3.select("#arrow" + i + " path").attr("fill", "#ffffff");
            return "url(#arrow" + i + ")";
          }
        }
      });

      // 根据节点属性 d 的颜色属性动态设置边框颜色
      circle
        .style("stroke-width", (edge) => d.name === edge.name ? '6px' : '0px');
    },
    100
  );

  //  圆形 节点
  let circle = container.selectAll("circle").data(nodes).enter().append("circle")
    .style("stroke", (d) => HoverRGB)
    .style("stroke-width", "0px")
    .attr("r", (d) => d.radius)
    .attr("fill", (d, i) => {
      //节点图片不为空是添加背景色
      if (d.image == "") {
        if (d.color == "") {
          return "#EE8262";
        }
        return d.color;
      } else {
        //创建圆形图片
        let defs = container.append("defs").attr("id", "imgdefs");
        let catpattern = defs
          .append("pattern")
          .attr("id", "catpattern" + i)
          .attr("height", 1)
          .attr("width", 1);

        catpattern
          .append("image")
          .attr("width", d.radius * 2)
          .attr("height", d.radius * 2)
          .attr("xlink:href", d.image);

        return "url(#catpattern" + i + ")";
      }
    })
    .on("mouseover", (d, i) => {
      // 鼠标hover 离开圆圈
      debouncedsCircleOver(d, i);
    })
    .on("mouseout", (d, i) => {
      //显示连线上的文字
      edges_text.style("fill-opacity", 1);
      edges_path.style("opacity", 1);
      circle.style("opacity", 1);
      nodes_text.style("opacity", 1);
      // 箭头
      edges_path.attr('marker-end', (edge, i) => {
        d3.select("#arrow" + i + " path").attr("fill", "#ffffff")
        return "url(#arrow" + i + ")";
      })
      // 线
      edges_path.style("stroke", () => '#ffffff');
      circle
        .style("stroke-width", () => '0px');
    }).on('click', (d, j) => {
      const { name, index } = d;
      getGraphData(name);
      // console.log(' 点击实体请求数据！！！！ :', d);
    })
    .call(force.drag);

  // 节点文字设置
  let nodes_text = container
    .selectAll(".nodetext")
    .data(nodes)
    .enter()
    .append("text")
    .style("font-size", nodesFontSize + "px")
    .style("fill", "#ffffff")
    .style("font-family", nodesFontType)
    .attr("x", function (d) {
      let name = d.name;
      //如果小于四个字符，不换行
      if (name.length < 12) {
        d3.select(this)
          .append("tspan")
          .attr("dx", -nodesFontSize * (name.length / 2))
          .attr("dy", -25)
          .text(() => {
            return name;
          });
      } else {
        let first = d.name.slice(0, 12);
        d3.select(this)
          .append("tspan")
          // .attr("dx", -nodesFontSize * (name.length / 2))
          .attr("dx", -100)
          .attr("dy", -25)
          .text(() => {
            return first + '...';
          });
      }
    })
    .on("mouseover", (d, i) => {
      // console.log("  放到圆圈文字上？？？？", d);
    })
    .on("mouseout", (d, i) => {
    })
    .call(force.drag);


  //   拖动 节点
  let drag = force
    .drag()
    .on("dragstart", (d, i) => {
      d.fixed = true; //拖拽开始后设定被拖拽对象为固定
      d3.event.sourceEvent.stopPropagation();
    })
  //力学图运动开始时
  force.on("start", () => {
  });
  //力学图运动结束时
  force.on("end", () => {
  });
  // 力学每一帧
  force.on("tick", () => {

    edges_path.attr("d", (d) => {
      let tan = Math.abs(
        (d.target.y - d.source.y) / (d.target.x - d.source.x)
      ); //圆心连线tan值
      let x1 =
        d.target.x - d.source.x > 0
          ? Math.sqrt((d.sourceRadius * d.sourceRadius) / (tan * tan + 1)) +
          d.source.x
          : d.source.x -
          Math.sqrt((d.sourceRadius * d.sourceRadius) / (tan * tan + 1)); //起点x坐标
      let y1 =
        d.target.y - d.source.y > 0
          ? Math.sqrt(
            (d.sourceRadius * d.sourceRadius * tan * tan) / (tan * tan + 1)
          ) + d.source.y
          : d.source.y -
          Math.sqrt(
            (d.sourceRadius * d.sourceRadius * tan * tan) / (tan * tan + 1)
          ); //起点y坐标
      let x2 =
        d.target.x - d.source.x > 0
          ? d.target.x -
          Math.sqrt((d.targetRadius * d.targetRadius) / (1 + tan * tan))
          : d.target.x +
          Math.sqrt((d.targetRadius * d.targetRadius) / (1 + tan * tan)); //终点x坐标
      let y2 =
        d.target.y - d.source.y > 0
          ? d.target.y -
          Math.sqrt(
            (d.targetRadius * d.targetRadius * tan * tan) / (1 + tan * tan)
          )
          : d.target.y +
          Math.sqrt(
            (d.targetRadius * d.targetRadius * tan * tan) / (1 + tan * tan)
          ); //终点y坐标
      if (d.target.x - d.source.x == 0 || tan == 0) {
        //斜率无穷大的情况或为0时
        y1 =
          d.target.y - d.source.y > 0
            ? d.source.y + d.sourceRadius
            : d.source.y - d.sourceRadius;
        y2 =
          d.target.y - d.source.y > 0
            ? d.target.y - d.targetRadius
            : d.target.y + d.targetRadius;
      }
      // 防报错
      if (!x1 || !y1 || !x2 || !y2) return;
      if (d.linknum == 0) {
        //设置编号为0的连接线为直线，其他连接线会均分在两边
        d.x_start = x1;
        d.y_start = y1;
        d.x_end = x2;
        d.y_end = y2;
        return "M" + x1 + " " + y1 + " L " + x2 + " " + y2;
      }
      let a =
        d.sourceRadius > d.targetRadius
          ? (d.targetRadius * d.linknum) / 3
          : (d.sourceRadius * d.linknum) / 3;
      let xm =
        d.target.x - d.source.x > 0
          ? d.source.x +
          Math.sqrt(
            (d.sourceRadius * d.sourceRadius - a * a) / (1 + tan * tan)
          )
          : d.source.x -
          Math.sqrt(
            (d.sourceRadius * d.sourceRadius - a * a) / (1 + tan * tan)
          );
      let ym =
        d.target.y - d.source.y > 0
          ? d.source.y +
          Math.sqrt(
            ((d.sourceRadius * d.sourceRadius - a * a) * tan * tan) /
            (1 + tan * tan)
          )
          : d.source.y -
          Math.sqrt(
            ((d.sourceRadius * d.sourceRadius - a * a) * tan * tan) /
            (1 + tan * tan)
          );
      let xn =
        d.target.x - d.source.x > 0
          ? d.target.x -
          Math.sqrt(
            (d.targetRadius * d.targetRadius - a * a) / (1 + tan * tan)
          )
          : d.target.x +
          Math.sqrt(
            (d.targetRadius * d.targetRadius - a * a) / (1 + tan * tan)
          );
      let yn =
        d.target.y - d.source.y > 0
          ? d.target.y -
          Math.sqrt(
            ((d.targetRadius * d.targetRadius - a * a) * tan * tan) /
            (1 + tan * tan)
          )
          : d.target.y +
          Math.sqrt(
            ((d.targetRadius * d.targetRadius - a * a) * tan * tan) /
            (1 + tan * tan)
          );
      if (d.target.x - d.source.x == 0 || tan == 0) {
        //斜率无穷大或为0时
        ym =
          d.target.y - d.source.y > 0
            ? d.source.y + Math.sqrt(d.sourceRadius * d.sourceRadius - a * a)
            : d.source.y - Math.sqrt(d.sourceRadius * d.sourceRadius - a * a);
        yn =
          d.target.y - d.source.y > 0
            ? d.target.y - Math.sqrt(d.targetRadius * d.targetRadius - a * a)
            : d.target.y + Math.sqrt(d.targetRadius * d.targetRadius - a * a);
      }

      let k = (x1 - x2) / (y2 - y1); //连线垂线的斜率
      let dx = Math.sqrt((a * a) / (1 + k * k)); //相对垂点x轴距离
      let dy = Math.sqrt((a * a * k * k) / (1 + k * k)); //相对垂点y轴距离
      if (y2 - y1 == 0) {
        dx = 0;
        dy = Math.sqrt(a * a);
      }
      if (a > 0) {
        let xs = k > 0 ? xm - dx : xm + dx;
        let ys = ym - dy;
        let xt = k > 0 ? xn - dx : xn + dx;
        let yt = yn - dy;
      } else {
        let xs = k > 0 ? xm + dx : xm - dx;
        let ys = ym + dy;
        let xt = k > 0 ? xn + dx : xn - dx;
        let yt = yn + dy;
      }
      // ERROR: 报错点
      return
      //记录连线起始和终止坐标，用于定位线上文字
      d.x_start = xs;
      d.y_start = ys;
      d.x_end = xt;
      d.y_end = yt;
      return "M" + xs + " " + ys + " L " + xt + " " + yt;
    });

    //更新连接线上文字的位置
    edges_text.attr("transform", (d) => {
      // 防止报错
      if (!d.x_start || !d.y_start || !d.x_end || !d.y_end) return;
      return (
        "translate(" +
        (d.x_start + d.x_end) / 2 +
        "," +
        (+d.y_start + +d.y_end) / 2 +
        ")" +
        " rotate(" + 0 +
        ")"
      );
    });

    //更新结点图片和文字
    circle.attr("cx", (d) => {
      return d.x;
    });

    circle.attr("cy", (d) => {
      return d.y;
    });

    nodes_text.attr("x", (d) => {
      return d.x;
    });
    nodes_text.attr("y", (d) => {
      return d.y;
    });
  });
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
