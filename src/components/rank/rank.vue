<template>
  <div
    class="rank"
    ref="rank"
  >
    <scroll
      class="topList"
      :data="topList"
      ref="topList"
    >
      <ul>
        <li
          class="item"
          v-for="(item,index) in topList"
          :key="index"
          @click="selectItem(item)"
        >
          <div class="icon"><img
              height="100"
              width="100"
              v-lazy="item.picUrl"
            ></div>
          <ul class="songlist">
            <li
              class="song"
              v-for="(song,index) in item.songList"
              :key="index"
            >
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div
        class="loading-container"
        v-show="!topList.length"
      >
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from "api/rank";
import { ERR_OK } from "api/config";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { playListMixin } from "assets/js/mixin";
import { mapMutations } from "vuex";

export default {
  mixins: [playListMixin],
  data() {
    return {
      topList: []
    };
  },
  created() {
    this._getTopList();
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.rank.style.bottom = bottom;
      this.$refs.topList.refresh();
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      console.log(item);
      this.setTopList(item);
    },
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    })
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/stylus/variable'
@import '~assets/stylus/mixin'
.rank
  position fixed
  width 100%
  top 88px
  bottom 0
.topList
  height 100%
  overflow hidden
.item
  display flex
  margin 0 15px
  padding-top 20px
  height 100px
  &:last-child
    padding-bottom 20px
  .icon
    flex 0 0 100px
    width 100px
    height 100px
  .songlist
    flex 1
    display flex
    flex-direction column
    justify-content center
    padding 0 20px
    height 100px
    overflow hidden
    background $color-highlight-background
    color #ccc
    font-size $font-size-small
    .song
      no-wrap()
      line-height 26px
.loading-container
  position absolute
  width 100%
  top 50%
  transform translateY(-50%)
</style>
