// 歌手信息
export const singer = state => state.singer
// 是否播放
export const playing = state => state.playing
// 播放器是否全屏
export const fullScreen = state => state.fullScreen
// 获取的播放列表
export const playList = state => state.playList
// 播放模式下的列表（循环，单曲，随机播放）
export const sequenceList = state => state.sequenceList
// 播放模式（循环，单曲，随机播放）
export const mode = state => state.mode
// 当前播放歌曲的索引
export const currentIndex = state => state.currentIndex
// 当前播放歌曲
export const currentSong = state => {
  return state.playList[state.currentIndex] || {}
}
// 歌单信息
export const disc = state => state.disc

export const topList = state => state.topList

export const searchHistory = state => state.searchHistory
