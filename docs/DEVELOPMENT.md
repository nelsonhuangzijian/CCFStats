# 开发说明

## 目录结构

| 路径 | 内容 |
| --- | --- |
| `src/` | Scholar 扩展源码、manifest、图标及隐私政策，可直接加载调试 |
| `src/tests/` | 匹配规则、作者识别、DBLP 后台查询、缓存及年份范围页面测试 |
| `assets/icon.svg` | 可编辑的图标源文件 |
| `scripts/build_release.py` | 生成 Scholar 安装包 |
| `scripts/check_release.py` | 检查页面范围、权限、文件引用及 ZIP 一致性 |
| `docs/` | 使用说明、隐私政策和发布资料 |
| `dist/` | 生成目录，不提交到 Git |

## 构建与检查

构建仅使用 Python 3 标准库，测试需要 Node.js。

```sh
npm test
python3 scripts/build_release.py
python3 scripts/check_release.py
```

生成的安装包为 `dist/CCFStats-1.0.0.zip`，manifest 位于 ZIP 根目录。版本号以 `src/manifest.json` 为准；首次公开发布后，应递增版本号再分发变更。

## 功能范围

本仓库只提供在 Scholar 作者页运行的版本，不含其他页面版本的安装包、解析器或构建入口。DBLP publication API 仍用于 Scholar 刊物补全，并非在 DBLP 作者页启用扩展界面。

自动检查使用模拟浏览器 API、存储和网络响应，不代替最终安装与真实站点验收。发布事项见 [PUBLISHING.md](PUBLISHING.md)。

年份控件的浏览器测试位于 `src/tests/year-range-demo.html`（通过本地静态服务器访问，读取页尾结果）。测试使用合成数据，不作为 README 的效果预览图。

## 年份范围交互验证

`src/tests/year-range-demo.html?test=1` 验证年份范围、即时缩小、扩大范围待应用和会话偏好；`src/tests/year-network-demo.html?test=1` 用网络替身验证只查询所选年份、扩大范围复用结果，以及自动补全不绕过年份范围。这些是合成验证页面，不用于 README 效果预览。
