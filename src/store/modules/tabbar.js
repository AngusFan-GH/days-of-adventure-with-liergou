const tabBarList = [
    {
        iconPath: "home",
        selectedIconPath: "home-fill",
        text: "首页",
        pagePath: "/pages/index/index",
    },
    {
        iconPath: "grid",
        selectedIconPath: "grid-fill",
        text: "玩",
        midButton: true,
        customIcon: false,
        pagePath: "/pages/play/index",
    },
    {
        iconPath: "account",
        selectedIconPath: "account-fill",
        text: "我的",
        count: 0,
        isDot: false,
        customIcon: false,
        pagePath: "/pages/mine/index",
    },
];

const state = {
    list: tabBarList,
    show: true
};

export default {
    namespaced: true,
    state
};