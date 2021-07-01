const tabBarList = [
    {
        iconPath: "/static/image/tabbar/mine.png",
        selectedIconPath: "/static/image/tabbar/home_selected.png",
        text: "首页",
        pagePath: "/pages/index/index",
    },
    {
        iconPath: "/static/image/tabbar/play.png",
        selectedIconPath: "/static/image/tabbar/play_selected.png",
        text: "玩",
        midButton: true,
        customIcon: false,
        pagePath: "/pages/play/index",
    },
    {
        iconPath: "/static/image/tabbar/mine.png",
        selectedIconPath: "/static/image/tabbar/mine_selected.png",
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