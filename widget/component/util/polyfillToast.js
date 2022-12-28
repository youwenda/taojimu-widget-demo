const noop = () => {};
const isFunction = (fn) => typeof fn === 'function';
const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
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
                console.log('trigger callback');
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
  my.showLoading = ({ content = '', delay = 0, success = noop, fail = noop, complete = noop } = { content: '' }) => {
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
      showToast: {
        visible: false,
        type: '',
        content: ''
      }
    })
  };
}