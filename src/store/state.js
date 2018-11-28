import {
  playMode
} from 'assets/js/config'

const state = {
  // 歌手信息 Object{ id name avatar }
  singer: {},
  // 播放状态 Boolean
  playing: false,
  // 播放器全屏 Boolean
  fullScreen: false,
  // 当前歌曲播放列表 Array
  playList: [],
  // 顺序歌曲播放列表 Array
  sequenceList: [],
  // 播放模式 Object
  mode: playMode.sequence,
  // 当前播放歌曲索引
  currentIndex: -1,
  // 歌单详情
  disc: {}
}

export default state