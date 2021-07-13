export const appId = 'wx62399ee33600accf';


// 获取当前帐号信息
const accountInfo = wx.getAccountInfoSync();

// env类型
export const env = accountInfo.miniProgram.envVersion;

if (!env) {
    console.error("获取运行环境失败!");
}

const baseApi = {
    // 开发版
    develop: "https://wx.heizhuidian.com",
    // 体验版
    trial: "https://wx.heizhuidian.com",
    // 正式版
    release: "https://wx.heizhuidian.com"
};

// request请求baseURL
export const apiUrl = baseApi[env];

export const fileUrl = 'http://i.heizhuidian.com/static/';