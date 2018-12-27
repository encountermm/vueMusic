<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <search-box
        ref="searchBox"
        @query="onQueryChange"
      ></search-box>
    </div>
    <!-- 主区域 -->
    <div
      class="shortcut-wrapper"
      ref="shortcutWrapper"
    >
      <scroll
        ref="shortcut"
        class="shortcut"
        :data="shortcut"
        :refreshDelay="refreshDelay"
      >
        <div v-show="!query">
          <!-- 热门搜索 -->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                class="item"
                v-for="item in hotKey"
                :key="item.n"
              >
                <span @click="addQuery(item.k)">{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!-- 搜索历史 -->
          <div
            class="search-history"
            v-show="searchHistory.length"
          >
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span
                class="clear"
                @click="showConfirm"
              >
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              @delete="deleteSearchHistory"
              @select="addQuery"
              :searches="searchHistory"
            ></search-list>
          </div>
        </div>
      </scroll>
      <!-- 搜索列表 -->
      <div
        class="search-result"
        ref="searchResult"
        v-show="query"
      >
        <suggest
          :query="query"
          @listScroll="blurInput"
          @select="saveSearch"
          ref="suggest"
        ></suggest>
      </div>
    </div>
    <!-- 弹窗 -->
    <confirm
      ref="confirm"
      @confirm="clearSearchHistory"
      text="是否清空所有搜索历史"
      confirmBtnText="清空"
    ></confirm>
    <!-- 跳转路由 -->
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from "base/searchBox/searchBox";
import Suggest from "components/suggest/suggest";
import SearchList from "base/search-list/search-list";
import Confirm from "base/confirm/confirm";
import Scroll from "base/scroll/scroll";
import { getHotKey } from "api/search";
import { ERR_OK } from "api/config";
import { mapActions } from "vuex";
import { playListMixin, searchMixin } from "assets/js/mixin";

export default {
  mixins: [playListMixin, searchMixin],
  created() {
    this._getHotKey();
  },
  data() {
    return {
      hotKey: []
    };
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    }
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";

      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();

      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    ...mapActions(["clearSearchHistory"])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/stylus/variable'
@import '~assets/stylus/mixin'
.search
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d
      .search-history
        position relative
        margin 0 20px
        .title
          display flex
          align-items center
          height 40px
          font-size $font-size-medium
          color $color-text-l
          .text
            flex 1
          .clear
            extend-click()
            .icon-clear
              font-size $font-size-medium
              color $color-text-d
  .search-result
    position fixed
    width 100%
    top 178px
    bottom 0
</style>


