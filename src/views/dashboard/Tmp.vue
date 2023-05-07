<template>
    <div>
      <!-- <div>
        <Node v-for="node in nodes" :key="node.id" :id="node.id"></Node>
        <i v-for="node in nodes" :key="node.id" class="el-icon-monitor">  node{{id}}</i>
      </div> -->
      <div class="ima" v-for="num in nums.tasks" :key="num.id">
        <i class="el-icon-truck" style="font-size: 50px"></i>
        <i
          class="el-icon-minus"
          style="font-size: 50px"
          v-for="num in minusNums"
          :key="num.id"
        ></i>
        <i
          class="el-icon-right"
          style="font-size: 50px"
          v-for="num in rightNums"
          :key="num.id"
        ></i>
        <i class="el-icon-s-platform" style="font-size: 50px"></i>
        <span class="info" style="font-size: 20px" mar
          >任务放置成功！</span
        >
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Structimage",
    data: function () {
      return {
        //   nums: [],
        minusNums: [{ id: 1 }, { id: 2 }, { id: 3 }],
        rightNums: [{ id: 1 }],
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
  .info {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-icon-monitor {
    font-size: 35px;
  }
  .el-icon-s-platform {
    font-size: 35px;
  }
  .ima {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 220px;
  }
  </style>