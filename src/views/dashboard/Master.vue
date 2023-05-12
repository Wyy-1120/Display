<template>
  <div>
    <div class="mastertubiao">
      <i class="el-icon-s-platform"></i>
    </div>
    <div>
      <span class="mastermas">master{{ id }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],
};
</script>

<style>
.mastertubiao {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
}
.el-icon-s-platform {
  font-size: 80px;
}
.mastermas {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  font-size: 30px;
  font-weight: bold;
}
</style>