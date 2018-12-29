<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    @scrollToEnd="_searchMore"
    :beforeScroll="beforeScroll"
    @beforeScroll="listScroll"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="item in result"
        :key="item.key"
        @click="selectItem(item)"
      >
        <div class="icon"><i :class="getIconCLs(item)"></i></div>
        <div class="name">
          <p
            class="text"
            v-html="getDisplayName(item)"
          ></p>
        </div>
      </li>
      <loading
        v-show="hasMore"
        title=""
      ></loading>
      <div
        v-show="!hasMore && !result.length"
        class="no-result-wrapper"
      >
        <no-result title="抱歉，暂无搜索结果"></no-result>
      </div>
    </ul>
  </scroll>
</template>

<script>
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { getMusicKey } from "api/singer";
import { createSong } from "assets/js/song";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import Singer from "assets/js/singer";
import { mapMutations, mapActions } from "vuex";
import NoResult from "base/no-result/no-result";

const TYPE_SINGER = "singer";
const perpage = 20;

export default {
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true
    };
  },
  methods: {
    getIconCLs(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    _search() {
      if (this.query) {
        this.page = 1;
        this.hasMore = true;
        this.$refs.suggest.scrollTo(0, 0);
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data);
            this._checkMore(res.data);
          }
        });
      }
    },
    _searchMore() {
      if (!this.hasMore) {
        return false;
      } else {
        this.page++;
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            const handleData = this._genResult(res.data);
            if (handleData[0].type && handleData[0].type === TYPE_SINGER) {
              handleData.shift();
            }
            this.result = this.result.concat(handleData);
            this._checkMore(res.data);
          }
        });
      }
    },
    refresh() {
      this.$refs.suggest.refresh();
    },
    listScroll() {
      this.$emit("listScroll");
    },
    selectItem(item) {
      if (item.type && item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        getMusicKey(item.mid).then(res => {
          if (res.code === ERR_OK) {
            let purl = res.req_0.data.midurlinfo[0].purl;
            item.url = `http://isure.stream.qqmusic.qq.com/${purl}`;
            this.insertSong(item);
          }
        });
      }
      this.$emit("select");
    },
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage > song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }

      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (
          musicData.songid &&
          (musicData.albumid || musicData.albumid === 0)
        ) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },
  watch: {
    query() {
      this._search();
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/stylus/variable'
@import '~assets/stylus/mixin'
.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      align-items center
      padding-bottom 20px
    .icon
      flex 0 0 30px
      width 30px
      [class^='icon-']
        font-size 14px
        color $color-text-d
    .name
      flex 1
      font-size $font-size-medium
      color $color-text-d
      overflow hidden
      .text
        no-wrap()
  .no-result-wrapper
    // position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
