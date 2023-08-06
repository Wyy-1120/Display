<template>
  <div>
    <el-select v-model="selectedNode" placeholder="请选择展示节点">
      <el-option
        v-for="node in nodeList"
        :key="node"
        :label="node"
        :value="node"
      ></el-option>
    </el-select>
    <line-chart-row :selectedNodeData="selectedNode" />
  </div>
</template>

<script>
import { mapState } from "vuex"; // 使用Vuex来存储WebSocket数据
import WebSocketService from "./WebSocketService.js";
import LineChartRow from "./LineChartRow.vue";

export default {
  components: {
    LineChartRow,
  },
  data() {
    return {
      selectedNode: "全部结点", // 初始时未选择节点
      nodeList: ["全部结点"], // 声明普通的响应式数据，用于存储节点列表
      // selectedNodeData: "全部结点",
    };
  },

  created() {
    // 页面加载时获取WebSocket数据
    // this.selectedNodeData = this.selectedNode;
    WebSocketService.connect();
    for (let i = 0; i < this.resourceInfo.nodeList.length; i++) {
      if (!this.nodeList.includes(this.resourceInfo.nodeList[i])) {
        this.nodeList.push(this.resourceInfo.nodeList[i]);
      }
    }
    
  },
  computed: {
    ...mapState(["resourceInfo"]), // 假设已经将WebSocket数据存储在Vuex store的websocketData属性中
  },
  watch: {
    resourceInfo: {
      handler(newVal) {
        for (let i = 0; i < newVal.nodeList.length; i++) {
          if (!this.nodeList.includes(newVal.nodeList[i])) {
            this.nodeList.push(newVal.nodeList[i]);
          }
        }
        console.log("watch中的resourceInfo的this.nodeList:" + this.nodeList);
      },
      deep: true, // 深度监听，会监听 resourceInfo 中任意深度的属性变化
      immediate: true, // 立即执行handler，以便初始化下拉列表内容
    },
  },
  beforeDestroy() {
    WebSocketService.disconnect();
  },
};
</script>

<style >
</style>



<!-- <template>
  <div>

    <el-select v-model="selectedNode" @change="handleNodeChange" placeholder="请选择展示节点">
      <el-option v-for="node in nodeList" :key="node" :label="node" :value="node"></el-option>
    </el-select>

    <div v-if="selectedNode === '全部结点' || !selectedNode">
      <line-chart-row :data="allNodesData" />
    </div>
    <div v-else>
      <line-chart-row :data="selectedNodeData" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'; // 使用Vuex来存储WebSocket数据
import WebSocketService from './WebSocketService.js';
import LineChartRow from './LineChartRow.vue';

export default {
  components: {
    LineChartRow,
  },
  data() {
    return {
      selectedNode: '', // 初始时未选择节点
      allNodesData: {}, // 声明普通的响应式数据
      selectedNodeData: {}, // 声明普通的响应式数据
      nodeList: [], // 声明普通的响应式数据，用于存储节点列表
    };
  },
  created() {
    // 页面加载时获取WebSocket数据
    WebSocketService.connect();
    // console.log(this.resourceInfo.nodeInfo)
    WebSocketService.addListener(this.updateChartData);
  },
  computed: {
    // ...mapState(['resourceInfo']), // 假设已经将WebSocket数据存储在Vuex store的websocketData属性中
    // ...mapState({
    //   resourceInfo: state => state.resourceInfo,
    // }),
    resourceInfo() {
      return this.$store.state.resourceInfo;
    },
    // ...mapState({
    //   resourceInfo: state => state.resourceInfo, // 将'vuex'中的'resourceInfo'映射到组件的局部状态
    //   nodeList: function () {
    //     // 从'resourceInfo.nodeInfo'中提取所有节点的名称
    //     const nodes = Object.keys(this.resourceInfo.nodeInfo);
    //     return ['全部结点', ...new Set(nodes)]; // 添加 '全部结点' 作为一个选项
    //   }
    // }),
    // nodeList() {
    //   // 从WebSocket数据数组中提取所有节点的名称
    //   // const nodes = this.resourceInfo.nodeInfo.map((data) => data.nodeName);
    //   const nodes = Object.keys(this.resourceInfo.nodeInfo);
    //   console.log("nodeList:" + nodes)
    //   return ['全部结点', ...new Set(nodes)]; // 添加 '全部结点' 作为一个选项
    // },
    // allNodesData() {
    //   return this.processNodeData(''); // 过滤所有节点的数据
    // },
    // selectedNodeData() {
    //   return this.processNodeData(this.selectedNode); // 过滤选定节点的数据
    // },
  },
  watch: {
    'resourceInfo.nodeInfo': {
      handler(newVal) {
        const nodes = Object.keys(newVal);
        this.nodeList = ['全部结点', ...new Set(nodes)];
        console.log("watch中的nodeList:" + nodes)
        if (!this.selectedNode || !nodes.includes(this.selectedNode)) {
          this.selectedNode = '全部结点';
        }
      },
      immediate: true, // 立即执行handler，以便初始化下拉列表内容
    },
    selectedNode: {
      handler(newVal) {
        this.handleNodeChange();
      },
    },
  },
  methods: {
    processNodeData(nodeName) {
      // 根据选定节点对WebSocket数据进行过滤
      // const filteredData = this.resourceInfo.nodeInfo.filter((data) =>
      //   nodeName ? data.nodeName === nodeName : true
      // );
      const filteredData = this.resourceInfo.nodeInfo[nodeName] || [];

      // 处理过滤后的数据，将其转换为适用于ECharts的格式
      const chartData = {
        time: [],
        cpuUsagePercent: [],
        memoryUsagePercent: [],
      };
      for (const data of filteredData) {
        chartData.time.push(data.time);
        chartData.cpuUsagePercent.push((data.cpuUsage / data.cpuCapacity) * 100);
        chartData.memoryUsagePercent.push((data.memoryUsage / data.memoryCapacity) * 100);
      }
      return chartData;
    },
    handleNodeChange() {
      // 当下拉列表选择改变时，重置选定节点数据
      if (this.selectedNode === '全部结点' || !this.selectedNode) {
        this.selectedNodeData = {}; // 清空选定节点数据，确保显示所有数据
        this.allNodesData = this.processNodeData('');
      } else {
        this.allNodesData = {}; // 清空所有节点数据，确保只显示选定节点数据
        this.selectedNodeData = this.processNodeData(this.selectedNode);
      }
    },
  },
};
</script> -->
