<template>
  <div>
    <div class="nodetubiao">
      <i class="el-icon-monitor"></i>
    </div>
    <div>
      <span class="nodemas">node{{ id }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],
};
</script>

<style>
.nodetubiao {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
}
.el-icon-monitor {
  font-size: 50px;
}
.nodemas {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  font-size: 30px;
  font-weight: bold;
}
</style>