<template>
  <transition name="slide">
    <music-list
      :songs="songs"
      :title="title"
      :bg-image="bgImage"
    ></music-list>

  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail, getMusicKey } from "api/singer";
import { ERR_OK } from "api/config";
import { createSong } from "assets/js/song";
import MusicList from "components/music-list/music-list";

export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    this._getDetail();
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];

      list.forEach(item => {
        let { musicData } = item;
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
  },
  components: {
    MusicList
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/stylus/variable'
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>

