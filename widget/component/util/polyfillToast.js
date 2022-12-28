const noop = () => {};
const isFunction = (fn) => typeof fn === 'function';
const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
export default function polyfillToast() {
  let promise = Promise.resolve();
  my.showToast = ({ type, content, duration = 3000, success = noop, fail = noop, complete = noop }) => {
    // promise = promise.then(() => {
    //   return new Promise((resolve) => {
    //     this.setData({
    //       showToast: {
    //         visible: true,
    //         type,
    //         content
    //       }
    //     }, () => {
    //       success.call(null);
    //       complete.call(null);
    //       if (duration > 0) {
    //         setTimeout(() => {
    //           this.setData({
    //             showToast: {
    //               visible: false,
    //               type: '',
    //               content: ''
    //             }
    //           }, () => {
    //             resolve();
    //           });
    //         }, duration);
    //       }
    //     });
    //   });
    // });

    promise = promise.then(() => this.setDataPromise({ showToast: { visible: true, type: '', animationClass: '', content: '' } }))
    .then(() => delay(30))
    .then(() => {
      return this.setDataPromise({
        showToast: {
          type,
          content,
          visible: true,
          animationClass: 'mx-toast-bd-show',
        }
      });
    })
    .then(() => {
      return delay(Math.max(duration - 400, 0));
    })
    .then(() => {
      if (duration > 0) {
        return this.setDataPromise({
          showToast: {
            type,
            content,
            visible: true,
            animationClass: 'mx-toast-bd-hide-v1',
          }
        })
        .then(() => delay(400))
        .then(() => {
          return this.setDataPromise({
            showToast: {
              type,
              content,
              visible: false,
              animationClass: 'mx-toast-bd-hide-v2',
            }
          });
        })
        .then(() => {
        });
      }
    })
    .then(() => {
      console.log('toast 自动关闭');
      if (isFunction(success)) {
        return success();
      }
    });
  };

  let loadingQueue = [];
  let loadingPromise = Promise.resolve();
  my.showLoading = (params = {}) => {
    loadingQueue.push(params);
    loadingPromise = loadingPromise.then(() => {
      return new Promise((resolve, reject) => {
        const item = loadingQueue.shift();
        if (item) {
          const { content, delay = 0, success = noop, fail = noop, complete = noop } = item;
          try {
            this.setData({
              showLoading: {
                visible: true,
                content
              }
            }, () => {
              success.call(null);
              complete.call(null);
              if (delay > 0) {
                setTimeout(() => {
                  this.setData({
                    showLoading: {
                      visible: false,
                      content: ''
                    }
                  }, () => {
                    resolve();
                  });
                }, delay);
              }
            });
          } catch(e) {
            fail.call(null, e);
            complete.call(null);
            reject(e);
          }
        } else {
          resolve();
        }
      });
    });
  };
  my.hideLoading = () => {
    loadingPromise = Promise.resolve();
    loadingQueue.length = 0;
    this.setData({
      showLoading: {
        visible: false,
        content: ''
      }
    })
  };
}