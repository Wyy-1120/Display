<template>
  <div>
    <div v-for="index in nums.nodesNum" :key="index" :ref="'chartContainer' + index" class="chart-container"
      style="width: 100%; height: 300px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  data() {
    return {
      wsMonitorUrl: "ws://localhost:8089/mon",
      wsMonitor: null,
      charts: {}, // 存储图表对象的字典
      data: {}, // 存储图表数据的对象
    };
  },
  mounted() {
    // 在组件挂载后初始化图表
    this.initCharts();
    // 建立 WebSocket 连接并监听数据
    this.connectWebSocket();
  },
  beforeDestroy() {
    this.handleWebSocketClose();
  },
  computed: {
    nums() {
      return this.$store.state.nums;
    },
  },
  methods: {
    initCharts() {
      // 使用 ECharts 初始化图表
      console.log(this.nums.nodesNum)
      for (let i = 1; i <= this.nums.nodesNum; i++) {
        const chartContainer = this.$refs['chartContainer' + i][0];
        const chart = echarts.init(chartContainer);
        this.charts['node' + i] = chart;
        this.data['node' + i] = [];
      }
    },
    connectWebSocket() {
      // 建立 WebSocket 连接
      this.wsMonitor = new WebSocket(this.wsMonitorUrl);
      this.wsMonitor.onopen = () => {
        console.log("Monitor WebSocket connected.");
      };
      this.wsMonitor.onmessage = this.handleWebSocketMessage;
      this.wsMonitor.onclose = this.handleWebSocketClose;
    },
    handleWebSocketMessage(event) {
      // 处理 WebSocket 接收到的消息
      const data = JSON.parse(event.data);
      const node = data.node;
      const costCpu = data.costCpu;
      const time = data.time;
      // 更新图表数据
      this.updateChartWithData(node, costCpu, time);
    },
    handleWebSocketClose() {
      // WebSocket 连接关闭处理
      this.wsMonitor.close();
      console.log("Monitor disconnected");
    },
    updateChartWithData(node, costCpu, time) {
      // 更新图表数据
      const chart = this.charts[node];
      const chartData = this.data[node];
      // console.log(chartData)
      // 处理数据，提取时间和使用量
      chartData.push({ time, costCpu });
      // 保留最后的12个数据
      const lastTenData = chartData.slice(-12);
      // 更新图表数据
      chart.setOption({
        xAxis: {
          type: 'category',
          data: lastTenData.map(item => item.time), // 使用时间数组作为横轴数据
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          type: 'line',
          data: lastTenData.map(item => item.costCpu), // 使用使用量数组作为纵轴数据
        }],
        title: {
          text: node, // 标题为节点值
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
          left: 'center',
          top: 'bottom',
        },
      });
    },

  },
};
</script>

<style>
/* ECharts 图表容器样式 */
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
