import '@taojimu/widget-runtime';
import polyfillToast from '../util/polyfillToast';

Component({
  mixins: [],
  data: {
    itemDetail: '',
    // toast
    showToast: {
      visible: false,
      animationClass: '',
      type: '',
      content: ''
    },
  },
  onInit() {
    console.log('onInit');
    polyfillToast.bind(this)();
    this.getSceneInfo();
  },
  didMount() {
    console.log('onDidMount');
    this.onGetItemDetail();
    my.showToast({
      type: 'success',
      content: '我是好孩子我是好孩子我是好孩子我是好孩子我是好孩子我是好孩子我是好孩子我是好孩子我是好孩子我是好孩子',
      duration: 0,
    });
  },
  didUnmount() {
    this.willUnmount = 1;
  },
  methods: {
    setDataPromise(...args) {
      return new Promise((resolve) => {
        if (this.willUnmount) {
          return;
        }
        this.setData(...args, () => resolve());
      });
    },
    getSceneInfo() {
      return new Promise((resolve, reject) => {
        my.getSceneInfo({
          success: res => {
            console.log('getSceneInfo', JSON.stringify(res));
            resolve(res);
          },
          fail: err => {
            reject(err);
          }
        });
      })
    },
    getConfigData() {
      return new Promise((resolve, reject) => {
        my.tb.getConfigData({
          success: res => {
            console.log('getConfig的返回值', res);
            // @note 非常重要，请注意数据的存取判断逻辑，如下的判断逻辑兼容线上、IDE、可视化编辑数据的存取方式，请务必按照如下方式进行存取。
            let webapp;
            if (!res) {
              return reject('getConfigData illegal');
            }
            webapp = res.webapp;
            if (!webapp) {
              webapp = res.data && res.data.webapp;
            }
            if (!webapp) {
              webapp = res.data && res.data.data && res.data.data.webapp;
            }
            if (!webapp) {
              webapp = res.data && res.data.data;
            }
            if (!webapp) {
              return reject('getConfigData illegal');
            }
            resolve(webapp);
          },
          fail: err => {
            console.log('getConfigData fail', err);
            reject('getConfigData fail')
          }
        });
      });
    },
    onGetSceneInfo() {
      this.getSceneInfo().then(sceneInfo => {
        my.alert({
          content: `success: ${JSON.stringify(sceneInfo)}`
        });
      }).catch(reason => {
        my.alert({
          content: `fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onGetConfigData() {
      this.getConfigData()
      .then(configData => {

      })
      .catch(reason => {
        my.showToast({
          content: `getconfigdata fail: ${JSON.stringify(reason)}`
        });
      })
    },
    onGetSceneId() {
      this.getSceneInfo().then(({sceneInfo}) => {
        my.alert({
          content: `success: ${sceneInfo.sceneId}`
        });
      }).catch(reason => {
        my.alert({
          content: `fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onGetPageUrl() {
      this.getSceneInfo().then(({sceneInfo}) => {
        my.alert({
          content: `success: ${sceneInfo.pageUrl}`
        });
      }).catch(reason => {
        my.alert({
          content: `fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onGetOrderId() {
      this.getSceneInfo().then(({sceneInfo}) => {
        my.alert({
          content: `success: orderId: ${sceneInfo.orderId}, realOrderId: ${sceneInfo.realOrderId}`
        });
      }).catch(reason => {
        my.alert({
          content: `fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onGetPageConf() {
      this.getSceneInfo().then(({sceneInfo}) => {
        my.alert({
          content: `success: ${sceneInfo.pageConf && JSON.stringify(sceneInfo.pageConf) || '暂时不存在pageConf'}`
        });
      }).catch(reason => {
        my.alert({
          content: `fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onGetItemDetail() {
      this.getConfigData()
      .then(configData => {
        const { scenes, items } = configData;
        const itemId = scenes && scenes.item && scenes.item.length && scenes.item[0] || (items && items.length && items[0]) || '';
        if (!itemId) {
          return this.setData({
            itemDetail: '配置应用未包含itemId'
          })
        }
        my.tb.tjmItemGetDetail({
          ids: [itemId]
        }).then(res => {
          if (Array.isArray(res)) {
            this.setData({
              itemDetail: JSON.stringify(
                Object.assign({
                  auction_id: res[0].auction_id,
                }, res[0].finalDisplayPrice)
              )
            });
          }
        }).catch(err => {
          console.log('my.tb.tjmItemGetDetail fail', JSON.stringify(err));
          this.setData({
            itemDetail: `宝贝${itemId}查询失败: ${JSON.stringify(err)}`
          });
        });
      })
      .catch(reason => {
        my.showToast({
          content: `fail: ${JSON.stringify(reason)}`
        });
      })
    },
    onGetStore() {
      my.tb.tjmGetStore()
      .then(({ data: store }) => {
        this.setData({ store: JSON.stringify(store) });
      })
      .catch((reason) => {
        console.log('getStore fail ', JSON.stringify(reason));
      })
    },
    onSaveStore() {
      const expando = (function() {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate()
        ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
          date.getMinutes()
        ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
      })();
      my.tb.tjmSetStore({
        data: {
          expando
        },
        success: () => {
          this.setData({ store: JSON.stringify({ expando }) });
          my.alert({
            content: `saveStore success: ${JSON.stringify({ expando }) }`,
            success() {
            }
          });
        },
        fail(reason) {
          my.alert({
            content: `saveStore fail: ${JSON.stringify(reason)}`
          });
        }
      })
    },
    onOpenDetail() {
      my.alert({
        content: my.tb.openDetail.toString(),
        success: () => {
          my.tb.openDetail({
            itemId: '663452251907'
          });
        }
      });
    },
    onDrawPrize() {
      this.getConfigData()
      .then(configData => {
        const { scenes } = configData;
        const oright = scenes && scenes.oright;
        if (!oright) {
          my.showToast({
            content: `没有选择奖池数据`
          });
          return;
        }
        my.tb.tjmDrawPrize({
          ename: oright.ename,
          type: oright.type,
        }).then(res => {
          my.alert({
            content: `drawPrize success: ${JSON.stringify(res)}`
          });
        }).catch(res => {
          my.alert({
            content: `drawPrize fail: ${JSON.stringify(res)}`
          });
        });
      })
      .catch(reason => {
        my.showToast({
          content: `get ConfigData fail: ${JSON.stringify(reason)}`
        });
      })
    },
    onDrawCoupon() {
      this.getConfigData()
      .then(configData => {
        const { scenes } = configData;
        const coupons = scenes && scenes.coupons;
        const couponsPrefetchData = scenes && scenes.couponsPrefetchData;
        if (!coupons || !coupons.length || !couponsPrefetchData || !couponsPrefetchData.length) {
          my.showToast({
            content: `没有选择优惠券数据`
          });
          return;
        }
        const { spreadId, supplierId, amount, couponTag, terminals } = couponsPrefetchData[0];
        let info = '';
        if (!isNaN(parseFloat(amount, 10))) {
          info = `面值 ${parseFloat(amount, 10) / 100} 元`;
        }
        my.tb.tjmCouponApply({
          spreadId,
          supplierId,
          couponTag,
          terminals,
        }).then(res => {
          my.alert({
            content: `成功领取${info}优惠券: ${JSON.stringify(res)}`
          });
        }).catch(res => {
          my.alert({
            content: `领取${info}优惠券失败: ${JSON.stringify(res)}`
          });
        });
      })
      .catch(reason => {
        my.showToast({
          content: `fail: ${JSON.stringify(reason)}`
        });
      })
    },
    onNavigation() {
      my.tb.tjmGetRelationTaojimuUrl()
      .then(res => {
        my.alert({
          content: `success: ${res.url}`,
          success() {
            my.tb.navigateToRelationTaojimuPage({
              success: (res) => {
                my.alert({
                  content: `navigateToRelationTaojimuPage success: ${JSON.stringify(res)}`
                });
              },
              fail: (res) => {
                // res = { error: string } // 失败原因
                console.log('navigateToRelationTaojimuPage fail ', res);
                my.alert({
                  content: `navigateToRelationTaojimuPage fail: ${JSON.stringify(res)}`
                });
              },
            });
          }
        });
      })
      .catch(reason => {
        console.log('tjmGetRelationTaojimuUrl fail ', reason);
        my.alert({
          content: `tjmGetRelationTaojimuUrl fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onShare() {
      my.showSharePanel({
        query: {
          from: 'youwenda-share'
        },
        title: '0元预约抽好礼',
        desc: '现在预约可抽取大礼哦',
        imageUrl: 'https://gw.alicdn.com/imgextra/i3/O1CN01NZAiYq1IWhdR2feH3_!!6000000000901-0-tps-500-500.jpg_q75.jpg_.webp',
        success: function (res) {
          console.log('showSharePanel成功：', JSON.stringify(res));
        },
        fail: function (res) {
          console.log('showSharePanel失败：', JSON.stringify(res));
        }
      });
    },
    onJoinMember() {
      my.getSceneInfo({
        success(res) {
          const { sceneInfo } = res;
          const { sellerId } = sceneInfo;
          my.tb.tjmMemberJoin({
            sellerId: '2064892827'
          }).then(res => {
            my.showToast({
              content: `入会success: ${JSON.stringify(res)}`
            });
          }).catch(err => {
            my.showToast({
              content: `入会fail: ${JSON.stringify(err)}`
            });
          })
        }
      })
    },
    onFavorMiniapp() {
      this.getConfigData()
      .then(configData => {
        const { scenes } = configData;
        const task = scenes && scenes.task;
        if (!task || !task.tasks || !Array.isArray(task.tasks) || !task.tasks.find(task => task.taskContent.type === 'favorMiniapp')) {
          my.showToast({
            content: '未配置关注频道任务'
          });
          return;
        }
        const { label, miniappId } = task.tasks.find(task => task.taskContent.type === 'favorMiniapp').taskContent;
        my.tb.tjmTaskFavorMiniapp({ id: miniappId }).then(res => {
          my.alert({
            content: `关注频道${label}成功: ${JSON.stringify(res)}`
          });
        }).catch(res => {
          my.alert({
            content: `关注频道${label}失败: ${JSON.stringify(res)}`
          });
        });
      })
      .catch(reason => {
        my.showToast({
          content: `fail: ${JSON.stringify(reason)}`
        });
      })
    }
  }
});