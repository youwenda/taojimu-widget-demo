const noop = () => {};
const isFunction = (fn) => typeof fn === 'function';
const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
/**
 * 模拟小程序中很实用的 my.showToast | my.hideToast | my.showLoading | my.hideLoading 功能
 * API 参照文档 予以尽可能实现
 * [my.showToast](https://miniapp.open.taobao.com/docV3.htm?docId=942&docType=20)
 * [my.hideToast](https://miniapp.open.taobao.com/docV3.htm?docId=944&docType=20)
 * [my.showLoading](https://miniapp.open.taobao.com/docV3.htm?docId=945&docType=20)
 * [my.hideLoading](https://miniapp.open.taobao.com/docV3.htm?docId=943&docType=20)
 */
export default function polyfillToast() {
  let promise = Promise.resolve();
  my.showToast = ({ type, content, duration = 2e3, success = noop, fail = noop, complete = noop } = { content: '' }) => {
    promise = promise.then(() => {
      return new Promise((resolve) => {
        this.setData({
          showToast: {
            visible: true,
            type,
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
            } catch(ex) {
            }
            resolve();
          };
          if (duration > 0) {
            delay(duration).then(() => {
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
  my.hideToast = ({ success, complete } = {}) => {
    promise = Promise.resolve();
    this.setData({
      showToast: {
        visible: false,
        type: '',
        content: ''
      }
    }, () => {
      if (isFunction(success)) {
        success();
      }
      if (isFunction(complete)) {
        complete();
      }
    });
  };
  my.showLoading = ({ content = '', delay = 2e3, success = noop, fail = noop, complete = noop } = { content: '' }) => {
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
  my.hideLoading = ({ success, complete } = {}) => {
    promise = Promise.resolve();
    this.setData({
      showToast: {
        visible: false,
        type: '',
        content: ''
      }
    }, () => {
      if (isFunction(success)) {
        success();
      }
      if (isFunction(complete)) {
        complete();
      }
    });
  };
}