<template>
  <div>
    <!-- 第一列master结点 -->
    <div style="float: left;" :style="{ height: nums.maxHeight + 'px', width: nums.compWidth + 'px' }">
      <div v-for="master in nums.mastersNum" :key="master" class="com"
        :style="{ height: nums.maxHeight / nums.mastersNum + 'px', width: nums.compWidth + 'px' }">
        <Master :id="master" />
      </div>
    </div>
    <!-- 第二列箭头射线 -->
    <div style="float: left;" :style="{ height: nums.maxHeight + 'px', width: nums.compWidth + 'px' }">
      <svg :style="{ height: nums.maxHeight + 'px', width: nums.compWidth + 'px' }">
        <defs>
          <marker id="arrow1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <line v-for="(line, index) in nums.leftlines" :key="index" :x1="line.startX" :y1="line.startY" :x2="line.endX"
          :y2="line.endY" :stroke-width="line.width" :stroke="line.color" :marker-end="line.arrowhead" />
      </svg>
    </div>
    <!-- 第三列node结点 -->
    <div style="float: left;" :style="{ height: nums.maxHeight + 'px', width: nums.compWidth + 'px' }">
      <div v-for="node in nums.nodesNum" :key="node" class="com"
        :style="{ height: nums.maxHeight / nums.nodesNum + 'px', width: nums.compWidth + 'px' }">
        <node :id="node" />
      </div>
    </div>
    <!-- 第四列箭头射线 -->
    <div style="float: left;" :style="{ height: nums.maxHeight + 'px', width: nums.compWidth + 'px' }">
      <svg :style="{ height: nums.maxHeight + 'px', width: nums.compWidth + 'px' }">
        <defs>
          <marker id="arrow2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="green" />
          </marker>
        </defs>
        <line v-for="(line, index) in nums.rightlines" :key="index" :x1="line.startX" :y1="line.startY" :x2="line.endX"
          :y2="line.endY" :stroke-width="line.width" :stroke="line.color" :marker-end="line.arrowhead" />
      </svg>
    </div>
    <!-- 第五列车辆 -->
    <div style="float: left;" :style="{ height: nums.maxHeight + 'px', width: nums.compWidth + 'px' }">
      <div v-for="info in nums.info" :key="info.key" class="com"
        :style="{ height: nums.maxHeight / nums.carsNum + 'px', width: nums.compWidth + 'px' }">
        <i class="el-icon-truck" />
      </div>
    </div>
    <!-- 第六列车辆信息 -->
    <div style="float: left;" :style="{ height: nums.maxHeight + 'px', width: 250 + 'px' }">
      <div v-for="info in nums.info" :key="info.key" class="com" :style="{
        height: nums.maxHeight / nums.carsNum + 'px',
        width: 250 + 'px',
        color: nums.color.map(item => {
          if (item.key === info.key) {
            return item.value;
          }
        })
      }">
        <span class="info">{{ info.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Master from "./Master.vue";
import Node from "./Node.vue";
export default {
  name: "Structimage",
  components: {
    Master,
    Node
  },
  computed: {
    nums() {
      return this.$store.state.nums;
    },
  },
  mounted() {
    //如果车的数量发生变化，最大节点数、最大高度、右侧箭头位置都可能要发生变化
    this.$watch('nums.carsNum', (newVal) => {
      this.nums.maxNum = this.nums.nodesNum > this.nums.carsNum ? this.nums.nodesNum : this.nums.carsNum;
      this.nums.maxHeight = this.nums.compHeight * this.nums.maxNum;
      this.nums.rightlines.forEach(line => {
        const rightindex = this.nums.info.findIndex(item => item.key === line.requestId);
        line.startX = this.nums.compWidth;
        line.startY = this.nums.maxHeight / this.nums.carsNum / 2 * (rightindex * 2 + 1);
      });
    })
    //如果node的结点的数量发生变化，最大节点数、最大高度、左侧和右侧箭头位置都可能发生变化
    this.$watch('nums.nodesNum', (newVal) => {
      this.nums.maxNum = this.nums.nodesNum > this.nums.carsNum ? this.nums.nodesNum : this.carsNum;
      this.nums.maxHeight = this.nums.compHeight * this.nums.maxNum;
      this.nums.leftlines = []
      for (let i = 0; i < this.nums.nodesNum; i++) {
        this.nums.leftlines.push({
          startX: 3,
          startY: this.nums.maxHeight / 2,
          endX: this.nums.compWidth - 8,
          endY: this.nums.maxHeight / this.nums.nodesNum / 2 * (i * 2 + 1),
          width: 3,
          color: "black",
          arrowhead: "url(#arrow1)",
        });
      }
      this.nums.rightlines.forEach(line => {
        const rightindex = this.nums.info.findIndex(item => item.key === line.requestId);
        line.startX = this.nums.compWidth;
        line.startY = this.nums.maxHeight / this.nums.carsNum / 2 * (rightindex * 2 + 1);
      });
    })
    //根据node结点的数量初始化左侧箭头
    for (let i = 0; i < this.nums.nodesNum; i++) {
      this.nums.leftlines.push({
        startX: 3,
        startY: this.nums.maxHeight / 2,
        endX: this.nums.compWidth - 8,
        endY: this.nums.maxHeight / this.nums.nodesNum / 2 * (i * 2 + 1),
        width: 3,
        color: "black",
        arrowhead: "url(#arrow1)",
      });
    }
  },
};
</script>

<style>
li {
  list-style: none;
}

.el-icon-truck {
  font-size: 70px;
}

.com {
  display: flex;
  /*设置flex布局*/
  align-items: center;
  /*垂直居中*/
  justify-content: center;
  /*水平居中*/
  float: left;
}

.info {
  font-size: 18px;
  font-weight: bold;
}
</style>
