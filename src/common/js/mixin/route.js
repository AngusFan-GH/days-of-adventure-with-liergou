
export default {
    methods: {
        $getCurrentPage() {
            const routes = getCurrentPages(); // 关于获取页面的官方文档https://uniapp.dcloud.io/api/window/window
            const { route, options } = routes[routes.length - 1] || {};
            return { route, options };
        }
    }
};