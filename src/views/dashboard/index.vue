<template>
  <div class="dashboard-container">
    <Place></Place>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Place from './Place.vue'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: {
    Place
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  // &-container {
  //   margin: 30px;
  // }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
