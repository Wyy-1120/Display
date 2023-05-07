<template>
  <div>
    <div class="master" style="float: left; height: 400px; width: 150px">
      <Master
        v-for="master in masters"
        :key="master.id"
        :id="master.id"
      ></Master>
    </div>
    <div style="float: left; height: 400px; width: 150px">
      <svg :width="svgWidth" :height="svgHeight">
        <defs>
          <marker
            id="arrow1"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <line
          :x1="0"
          :y1="svgHeight"
          :x2="svgWidth - 8"
          :y2="svgHeight / 2 - 8"
          stroke="black"
          stroke-width="3"
          marker-end="url(#arrow1)"
        />
      </svg>
      <svg :width="svgWidth" :height="svgHeight">
        <defs>
          <marker
            id="arrow2"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <line
          :x1="0"
          :y1="0"
          :x2="svgWidth - 8"
          :y2="svgHeight / 2 - 8"
          stroke="black"
          stroke-width="3"
          marker-end="url(#arrow2)"
        />
      </svg>
    </div>
    <div style="float: left; height: 400px; width: 150px">
      <div class="nodes" style="height: 200px; width: 150px">
        <node :id="1"></node>
      </div>
      <div class="nodes" style="height: 200px; width: 150px">
        <node :id="2"></node>
      </div>
    </div>
    <div style="float: left; height: 400px; width: 150px">
      <svg :width="svgWidth" :height="svgHeight">
        <defs>
          <marker
            id="arrow3"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
            :style="{ visibility: nums.isNode1Visible ? 'visible' : 'hidden' }"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" :fill="nums.node1Color"/>
          </marker>
        </defs>
        <line
          :x1="svgWidth"
          :y1="svgHeight"
          :x2="8"
          :y2="svgHeight / 2 - 8"
          :stroke="nums.node1Color"
          stroke-width="3"
          marker-end="url(#arrow3)"
          :style="{ visibility: nums.isNode1Visible ? 'visible' : 'hidden' }"
        />
      </svg>
      <svg :width="svgWidth" :height="svgHeight" >
        <defs>
          <marker
            id="arrow4"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
            :style="{ visibility: nums.isNode2Visible ? 'visible' : 'hidden' }"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" :fill="nums.node2Color"/>
          </marker>
        </defs>
        <line
          :x1="svgWidth"
          :y1="0"
          :x2="8"
          :y2="svgHeight / 2 - 8"
          :stroke="nums.node2Color"
          stroke-width="3"
          marker-end="url(#arrow4)"
          :style="{ visibility: nums.isNode2Visible ? 'visible' : 'hidden' }"
        />
      </svg>
    </div>
    <div class="car">
      <i class="el-icon-truck"></i>
    </div>
    <div class="info" :style="{color:nums.infoColoe}">
      <span v-for="(info, index) in nums.info" :key="index">{{
        info.content
      }}</span>
    </div>
  </div>
</template>

<script>
import Master from "./Master.vue";
import Node from "./Node.vue";
export default {
  components: {
    Master,
    Node,
  },
  name: "Structimage",
  data: function () {
    return {
      masters: [{ id: 1 }],
      nodes: [{ id: 1 }, { id: 2 }],
      svgWidth: 150,
      svgHeight: 200,
    };
  },
  computed: {
    nums() {
      return this.$store.state.nums;
    },
  },
};
</script>

<style>
/* .worker{
    font-size: 40px;
    float: left;
}
.master{
    font-size: 50px;
    float: left;
} */
li {
  list-style: none;
}
.el-icon-monitor {
  font-size: 50px;
}

.master {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
}
.nodes {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  height: 150px;
  width: 150px;
}
.car {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  height: 400px;
  width: 100px;
  font-size: 80px;
  float: left;
}
.info {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  height: 400px;
  width: 200px;
  font-size: 20px;
  font-weight: bold;
}
</style>