<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bgImage="bgImage"
      :songs="songs"
      :rank="true"
    ></music-list>
  </transition>
</template>
<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getTopListDetail } from "api/rank";
import { ERR_OK } from "api/config";
import { createSong } from "assets/js/song";
import { getMusicKey } from "api/singer";

export default {
  data() {
    return {
      songs: [],
      rank: true
    };
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters(["topList"]),
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return "";
    }
  },
  created() {
    this._getTopListDetail();
  },
  methods: {
    _getTopListDetail() {
      if (!this.topList.id) {
        this.$router.push("/rank");
        return;
      }

      getTopListDetail(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeList(res.songlist);
        }
      });
    },
    _normalizeList(list) {
      let ret = [];
      list.forEach(item => {
        const musicData = item.data;
        getMusicKey(musicData.songmid).then(res => {
          if (res.code === ERR_OK) {
            let purl = res.req_0.data.midurlinfo[0].purl;
            if (musicData.songid && musicData.albummid) {
              ret.push(createSong(musicData, purl));
            }
          }
        });
      });
      return ret;
    }
  }
};
</script>
<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>