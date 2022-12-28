import '@taojimu/widget-runtime';
import polyfillToast from '../util/polyfillToast';

const Mock = {
  sellerId: '2247603103'
};

Component({
  mixins: [],
  data: {
    itemDetail: '',
    // toast
    showToast: {
      visible: false,
      type: '',
      content: ''
    },
  },
  onInit() {
    console.log('onInit');
    polyfillToast.bind(this)();
    this.registerTaskEnv();
  },
  didMount() {
    console.log('onDidMount');
  },
  methods: {
    getSceneInfo() {
      return new Promise((resolve, reject) => {
        my.showLoading();
        my.getSceneInfo({
          success: res => {
            console.log('getSceneInfo', JSON.stringify(res));
            resolve(res);
          },
          fail: err => {
            reject(err);
          },
          complete: () => {
            my.hideLoading();
          }
        });
      })
    },
    getConfigData() {
      return new Promise((resolve, reject) => {
        my.showLoading();
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
            // 如何判断是否在可视化编辑模式下。
            // 注意要判断TJM 这个对象是否存在，开发环境不存在这个变量。
            const isIDE = webapp.TJM && webapp.TJM.isIDE;
            resolve(webapp);
          },
          fail: err => {
            console.log('getConfigData fail', err);
            reject('getConfigData fail')
          },
          complete: () => {
            my.hideLoading();
          }
        });
      });
    },
    onGetSceneInfo() {
      this.getSceneInfo().then(sceneInfo => {
        my.alert({
          content: `my.getSceneInfo success: ${JSON.stringify(sceneInfo)}`
        });
      }).catch(reason => {
        my.alert({
          content: `my.getSceneInfo fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onGetConfigData() {
      this.getConfigData()
      .then(configData => {
        my.alert({
          content: `my.getConfigData success: ${JSON.stringify(configData)}`
        });
      })
      .catch(reason => {
        my.showToast({
          content: `my.getConfigData fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onGotoDocs() {
      my.showToast({
        content: '需要申请外跳权限后，方可支持跳转，3s后执行跳转',
        duration: 3e3,
        success: () => {
          my.tb.tjmNavigateToOutside({
            url: 'https://mos.m.taobao.com/taojimu/docs#/widget/runtime',
            succes() {
              my.showToast({
                content: '跳转成功'
              });
            },
            fail: (res) => {
              my.showToast({
                content: `跳转失败，原因是: ${res.error}`
              });
            }
          })
        }
      })
    },
    onShopFavor() {
      my.tb.tjmShopFavor({
        // 测试环境下可以随便指定一个sellerId, 发布线上后，sellerId 会被修正为制作页面的那个商家
        sellerId: Mock.sellerId,
        success: (res) => {
          console.log('tjmShopFavor success ', res);
          my.showToast({
            content: '订阅成功！可在「淘宝首页-订阅」看TA的动态哦',
          });
        },
        fail: (res) => {
          // res = { error: string } // 订阅店铺失败原因
          console.log('tjmShopFavor fail ', res);
          my.showToast({
            content: res.error
          });
        },
      });
    },
    onGetItemDetail() {
      this.getConfigData()
      .then(configData => {
        const { scenes } = configData;
        const itemId = scenes && scenes.item && scenes.item.length && scenes.item[0];
        if (!itemId) {
          return my.showToast({
            content: '配置应用中未设置商品数据'
          });
        }
        const itemPrefetchData = scenes.itemPrefetchData[0];
        my.tb.tjmItemGetDetail({
          ids: [itemId],
          success: res => {
            my.alert({
              content: `宝贝${itemId}数据如下，各字段返回含义请参看文档：${JSON.stringify(res)}`
            });
          },
          fail: res => {
            my.showToast({
              content: `宝贝${itemId}查询失败：${res.error}。开发者可以考虑使用预取数据(目前的demo存储在itemPrefetchData中)，作为商品的抄底展示，不过需要注意的是：预取数据在页面保存发布后不会更新。`
            });
          }
        });
      }).catch(reason => {
        my.showToast({
          content: `my.getConfigData fail: ${JSON.stringify(reason)}`
        });
      })
    },
    onOpenDetail() {
      this.getConfigData()
      .then(configData => {
        const { scenes } = configData;
        const itemId = scenes && scenes.item && scenes.item.length && scenes.item[0];
        if (!itemId) {
          return my.showToast({
            content: '配置应用中未设置商品数据'
          });
        }
        my.tb.openDetail({
          itemId,
          success: res => {
            my.showToast({
              content: '跳转成功'
            });
          },
          fail: res => {
            my.showToast({
              content: `跳转失败, 原因是：${JSON.stringify(res)}`
            });
          }
        });
      })
      .catch(reason => {
        my.showToast({
          content: `my.getConfigData fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onJoinMember() {
      my.tb.tjmMemberJoin({
        // 测试环境下可以随便指定一个sellerId, 发布线上后，sellerId 会被修正为制作页面的那个商家
        sellerId: Mock.sellerId,
        success: res => {
          my.showToast({
            content: '已成功入会',
          });
        },
        fail: res => {
          my.showToast({
            content: `入会失败，原因是: ${res.error}`
          });
        }
      });
    },
    onDrawCoupon() {
      this.getConfigData()
      .then(configData => {
        const { scenes } = configData;
        const coupons = scenes && scenes.coupons;
        const couponsPrefetchData = scenes && scenes.couponsPrefetchData;
        if (!coupons || !coupons.length || !couponsPrefetchData || !couponsPrefetchData.length) {
          my.showToast({
            content: `配置应用中未设置优惠券数据`
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
          success: res => {
            my.showToast({
              content: `已成功领取${info}优惠券`
            });
          },
          fail: res => {
            my.showToast({
              content: `领取${info}优惠券失败: ${res.error}`
            });
          }
        });
      })
      .catch(reason => {
        my.showToast({
          content: `获取配置数据错误: ${reason}`
        });
      });
    },
    onDrawPrize() {
      this.getConfigData()
      .then(configData => {
        const { scenes } = configData;
        const oright = scenes && scenes.oright;
        if (!oright) {
          my.showToast({
            content: `配置应用中未设置奖池数据`
          });
          return;
        }
        my.tb.tjmDrawPrize({
          ename: oright.ename,
          type: oright.type,
          succes: res => {
            my.showToast({
              content: `恭喜你中奖了：${JSON.stringify(res)}`
            });
          },
          fail: res => {
            my.showToast({
              content: `很遗憾，您没有中奖：${res.error}`
            });
          }
        });
      })
      .catch(reason => {
        my.showToast({
          content: `获取配置数据错误: ${JSON.stringify(reason)}`
        });
      });
    },
    onGetLiveLevel() {
      my.tb.tjmLiveQueryLevel({
        // // 测试环境下可以随便指定一个sellerId, 发布线上后，sellerId 会被修正为制作页面的那个商家
        targetUid: Mock.sellerId,
        success: (res) => {
          my.alert({
            content: `直播亲密度等级获取成功: ${JSON.stringify(res)}`
          });
        },
        fail: (res) => {
          my.showToast({
            content: `直播亲密度等级获取成功: ${res.error}`
          });
        },
      });
    },
    registerTaskEnv() {
      this.getConfigData()
      .then(configData => {
        const { scenes } = configData;
        const task = scenes && scenes.task;
        if (!task || !task.tasks || !Array.isArray(task.tasks) || !task.tasks.length) {
          my.showToast({
            content: '未配置任务数据'
          });
          return;
        }
        my.tb.tjmSetEnv({
          tasks: task.tasks.map(({ taskContent, dailyLimit }) => {
            return {
              taskName: taskContent.type,
              maxCount: dailyLimit
            }
          }),
        });
      })
      .catch(() => {});
    },
    onGetTaskInfo() {
      my.tb.tjmTaskQueryInfo({
        success: (res) => {
          my.alert({
            content: `任务详情：${JSON.stringify(res)}`
          });
        },
        fail: (res) => {
          // 异常原因
          my.showToast({
            content: `获取任务失败: ${res.error}`
          })
        },
      });
    },
    onTaskAddBag() {
      this.getConfigData()
      .then(configData => {
        const { scenes } = configData;
        const task = scenes && scenes.task;
        if (!task || !task.tasks || !Array.isArray(task.tasks) || !task.tasks.find(task => task.taskContent.type === 'addBag')) {
          my.showToast({
            content: '未配置加购宝贝任务'
          });
          return;
        }
        const { items_addbag } = task.tasks.find(task => task.taskContent.type === 'addBag').taskContent;
        my.tb.tjmTaskAddBag({
          id: items_addbag[0],
          success: (res) => {
            // 返回结果 示例
            // res = {
            //   chance: 2, // 游戏机会
            //   task: {
            //     taskName: 'addBag',
            //     count: 2, // 任务已经做了2次，
            //     isCompleted: true | false, // 当天的任务是否已经完成
            //   },
            // };
            my.showToast({
              content: `加购任务完成，您将获取${res.chance}次游戏机会，当前加购任务已经做了${res.task.count}次，当天的加购任务${res.task.isCompleted ? '已完成':'尚未完成'}`,
              duration: 5e3
            });
          },
          fail: (res) => {
            // 异常原因
            my.showToast({
              content: `加购任务失败了，原因是：${res.error}`,
            });
          },
        });
      })
      .catch(reason => {
        my.showToast({
          content: `my.getConfigData fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onTaskAppointLive() {
      this.getConfigData()
      .then(configData => {
        const { scenes } = configData;
        const task = scenes && scenes.task;
        if (!task || !task.tasks || !Array.isArray(task.tasks) || !task.tasks.find(task => task.taskContent.type === 'appointLive')) {
          my.showToast({
            content: '未配置观看直播任务'
          });
          return;
        }
        const { feedId } = task.tasks.find(task => task.taskContent.type === 'appointLive').taskContent;
        my.tb.tjmTaskAppointLive({
          feedId: feedId,
          duration: 10,
          success: (res) => {
            // 返回结果 示例
            // res = {
            //   chance: 2, // 游戏机会
            //   task: {
            //     taskName: 'appointLive',
            //     count: 2, // 任务已经做了2次，
            //     isCompleted: true | false, // 当天的任务是否已经完成
            //   },
            // };
            my.showToast({
              content: `观看直播任务完成，您将获取${res.chance}次游戏机会，当前任务已经做了${res.task.count}次，当天的加购任务${res.task.isCompleted ? '已完成':'尚未完成'}`,
              duration: 5e3
            });
          },
          fail: (res) => {
            // 异常原因
            my.showToast({
              content: `观看直播任务失败了，原因是：${res.error}`,
            });
          },
        });
      })
      .catch(reason => {
        my.showToast({
          content: `my.getConfigData fail: ${JSON.stringify(reason)}`
        });
      });
    },
    onTaskSubChance() {
      my.tb.tjmTaskSubChance({
        success: (res) => {
          // 示例，返回剩余的游戏机会
          // res = {
          //   'chance': 2,
          // };
          my.showToast({
            content: `游戏机会已经减一，还剩${res.chance}次机会`
          });
        },
        fail: (res) => {
          // 异常原因
          my.showToast({
            content: `失败了：${res.error}`
          });
        },
      });

    },
  }
});