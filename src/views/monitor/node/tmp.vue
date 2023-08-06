<template>
  <div>
    <!-- 使用Element UI的下拉选择框 -->
    <el-select v-model="selectedNode" @change="fetchChartData" placeholder="请选择节点">
      <el-option :key="null" label="全部节点" :value="null"></el-option>
      <el-option v-for="node in nodes" :key="node.name" :label="node.name" :value="node.name"></el-option>
    </el-select>

    <!-- 中间的折线图 -->
    <div v-for="node in selectedNodes" :key="node.name" class="chart-container">
      <div>{{ node.name }} 折线图</div>
      <div class="chart" :ref="`chart${node.name}`" :id="`chart${node.name}`"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import echarts from 'echarts';
import WebSocketService from './WebSocketService.js';


export default {
  data() {
    return {
      nodes: [], // 后端传来的节点数据
      selectedNode: null, // 当前选中的节点
      cpuData: {}, // 后端传来的CPU资源使用情况数据
      memoryData: {}, // 后端传来的Memory资源使用情况数据
      cpuChart: null,
    };
  },
  computed: {
    resourceInfo() {
      return this.$store.state.resourceInfo;
    },
  },
  created() {
    // 页面加载时获取节点数据
    // this.fetchNodes();
    WebSocketService.connect(this.resourceInfo);
    WebSocketService.addListener(this.updateChartData);
  },
  computed: {
    selectedNodes() {
      if (this.selectedNode === null) {
        return this.nodes;
      } else {
        return this.nodes.filter(node => node.id === this.selectedNode);
      }
    }
  },
  methods: {
    initCpuChart() {
      const cpuChartContainer = this.$refs.cpuChartContainer;
      this.cpuChart = echarts.init(cpuChartContainer);

      const options = {
        title: {
          text: 'CPU和Memory资源使用情况',
        },
        legend: {
          data: ['CPU', 'Memory'],
        },
        xAxis: {
          type: 'category',
          data: [], // x轴数据，例如时间
        },
        yAxis: {
          type: 'value',
          name: '使用率',
        },
        series: [
          {
            name: 'CPU',
            type: 'line',
            data: [], // CPU资源使用率数据
          },
          {
            name: 'Memory',
            type: 'line',
            data: [], // Memory资源使用率数据
          },
        ],
      };

      this.cpuChart.setOption(options);
    },
    fetchChartData() {

    },
    // ... 其他方法 ...
    updateChartData(data) {
      // 根据收到的数据更新CPU和内存数据
      const { nodeName, cpuUsage, memoryUsage, cpuCapacity, memoryCapacity, time } = data;

      // 根据收到的数据更新this.cpuData和this.memoryData
      // 为了简化起见，假设this.cpuData和this.memoryData是带有nodeName作为键的对象
      this.cpuData[nodeName].push({ cpuUsage, cpuCapacity, time });
      this.memoryData[nodeName].push({ memoryUsage, memoryCapacity, time });

      // 更新数据后手动触发ECharts的更新
      this.updateCharts();
    },

    updateCharts() {
      // 你的ECharts更新代码
      const xData = this.cpuData[this.selectedNode].map(item => item.time);
      const cpuData = this.cpuData[this.selectedNode].map(item => item.cpuUsage / item.cpuCapacity * 100);
      const memoryData = this.memoryData[this.selectedNode].map(item => item.memoryUsage / item.memoryCapacity * 100);

      const option = {
        xAxis: {
          data: xData,
        },
        series: [
          {
            name: 'CPU',
            data: cpuData,
          },
          {
            name: 'Memory',
            data: memoryData,
          },
        ],
      };

      this.cpuChart.setOption(option);
    },
    // fetchNodes() {
    //   // 假设后端API返回节点数据的格式为：{ id: 1, name: "node1" }, { id: 2, name: "node2" }, ...
    //   // 这里使用axios的mock数据方式，实际使用时请替换成真实的后端API请求
    //   axios.get('/api/nodes').then(response => {
    //     this.nodes = response.data;
    //     if (this.nodes.length > 0) {
    //       this.selectedNode = null; // 默认选择"全部节点"
    //       this.fetchChartData();
    //     }
    //   });
    // },
    // ... 其他方法 ...
  },
  beforeDestroy() {
    // 当组件即将被销毁时关闭WebSocket连接
    WebSocketService.disconnect();
  },

};
</script>

<style>
/* ... 其他样式 ... */
</style>
