<template>
  <div>
    <div v-for="pod in podNodeList" :key="pod">
      <h3>{{ pod }}</h3>
      <div class="charts-container">
        <div class="line-chart" :ref="`cpuChart-${pod}`"></div>
        <div class="line-chart" :ref="`memoryChart-${pod}`"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { mapState } from "vuex"; // 使用Vuex来存储WebSocket数据
export default {
  props: {
    selectedNodeData: {
      type: String,
      required: true,
    },
  },
  created() {
    this.startUpdating();
    // console.log("created:" + this.podNodeList)
    // this.update();
  },
  data() {
    return {
      chartData: {},
      podNodeList: [],
    };
  },
  // mounted() {
  //   // 在mounted钩子函数中进行ECharts初始化
  //   this.drawCharts();
  // },
  computed: {
    // ...mapState(['resourceInfo']), // 假设将WebSocket数据存储在Vuex store的websocketData属性中
    resourceInfo() {
      return this.$store.getters.resourceInfo;
    },
    podInfo() {
      return this.$store.getters.resourceInfo.podInfo;
    },
    // podNodeList() {
    //   console.log("computed中的podNodeList被调用");
    //   console.log("computed中的podNodeList中的selectedNodeData", this.selectedNodeData);
    //   console.log("computed中的podNodeList中的resourceInfo.podInfo", this.resourceInfo.podInfo);
    //   const list = this.updatePodList();
    //   console.log("computed中的podNodeList中的list", list);
    //   return list;
    // },
  },
  watch: {
    selectedNodeData(newVal, oldVal) {
      this.podNodeList = this.updatePodList();
    },
    resourceInfo: {
      handler(newVal) {
        this.podNodeList = this.updatePodList();
      console.log("watch中的podNodeList:" + this.podNodeList);
      },
      deep: true, // 深度监听，会监听 resourceInfo 中任意深度的属性变化
      immediate: true, // 立即执行handler，以便初始化下拉列表内容
    },
    podInfo: {
      handler(newNodeInfo, oldNodeInfo) {
        // console.log("watch中的resourceInfo.nodeInfo:");
        this.updateCharts();
      },
      deep: true,
    },
  },

  methods: {
    updatePodList() {
      const list = [];
      if (this.selectedNodeData === "全部结点") {
        const podInfo = this.resourceInfo.podInfo;
        Object.keys(podInfo).forEach((podName) => {
          const podData = podInfo[podName];
          if (this.resourceInfo.podNodeList.includes(podData[0].nodeName)) {
            list.push(podName);
          }
        });
      } else {
        const podInfo = this.resourceInfo.podInfo;
        Object.keys(podInfo).forEach((podName) => {
          const podData = podInfo[podName];
          if (podData[0].nodeName === this.selectedNodeData) {
            list.push(podName);
          }
        });
      }
      console.log("updatePodList中的podNodeList:");
      console.log(list);
      return list;
    },
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
      // console.log("updateCharts被调用");
      this.$nextTick(() => {
        if (this.podNodeList.length > 0) {
          this.drawCharts();
        }
      });
    },
    processData() {
      // console.log("processData被调用");
      this.chartData = {}; // 清空已有数据

      for (const podName of this.podNodeList) {
        // console.log("processData中的pod:" + podName);
        const podData = this.resourceInfo.podInfo[podName];
        const cpuData = [];
        const memoryData = [];
        const timeData = [];

        for (const item of podData) {
          cpuData.push(item.cpuUsage);
          memoryData.push(item.memoryUsage);
          timeData.push(item.time);
        }

        this.chartData[podName] = {
          cpuData,
          memoryData,
          timeData,
        };
        // console.log("processData中的chartData:" + podName);
        // console.log(this.chartData[podName]);
      }
    },
    drawCharts() {
      // console.log("drawCharts被调用");

      this.processData();
      for (const pod in this.chartData) {
        const cpuChartContainer = this.$refs[`cpuChart-${pod}`][0];
        const memoryChartContainer = this.$refs[`memoryChart-${pod}`][0];

        // 验证是否能正确获取 DOM 元素
        // console.log("CPU Chart Container:", cpuChartContainer);
        // console.log("Memory Chart Container:", memoryChartContainer);
        try {
          const { cpuData, memoryData, timeData } = this.chartData[pod];
          // 使用ECharts渲染CPU资源使用情况折线图
          const cpuChart = echarts.init(cpuChartContainer);
          const memoryChart = echarts.init(memoryChartContainer);
          const cpuOption = {
            xAxis: {
              type: "category",
              data: timeData,
            },
            yAxis: {
              type: "value",
              name: "CPU 使用量(m)",
            },
            series: [
              {
                type: "line",
                data: cpuData,
                name: "CPU Usage",
              },
            ],
          };
          const memoryOption = {
            xAxis: {
              type: "category",
              data: timeData,
            },
            yAxis: {
              type: "value",
              name: "Memory 使用量(Mi)",
            },
            series: [
              {
                type: "line",
                data: memoryData,
                name: "Memory Usage",
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
    for (const pod in this.chartData) {
      if (this.$refs[`cpuChart-${pod}`]) {
        echarts.dispose(this.$refs[`cpuChart-${pod}`]);
      }
      if (this.$refs[`memoryChart-${pod}`]) {
        echarts.dispose(this.$refs[`memoryChart-${pod}`]);
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