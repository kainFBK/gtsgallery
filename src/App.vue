<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import { Cell, CellGroup, Icon } from 'vant';

export default {
  components: {
    // [Cell.name]: Cell,
    // [CellGroup.name]: CellGroup,
    // [Icon.name]: Icon
  },
  data() {
    return {
      mode: 'random',
      deviceW: 0,
      deviceH: 0,
      mydpr: 0
    }
  },
  mounted() {
    this.$router.push(this.mode)
    // this.deviceH = window.screen.height
    // this.deviceW = window.screen.width
    // this.mydpr = window.devicePixelRatio
  }
}
</script>

<style>
body {
  background-color: #f8f8f8;
}

.van-cell__title .van-icon {
  font-size: 18px;
}
</style>
