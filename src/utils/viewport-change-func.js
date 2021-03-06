const recycleData = require('./recycle-data.js')

module.exports = function _recycleViewportChange(e, cb) {
  const detail = e.detail
  // console.log('data change transfer use time', Date.now() - e.detail.timeStamp)
  var newList = []
  var item = recycleData[detail.id]
  // 边界值判断, 避免造成异常, 假设先调用了createRecycleContext, 然后再延迟2s调用append插入数据的情况
  if (!item || !item.list) return
  var dataList = item.list
  var pos = detail.data
  var beginIndex = pos.beginIndex
  var endIndex = pos.endIndex
  item.pos = pos
  // 加ignoreBeginIndex和ignoreEndIndex
  if (typeof beginIndex === 'undefined' || beginIndex == -1 || typeof endIndex === 'undefined' || endIndex == -1) {
    newList = []
  } else {
    let i = -1
    for (i = beginIndex; i < dataList.length && i <= endIndex; i++) {
      if (i >= pos.ignoreBeginIndex && i <= pos.ignoreEndIndex)
        continue
      newList.push(dataList[i])
    }
  }
  var obj = {
    batchSetRecycleData: !this.data.batchSetRecycleData
  }
  const setDataStart = +new Date
  obj[item.key] = newList
  const comp = this.selectComponent('#' + detail.id)
  // comp.setList(item.key, newList)
  comp._setInnerBeforeAndAfterHeight({
    beforeHeight: pos.minTop,
    afterHeight: pos.afterHeight
  })
  // console.log('before set recycleData')
  this.setData(obj, function () {
    cb && cb()
    // console.log('set recycleData data use time', Date.now() - setDataStart, JSON.stringify(pos))
  })
}