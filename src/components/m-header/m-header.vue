<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Kimi Music</h1>
    <!-- 个人中心 -->
    <router-link
      tag="div"
      class="mine"
      to="/user"
    >
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/variable'
@import '../../assets/stylus/mixin'
.m-header
  position relative
  height 44px
  text-align center
  color $color-theme
  font-size 0
  .icon
    display inline-block
    vertical-align top
    mar-top 6px
    width 30px
    height 32px
    margin-right 9px
    bg-image('logo')
    background-size 30px 32px
    margin-top 5px
  .text
    display inline-block
    vertical-align top
    line-height 44px
    font-size $font-size-large
  .mine
    position absolute
    top 0
    right 0
    .icon-mine
      display block
      padding 12px
      font-size 20px
      color $color-theme
</style>
