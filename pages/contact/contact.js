Page({
  data: {
    colorList: [],
    // 节流阀
    isLoading: false
  },
  onLoad() {
    this.getRandomColor()
  },
  onReachBottom() {
    !this.data.isLoading && this.getRandomColor()
  },
  onPullDownRefresh() {
    this.setData({
      colorList: [],
      isLoading: false
    })
    this.getRandomColor(() => {
      wx.stopPullDownRefresh()
    })
  },

  getRandomColor(cb) {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      isLoading: true
    })
    wx.request({
      url: 'https://applet-base-api-t.itheima.net/api/color',
      method: 'GET',
      success: ({
        data: {
          data: colors
        }
      }) => {
        this.setData({
          colorList: [...this.data.colorList, ...colors]
        })
        if (this.data.colorList.length <= 5) {
          this.getRandomColor()
        }
      },
      complete: () => {
        wx.hideLoading()
        this.setData({
          isLoading: false
        })

        // wx.request 不是异步函数
        cb && cb()
      }
    })
  }
})