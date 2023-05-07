<template>
  <div>
    <div class="tubiao">
      <i class="el-icon-s-platform" style="float: center"></i>
    </div>
    <div>
      <span class="mas">master</span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.tubiao {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
}
.el-icon-s-platform {
  font-size: 80px;
}
.mas {
  display: flex; /*设置flex布局*/
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  font-size: 30px;
  font-weight: bold;
}
</style>