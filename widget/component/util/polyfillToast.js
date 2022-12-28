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
    //       const callback = () => {
    //         try {
    //           if (isFunction(success)) {
    //             success();
    //           }
    //           if (isFunction(complete)) {
    //             complete();
    //           }
    //         } catch(ex) {}
    //         resolve();
    //       };
    //       if (duration > 0) {
    //         delay(duration).then(() => {
    //           this.setData({
    //             showToast: {
    //               visible: false,
    //               type: '',
    //               content: ''
    //             }
    //           }, () => {
    //             callback();
    //           });
    //         });
    //         return;
    //       }
    //       callback();
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

  my.showLoading = ({ content = '', delay = 0, success = noop, fail = noop, complete = noop } = { content: '' }) => {
    console.log('my.showLoading', typeof content, content);
    promise = promise.then(() => {
      return new Promise((resolve) => {
        this.setData({
          showToast: {
            visible: true,
            type: 'loading',
            content
          }
        }, () => {
          const callback = () => {
            try {
              if (isFunction(success)) {
                success();
              }
              if (isFunction(complete)) {
                complete();
              }
            } catch(ex) {}
            resolve();
          };
          if (delay > 0) {
            delay(delay).then(() => {
              this.setData({
                showToast: {
                  visible: false,
                  type: '',
                  content: ''
                }
              }, () => {
                callback();
              });
            });
            return;
          }
          callback();
        });
      });
    });
  };
  my.hideLoading = () => {
    promise = Promise.resolve();
    this.setData({
      showLoading: {
        visible: false,
        type: '',
        content: ''
      }
    })
  };
}