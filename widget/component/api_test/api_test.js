const scene = {
  QUESTION: "question",
  COMPLETE: "complete",
};
const step = {
  ANSWER: "answer",
  CHOICE: "choice",
  COMPLETE: "complete",
};
const result = {
  RIGHT: "right",
  ERROR: "error",
};
Component({
  mixins: [],
  data: {
    question: "",

    overviewPic: "",

    chance: 2,

    scene: scene.QUESTION,

    result: null,

    rightChoice: "",
    errorChoice: "",

    link: "",

    itemId: "",

    step: step.ANSWER,

    choices: [],

    coupons: [],
  },

  onInit() {
    console.log("onInit");

    my.tb.getConfigData({
      success: (res) => {
        console.log("getConfig的返回值", res);

        const webapp = res && (res.webapp || res.data.webapp || res.data.data && (res.data.data.webapp || res.data.data));

        const { rightChoice, question, errorChoice, overviewPic, items, link } =
          webapp;

        const choices = [rightChoice, errorChoice].sort(
          () => Math.random() - 0.5
        );

        console.log("要显示的choice2", choices);

        this.setData({
          overviewPic: overviewPic.src,
          question: (question && question.words) || "question_none",
          rightChoice,
          errorChoice,
          choices,
          link: (link && link.link) || "",
          itemId: (items && items.length && items[0]) || "",
        });

        console.log("data的值 ", this.data);

        // console.log('getConfigData success', data);
        // this.setData({
        //   data: JSON.stringify(data)
        // });
        // my.alert({
        //   content: 'getConfigData success:' + JSON.stringify(data)
        // });
      },
      fail: (err) => {
        console.log("getConfigData fail", err);

        // my.alert({
        //   content: 'getConfigData fail:' + JSON.stringify(err)
        // });
      },
    });

    // my.getSceneInfo({
    //   success: res => {
    //     console.log('getSceneInfo', res);
    //   }
    // });
  },
  didMount() {
    console.log("-------> didMount");
  },
  methods: {
    answer() {
      this.setData({
        step: step.CHOICE,
      });
    },

    choice(e) {
      console.log("choice");
      let chance = this.data.chance;
      if (chance <= 0) {
        console.error("非常抱歉，你的答题机会已经用完了");
        // my.showToast({
        //   content: '非常抱歉，你的答题机会已经用完了'
        // });
        return;
      }
      // 答题机会扣除
      this.setData({
        chance: --chance,
      });

      const choice = e.currentTarget.dataset;

      if (choice.value === this.data.rightChoice) {
        this.setData({
          scene: scene.COMPLETE,
          result: result.RIGHT,
        });
      } else {
        this.setData({
          scene: scene.COMPLETE,
          result: result.ERROR,
        });
      }
    },

    back() {
      console.log("back");
      this.setData({
        scene: scene.QUESTION,
        step: step.COMPLETE,
      });
      console.log("back", this.data);
    },

    retry() {
      this.setData({
        scene: scene.QUESTION,
        step: step.CHOICE,
      });
    },

    end() {
      this.back();
    },

    joinMember() {
      console.log("加入会员2", my.tb);
      my.tb.joinMember({
        success: (res) => {
          console.log("joinMember success", res);
          my.alert({
            content: "joinMember success - " + JSON.stringify(res),
          });
        },
        fail: (res) => {
          console.log("joinMember fail", res);

          my.alert({
            content: "joinMember fail - " + JSON.stringify(res),
          });
        },
      });
    },

    favorShop() {
      my.tb.favorShop({
        success: (res) => {
          console.log("favorShop success", res);
          my.alert({
            content: "favorShop success - " + JSON.stringify(res),
          });
        },
        fail: (res) => {
          console.log("favorShop fail", res);
          my.alert({
            content: "favorShop fail - " + JSON.stringify(res),
          });
        },
      });
    },

    showSku() {
      my.tb.showSku({
        itemId: "544753431554",
        success: (res) => {
          console.log("showSku success", res);
          const { status } = res;
          if (status === "addCartSuccess") {
            my.alert({ content: "宝贝加购success" });
            return;
          }
          my.alert({ content: "宝贝加购success - " + JSON.stringify(res) });
        },
        fail: (res) => {
          console.log("showSku fail", res);
          my.alert({ content: "宝贝加购fail - " + JSON.stringify(res) });
        },
      });
    },

    collectGoods() {
      my.tb.collectGoods({
        id: 536027498869,
        success: (res) => {
          my.alert({ content: "宝贝收藏success - " + JSON.stringify(res) });
        },
        fail: (res) => {
          my.alert({ content: "宝贝收藏fail - " + JSON.stringify(res) });
        },
      });
    },
  },
});
