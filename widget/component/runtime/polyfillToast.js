const noop = () => {};
export default function polyfillToast() {
  const queue = [];
  let promise = Promise.resolve();
  my.showToast = (param = {}) => {

    queue.push(param);

    promise = promise.then(() => {

      return new Promise((resolve, reject) => {
        const item = queue.shift();

        if (item) {
          const { content, duration = 1500, success = noop, fail = noop, complete = noop } = item;
          try {
            this.setData({
              showToast: {
                visible: true,
                content: content
              }
            }, () => {
              success.call(null);
              complete.call(null);
              setTimeout(() => {
                this.setData({
                  showToast: {
                    visible: false,
                    content: ''
                  }
                }, () => {
                  resolve();
                });
              }, duration);
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
    }).catch((e) => {
      console.log('my.showToast.cache', e);
    })
  };
}