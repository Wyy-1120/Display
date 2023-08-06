<template>
  <div>
    <el-select v-model="selectedNode" placeholder="请选择展示节点">
      <el-option
        v-for="node in podNodeList"
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
      podNodeList: ["全部结点"], // 声明普通的响应式数据，用于存储节点列表
      // selectedNodeData: "全部结点",
    };
  },

  created() {
    // 页面加载时获取WebSocket数据
    WebSocketService.connect();
    for (let i = 0; i < this.resourceInfo.podNodeList.length; i++) {
      if (!this.podNodeList.includes(this.resourceInfo.podNodeList[i])) {
        this.podNodeList.push(this.resourceInfo.podNodeList[i]);
      }
    }
  },
  computed: {
    ...mapState(["resourceInfo"]), // 假设已经将WebSocket数据存储在Vuex store的websocketData属性中
  },
  watch: {
    resourceInfo: {
      handler(newVal) {
        for (let i = 0; i < newVal.podNodeList.length; i++) {
          if (!this.podNodeList.includes(newVal.podNodeList[i])) {
            this.podNodeList.push(newVal.podNodeList[i]);
          }
        }
        console.log(
          "watch中的resourceInfo的:this.podNodeList" + this.podNodeList
        );
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



