exports.main = async function (context) {
  console.log("main");
};

exports.schemaInit = async function (context) {
  //模版id
  const templateAppId = context.miniappId
    ? context.miniappId
    : context.data.miniappId;
  //模版版本
  const templateAppVersion = context.appVersion
    ? context.appVersion
    : context.data.appVersion;
  //该商家已实例化的小部件id
  const instanceWidgetId = context.instanceWidgetId
    ? context.instanceWidgetId
    : context.data.instanceWidgetId;
  //商家授权的token
  const authToken = context.authToken
    ? context.authToken
    : context.data.authToken + "";
  //小部件描述
  const description = "小部件实例化可进行整体实例化流程";

  let result = null,
    success = true;

  //已实例化过的，走实例化更新流程
  if (instanceWidgetId) {
    console.log("update");
    console.log("update", typeof context.cloud.topApi.invoke);
    const updateFunction = await context.cloud.topApi
      .invoke({
        api: "taobao.miniapp.widget.template.instance.update",
        data: {
          param_mini_app_instantiate_template_app_update_request: {
            entity_id: instanceWidgetId,
            template_id: templateAppId,
            template_version: templateAppVersion,
          },
          session: authToken,
        },
      })
      .then(async (res) => {
        let updateResult = res.result;
        if (!updateResult) {
          success = false;
          result = {
            error_message: res.error_response.msg,
            err_code: res.error_response.code,
          };
          return;
        }
        if (updateResult.success) {
          //自身的业务逻辑，按照需求实现
          result =
            "小部件实例化模板" +
            templateAppId +
            "版本" +
            templateAppVersion +
            "更新实例成功，描述：" +
            description;
        } else {
          success = false;
          result = {
            error_message: updateResult.err_message,
            error_code: updateResult.err_code,
          };
        }
      })
      .catch((e) => {
        console.log("e", e);
        success = false;
        result = {
          error_message: e.msg,
          error_code: e.code,
        };
      });
  } else {
    console.log(
      "instantiate",
      description,
      templateAppId,
      templateAppVersion,
      authToken
    );
    console.log("instantiate", typeof context.cloud.topApi.invoke);

    //未实例化的，走实例化流程
    const instanceFunction = await context.cloud.topApi
      .invoke({
        api: "taobao.miniapp.widget.template.instantiate",
        data: {
          param_mini_app_instantiate_template_app_simple_request: {
            description: description,
            template_id: templateAppId,
            template_version: templateAppVersion,
          },
          session: authToken,
        },
      })
      .then(async (res) => {
        console.log("instantiate.then", res);
        let instanceResult = res.result;
        if (!instanceResult && res.error_response) {
          success = false;
          result = {
            error_message: res.error_response.msg,
            err_code: res.error_response.code,
          };
          return;
        }
        if (instanceResult.success) {
          //自身的业务逻辑，按照需求实现
          result =
            "小部件实例化模板" +
            templateAppId +
            "版本" +
            templateAppVersion +
            "创建实例成功，描述：" +
            description;
        } else {
          success = false;
          result = {
            error_message: instanceResult.err_message,
            error_code: instanceResult.err_code,
          };
        }
      })
      .catch((e) => {
        console.log("e", e);
        success = false;
        result = {
          error_message: e.msg,
          error_code: e.code,
        };
      });
  }

  return {
    success: success,
    result: result,
  };
};
