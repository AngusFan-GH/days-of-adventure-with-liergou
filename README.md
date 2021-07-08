# days-of-adventure-with-liergou

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm start
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Notice

1. 开发时`template`中`style`或`class`过长格式化后编译报错，是微信开发工具模板解析的 bug，暂时使用`<!-- prettier-ignore-attribute style -->` 和 `<!-- prettier-ignore-attribute class -->`阻止自动格式化。(记于 2121-06/10，微信开发者工具 Stable 1.05.2105170)
2. 自定义组件使用`v-model`双向绑定，子组件必须是：
```javascript
model: {
    prop: 'value',
    event: 'input',
}
```

3. iconfont.css放在static中，不会被打包编译，在小程序上传时会受上传文件白名单限制，无法上传，需放在其他可被编译的路径下。
