import jsonp from 'assets/js/jsonp'
import {
  commonParams,
  options
} from './config'
// import axios from 'axios';

export function getSingerList() {
  const url = "https://c.y.qq.com/v8/fcg-bin/v8.fcg"

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, options)
}

// // 获取vkey
// export function getMusicKey(songmid) {
//   const url = '/api/getMusicKey'
//   const data = Object.assign({}, commonParams, {
//     g_tk: 1405611313,
//     loginUin: 1120010842,
//     hostUin: 0,
//     format: 'json',
//     notice: 0,
//     platform: 'yqq',
//     needNewCode: 0,
//     data: {
//       "req_0": {
//         "module": "vkey.GetVkeyServer",
//         "method": "CgiGetVkey",
//         "param": {
//           "guid": "2778898976",
//           "songmid": [songmid],
//           "songtype": [0],
//           "uin": "1120010842",
//           "loginflag": 1,
//           "platform": "20"
//         }
//       },
//       "comm": {
//         "uin": 1120010842,
//         "format": "json",
//         "ct": 20,
//         "cv": 0
//       }
//     }
//   })
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     return Promise.resolve(res.data)
//   })
// }
