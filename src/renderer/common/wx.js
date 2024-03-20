import wx from "weixin-js-sdk";
import { Dialog } from "vant";

export const isWeChat = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("micromessenger");
};

export const initWXConfig = async (config) => {
  return new Promise((resolve) => {
    wx.config({
      beta: true,
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
      appId: config.appId, // 必填，公众号的唯一标识
      timestamp: config.timestamp, // 必填，生成签名的时间戳
      nonceStr: config.nonceStr, // 必填，生成签名的随机串
      signature: config.signature, // 必填，签名，见附录1
      jsApiList: [
        "startRecord",
        "stopRecord",
        "onVoiceRecordEnd",
        "playVoice",
        "pauseVoice",
        "stopVoice",
        "onVoicePlayEnd",
        "uploadVoice",
        "downloadVoice",
        "translateVoice",
      ],
    });
    resolve(true);
  });
};

// 开始录音
export const startRecord = async () => {
  return new Promise((resolve, reject) => {
    const isWx = isWeChat();
    if (!isWx) {
      Dialog.alert({
        title: "提示",
        message: "请使用手机微信打开!",
      });
      return resolve([false, "请使用手机微信打开！"]);
    }
    wx.startRecord({
      success: function (res) {
        console.log("授权成功");
        resolve(res);
      },
      cancel: function (res) {
        Dialog.alert({
          title: "提示",
          message: "为了能确保录音成功！请授权获取录音权限",
        });
        reject(res);
      },
      fail: function (err) {
        Dialog.alert({
          title: "提示",
          message: "获取录音权限失败！请检查是否开启录音权限！",
        });
        reject(err);
      },
    });
  });
};

// 音频转文字
export const getTranslateVoice = async (res) => {
  return new Promise((resolve, reject) => {
    wx.translateVoice({
      localId: res.localId,
      isShowProgressTips: 1,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        console.log("音频转文字失败", err);
        Dialog.alert({
          title: "提示",
          message: "音频转文字失败！",
        });
        reject(err);
      },
    });
  });
};

// 停止录音
export const stopRecord = async () => {
  return new Promise((resolve) => {
    wx.stopRecord({
      success: function (res) {
        resolve(res);
      },
      // fail: function (err) {
      //   Dialog.alert({
      //     title: '提示',
      //     message: '停止录音失败！'
      //   })
      //   reject(err)
      // }
    });
  });
};
