exports.main = async (context) => {
  console.log("main");
};

exports.schemaSubmit = async function (context) {
  const cloud = context.cloud;
  /**
   * 平台传入参数如下：
    appId：小部件id
    appVersion：小部件版本
    authToken：授权的token（需要授权时）
    formData：配置表单数据
    orderId：投放计划Id，表示商家针对应用，在某个场景产生的一次投放；
    dataId：投放单数据id
    widgetViewId:商家针对小部件，配置相关数据以后，产生的小部件视图卡片Id，比如旺铺内的某一个模块实例；
    sellerId：卖家id(isv侧的数据保存接口可根据sellerId+orderId来区分不同卖家以及相同卖家的不同坑位)
   */

  // 小部件Id
  const miniappId = context.miniappId
    ? context.miniappId
    : context.data.miniappId;
  // 小部件版本
  const appVersion = context.appVersion
    ? context.appVersion
    : context.data.appVersion;

  //商家授权的token
  const authToken = context.authToken
    ? context.authToken
    : context.data.authToken + "";

  // 配置表单数据
  const formData = context.formData ? context.formData : context.data.formData;

  // 投放计划Id orderId
  const orderId = context.orderId ? context.orderId : context.data.orderId;

  // 投放单数据Id
  const dataId = context.dataId ? context.dataId : context.data.dataId;

  // 商家针对小部件，配置相关数据以后，产生的小部件视图卡片ID, 比如旺铺内的某一个模块实例
  const widgetViewId = context.widgetViewId
    ? context.widgetViewId
    : context.data.widgetViewId;

  // 卖家id (isv侧的数据保存接口可根据sellerId+orderId来区分不同卖家以及相同卖家的不同坑位)
  const sellerId = context.sellerId ? context.sellerId : context.data.sellerId;

  console.log(
    miniappId,
    appVersion,
    formData,
    orderId,
    dataId,
    widgetViewId,
    sellerId
  );

  let result = null,
    success = true;

  result = await cloud.db.collection("widget_formdata").insertOne({
    miniappId,
    appVersion,
    formData,
    orderId,
    sellerId,
    dataId,
    widgetViewId,
  });

  return {
    success: success,
    result: result,
  };
};
