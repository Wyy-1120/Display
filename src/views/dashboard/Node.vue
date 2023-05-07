<template>
  <div>
    <div class="tubiao">
      <i class="el-icon-monitor" style="float: center"></i>
    </div>
    <div>
      <span class="mas">node{{ id }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],
};
</script>

<style>
.tubiao {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
}
.el-icon-monitor {
  font-size: 50px;
}
.mas {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  font-size: 30px;
  font-weight: bold;
}
</style>