# enjoy doc

通过本地文件，网络地址等快速生成文档

## 目的

公司的项目中有很多开发相关的文档，之前习惯放gitlab的wiki，效率和体验都不是很好，于是做了这个小工具，目的就是为了方便的组织和查看本地文档。

## 功能

- 使用markdown格式
- 支持自定义目录
- 支持*绝对路径*，*文件内容*，*网络地址*三种文件形式

目前的问题：

- 不支持页内hash导航

## 安装

本地安装

```bash
npm install enjoy-doc
```

也可以全局

```bash
npm install enjoy-doc -g
```

## 使用

定义一个导出文档文件的模块

```javascript
/**
 * docs.js
 */

const path = require('path');

const base = '../js/mlrn/';
const getFilePath = p => path.join(__dirname, base, p);

module.exports = {
  title: 'MED-RN文档',
  nav: [
    {
      text: '首页',
      file: '# MED-RN文档',
      route: '',
    },
    {
      text: '展示组件',
      children: [
        {
          text: 'Header (头部)',
          file: getFilePath('ui/Header/index.md'),
          route: 'ui-Header',
        },
        {
          text: 'FooterButton (底部按钮)',
          file: getFilePath('ui/FooterButton/index.md'),
          route: 'ui-FooterButton',
        },
        {
          text: 'Divider (页面分隔线)',
          file: getFilePath('ui/Divider/index.md'),
          route: 'ui-Divider',
        },
        {
          text: 'EmptyView (空白展示)',
          file: getFilePath('ui/EmptyView/index.md'),
          route: 'ui-EmptyView',
        },
        {
          text: 'Image (图片)',
          file: getFilePath('ui/Image/index.md'),
          route: 'ui-Image',
        },
        {
          text: 'InlineImage (文本图片)',
          file: getFilePath('ui/InlineImage/index.md'),
          route: 'ui-InlineImage',
        },
        {
          text: 'AnimationImageView (帧动画播放)',
          file: getFilePath('ui/AnimationImageView/index.md'),
          route: 'ui-AnimationImageView',
        },
      ],
    },
    {
      text: '表单组件',
      children: [
        {
          text: 'InputItem (文本输入)',
          file: getFilePath('ui/InputItem/index.md'),
          route: 'ui-InputItem',
        },
        {
          text: 'Radio (单选框)',
          file: getFilePath('ui/Radio/index.md'),
          route: 'ui-Radio',
        },
        {
          text: 'SearchInputWithClear (搜索框)',
          file: getFilePath('ui/SearchInputWithClear/index.md'),
          route: 'ui-SearchInputWithClear',
        },
        {
          text: 'SidePickerView (侧边选择器)',
          file: getFilePath('ui/SidePickerView/index.md'),
          route: 'ui-SidePickerView',
        },
      ],
    },
    // ...
  ],
};

```

添加一个命令

```json
"doc": "enjoy-doc ./docs.js --port=4000"
```

然后使用命令打开

```bash
npm run doc
```

### 命令参数

```bash
enjoy-doc file --port=4000
```

- `file` 配置文件
- `--port` 运行的端口

## 配置说明

- `title`: 标题
- `nav`: 导航路径

nav配置：

- `text`: 标题，必填
- `file`: 文件，支持传入*绝对路径*，*文件内容*，*网络地址*三种
- `route`: 路由的唯一名称，可选，如果不传，则不可选中
- `children`: 子导航配置，同nav

## TODO

- 支持文档内的hash导航
