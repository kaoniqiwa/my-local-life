Page({
  data: {
    query: {},
    shopList: [],
    page: 1,
    pageSize: 10,
    total: 0,
    isLoading: false,
    requestTask: null
  },
  onLoad(query) {
    // 路径参数
    this.setData({
      query
    })
    this.getShopList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.query.title,
    })
  },
  onPullDownRefresh() {
    this.setData({
      page: 1,
      shopList: [],
      total: 0,
    })

    this.getShopList(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    if (this.data.isLoading) return
    if (this.data.shopList.length >= this.data.total) {
      wx.showToast({
        title: '数据加载完毕',
        icon: "none"
      })
      return
    }

    this.setData({
      page: ++this.data.page
    })

    this.getShopList()
  },

  onUnload() {
    // 页面退出时，终止请求
    this.data.requestTask?.abort()
  },
  getShopList(cb) {
    // 等待当前请求完成后才能发送请求
    this.setData({
      isLoading: true
    })
    wx.showLoading({
      title: '数据加载中...',
    })
    const requestTask = wx.request({
      url: `https://applet-base-api-t.itheima.net/categories/${this.data.query.id}/shops`,
      data: {
        _page: this.data.page,
        _limit: this.data.pageSize
      },
      success: (res) => {
        // 回调函数 success ,fail 是 wx API 内部出错时调用，服务器 404 也会走 success，因为请求成功，只是请求结果是服务器返回的 404
        if (res.statusCode === 200) {
          const {
            data,
            header
          } = res
          this.setData({
            shopList: [...this.data.shopList, ...data],
            // 如果没有传递 page 信息，则无 X-Total-Count 响应头
            total: header['X-Total-Count'] ? +header['X-Total-Count'] : data.length
          })
        }

      },
      fail: (err) => {
        console.log('fail', err);
      },
      complete: () => {
        wx.hideLoading()
        this.setData({
          isLoading: false
        })

        // 停止下拉动画
        cb && cb()
      }
    })
    this.setData({
      requestTask: requestTask
    })
  }
})