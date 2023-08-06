<template>
  <div>
    <div v-for="nodeName in nodeList" :key="nodeName">
      <h3>{{ nodeName }}</h3>
      <div class="charts-container">
        <div class="line-chart" :ref="`cpuChart-${nodeName}`"></div>
        <div class="line-chart" :ref="`memoryChart-${nodeName}`" ></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex'; // 使用Vuex来存储WebSocket数据
export default {
  props: {
    selectedNodeData: {
      type: String,
      required: true,
    },
  },
  created() {
    this.startUpdating();
    // console.log("created:" + this.nodeList)
    // this.update();
  },
  data() {
    return {
      chartData: {},
    };
  },
  // mounted() {
  //   // 在mounted钩子函数中进行ECharts初始化
  //   this.drawCharts();
  // },
  computed: {
    // ...mapState(['resourceInfo']), // 假设已经将WebSocket数据存储在Vuex store的websocketData属性中
    resourceInfo() {
      return this.$store.getters.resourceInfo;
    },
    nodeInfo() {
      return this.$store.getters.nodeInfo;
    },
    nodeList() {
      // console.log("computed中的nodeList被调用")
      if (this.selectedNodeData === "全部结点") {
        return this.resourceInfo.nodeList;
      }
      return [this.selectedNodeData];
    },
  },
  watch: {
   nodeInfo: {
      handler(newNodeInfo, oldNodeInfo) {
        console.log("watch中的resourceInfo.nodeInfo:")
        this.updateCharts();
      },
      deep: true,
    },
    nodeList: {
      handler() {
        console.log("watch中的nodeList:" + this.nodeList)
        // this.updateCharts();
        // this.startUpdating();
      },
      deep: true,
    },
  },

  methods: {
    startUpdating() {
      this.updateCharts(); // 先更新一次，避免一开始是空的图表

      this.intervalId = setInterval(() => {
        this.updateCharts();
      }, 1000); // 2秒钟更新一次
    },
    stopUpdating() {
      clearInterval(this.intervalId);
    },
    updateCharts() {
      // 使用Vue.nextTick确保DOM更新后再绘制图表
      // console.log("updateCharts被调用")
      this.$nextTick(() => {
        if (this.nodeList.length > 0) {
          this.drawCharts();
        }
      });
    },
    processData() {
      // console.log("processData被调用")
      this.chartData = {}; // 清空已有数据

      for (const nodeName of this.nodeList) {
        // console.log("processData中的nodeName:" + nodeName)
        const nodeData = this.nodeInfo[nodeName];
        const cpuData = [];
        const memoryData = [];
        const timeData = [];

        for (const item of nodeData) {
          cpuData.push((item.cpuUsage / item.cpuCapacity) * 100);
          memoryData.push((item.memoryUsage / item.memoryCapacity) * 100);
          timeData.push(item.time);
        }

        this.chartData[nodeName] = {
          cpuData,
          memoryData,
          timeData,
        };
        // console.log("processData中的chartData:" + nodeName)
        // console.log(this.chartData[nodeName])
      }

    },
    drawCharts() {
      // console.log("drawCharts被调用")

      this.processData();
      for (const nodeName in this.chartData) {
        const index = this.nodeList.indexOf(nodeName);
        const cpuChartContainer = this.$refs[`cpuChart-${nodeName}`][0];
        const memoryChartContainer = this.$refs[`memoryChart-${nodeName}`][0];

        // 验证是否能正确获取 DOM 元素
        // console.log("CPU Chart Container:", cpuChartContainer);
        // console.log("Memory Chart Container:", memoryChartContainer);
        try {
          const { cpuData, memoryData, timeData } = this.chartData[nodeName];
          // 使用ECharts渲染CPU资源使用情况折线图
          const cpuChart = echarts.init(cpuChartContainer);
          const memoryChart = echarts.init(memoryChartContainer);
          const cpuOption = {
            xAxis: {
              type: 'category',
              data: timeData,
            },
            yAxis: {
              type: 'value',
              name: 'CPU 使用率(%)',
            },
            series: [
              {
                type: 'line',
                data: cpuData,
                name: 'CPU Usage',
              },
            ],
          };
          const memoryOption = {
            xAxis: {
              type: 'category',
              data: timeData,
            },
            yAxis: {
              type: 'value',
              name: 'Memory 使用率(%)',
            },
            series: [
              {
                type: 'line',
                data: memoryData,
                name: 'Memory Usage',
              },
            ],
          };
          cpuChart.setOption(cpuOption);
          memoryChart.setOption(memoryOption);
        } catch (error) {
          console.error("ECharts初始化错误：", error);
        }
      }
    },

  },
  beforeDestroy() {
    // 组件销毁前销毁echarts实例，避免内存泄漏
    this.stopUpdating();
    for (const nodeName in this.chartData) {
      if (this.$refs[`cpuChart-${nodeName}`]) {
        echarts.dispose(this.$refs[`cpuChart-${nodeName}`]);
      }
      if (this.$refs[`memoryChart-${nodeName}`]) {
        echarts.dispose(this.$refs[`memoryChart-${nodeName}`]);
      }
    }
  },
};
</script>

<style scoped>
.charts-container {
  display: flex;
}

.line-chart {
  flex: 1;
  width: 400px;
  height: 200px;
  margin: 10px;
}
</style>