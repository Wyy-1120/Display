<template>
  <div>
    <div class="block">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(activity, index) in nums.activities" :key="index" :icon="activity.icon"
          :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp">
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "CreateProcess",
  data() {
    return {
      wsUrl: "ws://localhost:8089/display",
      ws: null
      // activities: [],
    };
  },
  mounted() {
    this.createWebSocket();
  },
  beforeDestroy() {
    this.closeWebSocket();
  },
  computed: {
    nums() {
      return this.$store.state.nums;
    },
  },
  methods: {
    ...mapActions('nums', ["init"]),
    createWebSocket() {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => {
        console.log("TimeLine WebSocket connected.");
      };
      this.ws.onmessage = (event) => {
        const obj = JSON.parse(event.data);
        const step = obj.step;
        //-----------------步骤0：初始化------------------
        if (step === 0) {
          this.nums.mastersNum = obj.mastersNum;
          this.nums.nodesNum = obj.nodesNum;
          this.nums.maxNum = this.nums.nodesNum > this.nums.carsNum ? this.nums.nodesNum : this.nums.carsNum;
          this.nums.maxHeight = this.nums.compHeight * this.nums.maxNum;
        }
        //-----------------步骤1：创建任务-----------------
        else if (step === 1) {
          this.nums.carsNum++;
          this.nums.activities.push({
            content: obj.user + " 创建了 " + obj.task + " 任务，任务编号为" + obj.requestId,
            timestamp: obj.time,
            size: "large",
            type: "primary",
            color: "black",
            icon: "el-icon-more",
          });
          this.nums.color.push({ key: obj.requestId, value: "black" });
          this.nums.info.push({ key: obj.requestId, value: obj.user + " 创建了 " + obj.task + " 任务，任务编号为" + obj.requestId });
        }
        //-----------------步骤2：放置决策-----------------
        else if (step === 2) {
          this.nums.activities.push({
            icon: "el-icon-edit",
            type: "primary",
            color: "blue",
            size: "large",
            timestamp: obj.timeStamp,
            content:
              "任务" + obj.requestId + "将被放置到节点 " +
              obj.node +
              " , 分配的资源为cpu" +
              obj.cpuSize +
              "m, 内存" +
              obj.memorySize +
              "Mi.",
          });
          this.nums.color = this.nums.color.map(item => {
            if (item.key === obj.requestId) {
              item.value = "blue";
            }
            return item;
          });
          this.nums.info = this.nums.info.map(item => {
            if (item.key === obj.requestId) {
              item.value = "任务" + obj.requestId + "将被放置到节点 " +
                obj.node +
                " , 分配的资源为cpu" +
                obj.cpuSize +
                "m, 内存" +
                obj.memorySize +
                "Mi.";
            }
            return item;
          });
        }
        //-----------------步骤3：放置成功-----------------
        else if (step === 3) {
          this.nums.activities.push({
            icon: "el-icon-view",
            type: "primary",
            color: "green",
            size: "large",
            timestamp: obj.timeStamp,
            content: "任务" + obj.requestId + "放置成功, 应用地址为 https://" + obj.url,
          });
          this.nums.color = this.nums.color.map(item => {
            if (item.key === obj.requestId) {
              item.value = "green";
            }
            return item;
          });
          this.nums.info = this.nums.info.map(item => {
            if (item.key === obj.requestId) {
              item.value = "任务" + obj.requestId + "放置成功, 应用地址为 https://" + obj.url;
            }
            return item;
          });
          const rightindex = this.nums.info.findIndex(item => item.key === obj.requestId);
          let leftindex = -1;
          if (obj.node === 'k8snode1') {
            leftindex = 0;
          } else if (obj.node === "k8snode2") {
            leftindex = 1;
          } else if (obj.node === "k8snode3") {
            leftindex = 2;
          } else if (obj.node === "k8snode4") {
            leftindex = 3;
          }
          if (rightindex != -1 && leftindex != -1) {
            this.nums.rightlines.push({
              requestId: obj.requestId,
              startX: this.nums.compWidth,
              startY: this.nums.maxHeight / this.nums.carsNum / 2 * (rightindex * 2 + 1),
              endX: 8,
              endY: this.nums.maxHeight / this.nums.nodesNum / 2 * (leftindex * 2 + 1),
              width: 3,
              color: "green",
              arrowhead: "url(#arrow2)",
            });
          }
          // console.table(this.nums.rightlines)
        }
        //-----------------步骤4：放置成功-----------------
        else if (step === 4) {
          const index = this.nums.info.findIndex(item => item.key === obj.requestId);
          if (index > -1) {
            this.nums.info.splice(index, 1);
          }
          this.nums.carsNum--;
          const index2 = this.nums.rightlines.findIndex(line => line.requestId === obj.requestId);
          if (index2 > -1) {
            this.nums.rightlines = this.nums.rightlines.filter((_, i) => i !== index2);
          }
          // console.table(this.nums.rightlines)
        }

      };
      this.ws.onerror = (event) => {
        console.error('TimeLine WebSocket error:', event);
      };
      this.ws.onclose = () => {
        console.log("TimeLine disconnected");
      };
    },
    closeWebSocket() {
      if (this.ws != null) {
        // this.nums.mastersNum = 0;
        // this.nums.nodesNum = 0;
        // this.nums.carsNum = 0;
        // this.nums.maxNum = 0;
        // this.nums.color = [];
        // this.nums.info = [];
        // this.nums.rightlines = [];
        this.ws.send("close");
        this.init();
        this.ws.close();
        this.ws = null;
      }
    }
  },
};
</script>

<style scoped>
.block {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}
</style>

<!-- <template>
  <div>
    <div class="block">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(activity, index) in nums.activities" :key="index" :icon="activity.icon"
          :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp">
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "CreateProcess",
  data() {
    return {
      wsUrl: "ws://localhost:8089/display",
      ws: null
      // activities: [],
    };
  },
  mounted() {
    this.createWebSocket();
  },
  beforeDestroy() {
    this.closeWebSocket();
  },
  computed: {
    nums() {
      return this.$store.state.nums;
    },
  },
  methods: {
    ...mapActions('nums', ["init"]),
    createWebSocket() {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => {
        console.log("TimeLine WebSocket connected.");
      };
      this.ws.onmessage = (event) => {
        const obj = JSON.parse(event.data);
        const step = obj.step;
        //-----------------步骤0：初始化------------------
        if (step === 0) {
          this.nums.mastersNum = obj.mastersNum;
          this.nums.nodesNum = obj.nodesNum;
          this.nums.maxNum = this.nums.nodesNum > this.nums.carsNum ? this.nums.nodesNum : this.nums.carsNum;
          this.nums.maxHeight = this.nums.compHeight * this.nums.maxNum;
        }
        //-----------------步骤1：创建任务-----------------
        else if (step === 1) {
          this.nums.carsNum++;
          this.nums.activities.push({
            content: obj.user + " 创建了 " + obj.task + " 任务，任务编号为" + obj.requestId,
            timestamp: obj.time,
            size: "large",
            type: "primary",
            color: "black",
            icon: "el-icon-more",
          });
          this.nums.color.push({ key: obj.requestId, value: "black" });
          this.nums.info.push({ key: obj.requestId, value: obj.user + " 创建了 " + obj.task + " 任务，任务编号为" + obj.requestId });
        }
        //-----------------步骤2：放置决策-----------------
        else if (step === 2) {
          this.nums.activities.push({
            icon: "el-icon-edit",
            type: "primary",
            color: "blue",
            size: "large",
            timestamp: obj.timeStamp,
            content:
              "任务" + obj.requestId + "将被放置到节点 " +
              obj.node +
              " , 分配的资源为cpu" +
              obj.cpuSize +
              "m, 内存" +
              obj.memorySize +
              "Mi.",
          });
          this.nums.color = this.nums.color.map(item => {
            if (item.key === obj.requestId) {
              item.value = "blue";
            }
            return item;
          });
          this.nums.info = this.nums.info.map(item => {
            if (item.key === obj.requestId) {
              item.value = "任务" + obj.requestId + "将被放置到节点 " +
                obj.node +
                " , 分配的资源为cpu" +
                obj.cpuSize +
                "m, 内存" +
                obj.memorySize +
                "Mi.";
            }
            return item;
          });
        }
        //-----------------步骤3：放置成功-----------------
        else if (step === 3) {
          this.nums.activities.push({
            icon: "el-icon-view",
            type: "primary",
            color: "green",
            size: "large",
            timestamp: obj.timeStamp,
            content: "任务" + obj.requestId + "放置成功, 应用地址为 https://" + obj.url,
          });
          this.nums.color = this.nums.color.map(item => {
            if (item.key === obj.requestId) {
              item.value = "green";
            }
            return item;
          });
          this.nums.info = this.nums.info.map(item => {
            if (item.key === obj.requestId) {
              item.value = "任务" + obj.requestId + "放置成功, 应用地址为 https://" + obj.url;
            }
            return item;
          });
          const rightindex = this.nums.info.findIndex(item => item.key === obj.requestId);
          let leftindex = -1;
          if (obj.node === 'node1') {
            leftindex = 0;
          } else if (obj.node === "node2") {
            leftindex = 1;
          } else if (obj.node === "node3") {
            leftindex = 2;
          } else if (obj.node === "node4") {
            leftindex = 3;
          }
          if (rightindex != -1 && leftindex != -1) {
            this.nums.rightlines.push({
              requestId: obj.requestId,
              startX: this.nums.compWidth,
              startY: this.nums.maxHeight / this.nums.carsNum / 2 * (rightindex * 2 + 1),
              endX: 8,
              endY: this.nums.maxHeight / this.nums.nodesNum / 2 * (leftindex * 2 + 1),
              width: 3,
              color: "green",
              arrowhead: "url(#arrow2)",
            });
          }
          // console.table(this.nums.rightlines)
        }
        //-----------------步骤4：放置成功-----------------
        else if (step === 4) {
          const index = this.nums.info.findIndex(item => item.key === obj.requestId);
          if (index > -1) {
            this.nums.info.splice(index, 1);
          }
          this.nums.carsNum--;
          const index2 = this.nums.rightlines.findIndex(line => line.requestId === obj.requestId);
          if (index2 > -1) {
            this.nums.rightlines = this.nums.rightlines.filter((_, i) => i !== index2);
          }
          // console.table(this.nums.rightlines)
        }

      };
      this.ws.onerror = (event) => {
        console.error('TimeLine WebSocket error:', event);
      };
      this.ws.onclose = () => {
        console.log("TimeLine disconnected");
      };
    },
    closeWebSocket() {
      if (this.ws != null) {
        // this.nums.mastersNum = 0;
        // this.nums.nodesNum = 0;
        // this.nums.carsNum = 0;
        // this.nums.maxNum = 0;
        // this.nums.color = [];
        // this.nums.info = [];
        // this.nums.rightlines = [];
        this.ws.send("close");
        this.init();
        this.ws.close();
        this.ws = null;
      }
    }
  },
};
</script>

<style scoped>
.block {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}
</style> -->
