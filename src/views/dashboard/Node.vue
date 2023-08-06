<template>
  <div>
    <div class="nodetubiao">
      <i class="el-icon-monitor"></i>
    </div>
    <div>
      <span class="nodemas">
        <!-- master{{ id }}<br> -->
        {{ getNodeName }}<br>
        CPU: {{ getCpuUsage }}<br>
        Memory: {{ getMemoryUsage }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      wsMonitorUrl: "ws://localhost:8089/node",
      wsMonitor: null,
    };
  },
  mounted() {
    this.createMonitorWebSocket();
  },
  beforeDestroy() {
    this.cloesMonitorWebSocket();
  },
  computed: {
    nums() {
      return this.$store.state.nums;
    },
    getNodeName() {
      if(this.id == 3)
        return "边缘云";
      return "master" + this.id;
    },
    getCpuUsage() {
      const node = "master" + this.id;
      const cpuInfo = this.nums.cpuInfo[node];
      const percentage = ((cpuInfo[0] / cpuInfo[1]) * 100).toFixed(1);
      return percentage + '%';
    },
    getMemoryUsage() {
      const node = "master" + this.id;
      const memoryInfo = this.nums.memoryInfo[node];
      const percentage = ((memoryInfo[0] / memoryInfo[1]) * 100).toFixed(1);
      return percentage + '%';
    },
  },
  methods: {
    createMonitorWebSocket() {
      this.wsMonitor = new WebSocket(this.wsMonitorUrl);
      this.wsMonitor.onopen = () => {
        console.log("Monitor WebSocket connected.");
      };
      this.wsMonitor.onmessage = (event) => {
        const obj = JSON.parse(event.data);
        console.log(obj);
        //-----------------：更新资源状况------------------        
        this.nums.cpuInfo[obj.node] = [obj.costCpu, obj.totalCpu, obj.time];
        this.nums.memoryInfo[obj.node] = [obj.costMemory, obj.totalMemory, obj.time];

      };
      this.wsMonitor.onerror = (event) => {
        console.error('Monitor WebSocket error:', event);
      };
      this.wsMonitor.onclose = () => {
        console.log("Monitor disconnected");
      };
    },
    cloesMonitorWebSocket() {
      if (this.wsMonitor != null) {
        this.wsMonitor.send("close");
        this.wsMonitor.close();
        this.wsMonitor = null;
      }
    },
  }
};
</script>

<style>
.nodetubiao {
  display: flex;
  /*设置flex布局*/
  align-items: center;
  /*垂直居中*/
  justify-content: center;
  /*水平居中*/
}

.el-icon-monitor {
  font-size: 50px;
}

.nodemas {
  display: flex;
  /*设置flex布局*/
  align-items: center;
  /*垂直居中*/
  justify-content: center;
  /*水平居中*/
  font-size: 15px;
  font-weight: bold;
  white-space: pre-wrap;
}
</style>


<!-- <template>
  <div>
    <div class="nodetubiao">
      <i class="el-icon-monitor"></i>
    </div>
    <div>
      <span class="nodemas">
        master{{ id }}<br>
        CPU: {{ getCpuUsage }}<br>
        Memory: {{ getMemoryUsage }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      wsMonitorUrl: "ws://localhost:8089/monitor/node",
      wsMonitor: null
    };
  },
  mounted() {
    this.createMonitorWebSocket();
  },
  beforeDestroy() {
    this.cloesMonitorWebSocket();
  },
  computed: {
    nums() {
      return this.$store.state.nums;
    },
    getCpuUsage() {
      const node = "node" + this.id;
      const cpuInfo = this.nums.cpuInfo[node];
      return cpuInfo[0] + '/' + cpuInfo[1];
    },
    getMemoryUsage() {
      const node = "node" + this.id;
      const memoryInfo = this.nums.memoryInfo[node];
      // console.log(memoryInfo)
      return memoryInfo[0] + '/' + memoryInfo[1];
    },
  },
  methods: {
    createMonitorWebSocket() {
      this.wsMonitor = new WebSocket(this.wsMonitorUrl);
      this.wsMonitor.onopen = () => {
        console.log("Monitor WebSocket connected.");
      };
      this.wsMonitor.onmessage = (event) => {
        const obj = JSON.parse(event.data);
        //-----------------：更新资源状况------------------        
        this.nums.cpuInfo[obj.node] = [obj.costCpu, obj.totalCpu, obj.time];
        this.nums.memoryInfo[obj.node] = [obj.costMemory, obj.totalMemory, obj.time];

      };
      this.wsMonitor.onerror = (event) => {
        console.error('Monitor WebSocket error:', event);
      };
      this.wsMonitor.onclose = () => {
        console.log("Monitor disconnected");
      };
    },
    cloesMonitorWebSocket() {
      if (this.wsMonitor != null) {
        this.wsMonitor.send("close");
        this.wsMonitor.close();
        this.wsMonitor = null;
      }
    },
  }
};
</script>

<style>
.nodetubiao {
  display: flex;
  /*设置flex布局*/
  align-items: center;
  /*垂直居中*/
  justify-content: center;
  /*水平居中*/
}

.el-icon-monitor {
  font-size: 50px;
}

.nodemas {
  display: flex;
  /*设置flex布局*/
  align-items: center;
  /*垂直居中*/
  justify-content: center;
  /*水平居中*/
  font-size: 15px;
  font-weight: bold;
  white-space: pre-wrap;
}
</style> -->