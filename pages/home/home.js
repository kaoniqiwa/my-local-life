Page({
  data: {
    // 存放轮播图数据
    swiperList: [],
    // 存放九宫格数据
    gridList: []
  },
  onLoad() {
    this.getSwiperList()
    this.getGridList()
  },
  /**
   * 获取轮播图
   */
  getSwiperList() {
    wx.request({
      url: 'https://applet-base-api-t.itheima.net/slides',
      method: 'GET',
      success: ({
        data
      }) => {
        this.setData({
          swiperList: data
        })
      }
    })
  },
  /**
   * 获取九宫格
   */
  getGridList() {
    wx.request({
      url: 'https://applet-base-api-t.itheima.net/categories',
      method: "GET",
      success: ({
        data
      }) => {
        this.setData({
          gridList: data
        })
      }
    })
  }
})