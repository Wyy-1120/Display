<template>
  <div>
    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
        >
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
      activities: [],
      // count: 1,
    };
  },
  computed: {
    nums() {
      return this.$store.state.nums;
    },
  },
  methods: {
    ...mapActions(["clear"]),
  },
  mounted() {
    const ws = new WebSocket("ws://localhost:8089/websocket");
    ws.onopen = () => {
      console.log("connected");
    };
    ws.onmessage = (event) => {
      const obj = JSON.parse(event.data);
      const step = obj.step;
      if (step === 1) {
        this.activities.push({
          content: obj.user + " 创建了任务 " + obj.task,
          timestamp: obj.time,
          size: "large",
          type: "primary",
          icon: "el-icon-more",
        });
        this.nums.info = [];
        this.nums.info.push({
          content: obj.user + " 创建了任务 " + obj.task,
        });
      } else if (step === 2) {
        this.activities.push({
          icon: "el-icon-edit",
          type: "primary",
          color: "green",
          size: "large",
          timestamp: obj.timeStamp,
          content:
            "任务将被放置到节点 " +
            obj.node +
            " , 分配的资源为cpu" +
            obj.cpuSize +
            "m, 内存" +
            obj.memorySize +
            "Mi.",
        });
        if(obj.node == "node1"){
          this.nums.isNode1Visible = true;
        }
        else if(obj.node == "node2"){
          this.nums.isNode2Visible = true;
        }
        this.nums.info = [];
        this.nums.info.push({
          content:
            "任务将被放置到节点 " +
            obj.node +
            " , 分配的资源为cpu" +
            obj.cpuSize +
            "m, 内存" +
            obj.memorySize +
            "Mi.",
        });
      } else if (step === 3) {
        this.activities.push({
          icon: "el-icon-view",
          type: "primary",
          color: "green",
          size: "large",
          timestamp: obj.timeStamp,
          content: "放置成功, 应用地址为 https://" + obj.url,
        });
        if(obj.node == "node1"){
          this.nums.node1Color = "green";
        }
        else if(obj.node == "node2"){
          this.nums.node2Color = "green";
        }
        this.nums.infoColoe = "green";
        this.nums.info = [];
        this.nums.info.push({
          content: "放置成功, 应用地址为 https://" + obj.url,
        });
      } else if (step === 4) {
        this.activities.push({
          type: "primary",
          size: "large",
          color: "red",
          content: "----------------------------------------------------------",
        });
        // this.nums.info.pop();
        this.nums.info = [];
        this.nums.isNode1Visible = false;
        this.nums.isNode2Visible = false;
        this.nums.node1Color = "black";
        this.nums.node2Color = "black";
        this.nums.infoColoe = "black";
      }
    };
    ws.onclose = () => {
      console.log("disconnected");
      
    };
  },
};
</script>

<style scoped>
.block {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}
/* .el-timeline-item {
  line-height:  0vh;
} */
</style>
