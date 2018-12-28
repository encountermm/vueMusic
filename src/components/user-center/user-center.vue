<template>
  <transition name="slide">
    <div class="user-center">
      <div
        class="back"
        @click="back"
      >
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches
          @switch="switchItem"
          :switches="switches"
          :currentIndex="currentIndex"
        ></switches>
      </div>
      <div
        class="play-btn"
        ref="playBtn"
        @click="random"
        v-show="!noResult"
      >
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div
        class="list-wrapper"
        ref="listWrapper"
      >
        <!-- 我的喜欢 -->
        <scroll
          class="list-scroll"
          v-if="currentIndex===0"
          :data="favoriteList"
          ref="favoriteList"
        >
          <div class="list-inner">
            <!-- song-list -->
            <song-list
              :songs="favoriteList"
              @select="selectSong"
            ></song-list>
          </div>
        </scroll>
        <!-- 最近播放的 -->
        <scroll
          class="list-scroll"
          v-if="currentIndex===1"
          :data="playHistory"
          ref="playHistory"
        >
          <div class="list-inner">
            <!-- song-list -->
            <song-list
              @select="selectSong"
              :songs="playHistory"
            ></song-list>
          </div>
        </scroll>
      </div>
      <!-- no result -->
      <div
        class="no-result-wrapper"
        v-show="noResult"
      >
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from "base/switches/switches";
import Scroll from "base/scroll/scroll";
import SongList from "base/songList/songList";
import { mapGetters, mapActions } from "vuex";
import NoResult from "base/no-result/no-result";
import Song from "assets/js/song";
import { playListMixin } from "assets/js/mixin";

export default {
  mixins: [playListMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {
          name: "我喜欢的"
        },
        {
          name: "最近听的"
        }
      ]
    };
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else {
        return !this.playHistory.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return "暂无收藏歌曲";
      } else {
        return "你还没有听过歌曲";
      }
    },
    ...mapGetters(["favoriteList", "playHistory"])
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.favoriteList && this.$refs.favoriteList.refresh();
      this.$refs.playList && this.$refs.playList.refresh();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    back() {
      this.$router.back();
    },
    selectSong(song) {
      this.insertSong(new Song(song));
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      if (list.length === 0) {
        return;
      }
      list = list.map(song => {
        return new Song(song);
      });
      this.randomPlay({
        list
      });
    },
    ...mapActions(["insertSong", "randomPlay"])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/stylus/variable'
.user-center
  position fixed
  top 0
  bottom 0
  z-index 100
  width 100%
  background $color-background
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
      line-height 32px
  .switches-wrapper
    margin 10px 0 15px 0
  .play-btn
    box-sizing border-box
    width 135px
    padding 7px 0
    margin 0 auto
    text-align center
    border 1px solid $color-theme
    color $color-theme
    border-radius 100px
    font-size 0
    .icon-play
      display inline-block
      vertical-align middle
      margin-right 6px
      font-size $font-size-medium-x
    .text
      display inline-block
      vertical-align middle
      font-size $font-size-small
  .list-wrapper
    position absolute
    top 90px
    bottom 0
    width 100%
    .list-scroll
      height 100%
      overflow hidden
      .list-inner
        padding 10px 5px
  .no-result-wrapper
    position absolute
    width 100%
    top 40%
    transform translateY(-50%)
</style>
