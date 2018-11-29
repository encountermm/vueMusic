<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song,index)"
        v-for="(song,index) in songs"
        class="item"
        :key="song.id"
      >
        <div
          class="rank"
          v-show="rank"
        >
          <span
            :class="getRankCls(index)"
            v-text="getRankText(index)"
          ></span>
        </div>
        <div class="content">
          <h2 class="name">
            {{song.name}}
            <span class="right">{{format(song.duration)}}</span>
          </h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    selectItem(item, index) {
      this.$emit("select", item, index);
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    },
    format(interval) {
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/stylus/variable'
@import '~assets/stylus/mixin'
.song-list
  .right
    float right
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    .rank
      flex 0 0 25px
      width 25px
      margin-right 15px
      margin-left 15px
      text-align center
      .icon
        display inline-block
        width 25px
        height 24px
        background-size 25px 24px
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
      .text
        color $color-theme
        font-size $font-size-large
    .content
      flex 1
      line-height 20px
      padding 5px 15px
      overflow hidden
      position relative
    .content
      &:after
        content '  '
        position absolute
        left 10px
        right 10px
        bottom 0
        height 1px
        background-color #403e3e
        -webkit-transform scaleY(0.5)
        transform scaleY(0.5)
      .name
        no-wrap()
        color $color-text
      .desc
        no-wrap()
        margin-top 4px
        color $color-text-d
</style>
