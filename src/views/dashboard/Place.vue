<template>
  <el-container>
    <el-aside style="width:70%;">
      <el-header>任务放置视图</el-header>
      <structimage></structimage>
      <!-- <tmp></tmp> -->
    </el-aside>
    <el-main>
      <el-header>时间线</el-header>
      <CreateProcess></CreateProcess>
    </el-main>
  </el-container>
</template>

<script>
import Structimage from "./Structimage.vue";
import CreateProcess from "./CreateProcess.vue";
import Tmp from "./Tmp.vue";
export default {
  components: {
    Structimage,
    CreateProcess,
    Tmp
  },
};
</script>

<style>
.el-header {
  background-color: #4a9eec;
  color: #ffffff;
  font-size: 30px;
  font-weight: 900;
  text-align: center;
  display:flex; 
  align-items:center;
  justify-content:center;
}

.el-aside {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  overflow: hidden;
  /* line-height: 40vh; */
}

.el-main {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  /* line-height: 70vh; */
  padding: 0 0 0 0;
}
</style>