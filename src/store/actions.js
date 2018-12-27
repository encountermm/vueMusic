import * as types from './mutation-types'
import {
  playMode
} from 'assets/js/config'
import {
  shuffle
} from 'assets/js/util'
import {
  saveSearch,
  deleteSearch,
  clearSearch,
  savePlay
} from "assets/js/cache";



function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

export const selectPlay = ({
  commit,
  state
}, {
  list,
  index
}) => {
  // 提交设置歌曲列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 设置播放列表
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
    commit(types.SET_CURRENT_INDEX, index)
  } else {
    // 设置播放列表
    commit(types.SET_PLAYLIST, list)
    // 设置当前播放歌曲的索引
    commit(types.SET_CURRENT_INDEX, index)
  }

  // 设置播放器状态 全屏 or 小屏
  commit(types.SET_FULL_SCREEN, true)
  // 设置播放状态 播放 or 暂停
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = ({
  commit
}, {
  list
}) => {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  // 设置播放列表（随机播放）
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  // 设置当前播放歌曲的索引
  commit(types.SET_CURRENT_INDEX, 0)
  // 设置播放器状态 全屏 or 小屏
  commit(types.SET_FULL_SCREEN, true)
  // 设置播放状态 播放 or 暂停
  commit(types.SET_PLAYING_STATE, true)
}

// 插入歌曲
export const insertSong = function ({
  commit,
  state
}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表是否有待插入歌曲并返回其索引
  let fpIndex = findIndex(playList, song)
  // 插入歌曲，索引加一
  currentIndex++
  // 插入这首歌到当前索引位置
  playList.splice(currentIndex, 0, song)
  // 已包含
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }
  // 顺序播放列表  当前播放的索引
  let curreniSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(curreniSIndex, 0, song)
  // 插入顺序播放列表当前索引位置
  if (fsIndex > -1) {
    if (curreniSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 搜索历史

export const saveSearchHistory = function ({
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({
  commit
}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}


// 删除歌曲
export const deleteSong = function ({
  commit,
  state
}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function ({
  commit
}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function ({
  commit
}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}
