<p align="center">
  <img src="docs/images/icon128.png" width="72" alt="CCF Statistics 图标">
</p>

<h1 align="center">CCF Statistics for Google Scholar</h1>

<p align="center">CCF 刊物标签 · 论文总数与一作统计 · 年份与等级筛选</p>
<p align="center"><strong>简体中文</strong> · <a href="README.en.md">English</a></p>

在 Google Scholar 学者主页显示 CCF A／B／C／N 标签，按年份与所选等级统计论文总数、一作数量，并筛选论文列表。

支持 Chrome。插件界面为英文，使用 CCF 2026 第七版目录。

## 效果预览

按年份和等级统计论文总数与一作数量：

<img src="docs/images/statistics-real.png" width="360" alt="Google Scholar 页面上的 CCF 统计面板">

论文列表中的 CCF 标签与同色书签：

![论文标签与书签](docs/images/publication-labels-real.png)

## 功能

- **自动标签**：打开学者主页，即为已识别的会议或期刊显示 CCF 标签，不限作者位置。
- **按需统计**：选择起止年份与 A／B／C 等级，点击 `Start statistics`，查看各等级的总数和一作数量。
- **年份筛选**：起止年份均为必选。缩小或切回已统计范围时立即更新结果；扩大至未统计年份时，点击 `Update statistics`，复用已有补全结果。
- **展示筛选**：统计后可使用 `Selected ranks` 只展示所选等级，或使用 `First author` 只展示所选等级中的一作论文。
- **同色书签**：统计后，为所选等级的论文添加与标签颜色一致的左侧书签。
- **目录优先**：先匹配本地目录和缓存，支持常见年份、届次、卷期及部分截断名称；仍无法确认时通过 DBLP 补全。
- **请求控制**：浏览时仅补全屏幕附近、符合已应用年份范围的论文；统计时仅处理该范围内已加载的论文，并使用共享队列、限速和缓存减少重复请求。

| 标签 | 含义 | 是否计入统计 |
| --- | --- | --- |
| CCF A | 当前目录中的 A 类会议或期刊 | 勾选 A 时计入 |
| CCF B | 当前目录中的 B 类会议或期刊 | 勾选 B 时计入 |
| CCF C | 当前目录中的 C 类会议或期刊 | 勾选 C 时计入 |
| CCF N | 已确认不在 A／B／C 目录的刊物，或明确的非主会记录 | 不计入 |

尚未匹配、信息不足或请求失败的论文不会仅因此标为 N。

## 安装

在本仓库的 **Releases** 中下载 `CCFStats-1.0.0.zip`。

1. 解压 ZIP，保留全部文件。
2. 在 Chrome 地址栏打开 `chrome://extensions/`。
3. 打开右上角的「开发者模式」。
4. 点击「加载已解压的扩展程序」，选择包含 `manifest.json` 的解压目录。
5. 打开或刷新 Google Scholar 学者主页。

更新时，替换扩展目录中的文件，在扩展管理页点击「重新加载」，再刷新 Scholar 页面。

## 使用

1. **加载论文**：打开学者主页，按需使用 Scholar 自带的加载按钮显示更多论文。已识别论文的标签会自动出现。
2. **选择范围**：在引用区上方的 `CCF Statistics` 面板选择 `Start`、`End` 和需要统计的 A／B／C 等级。起止年份相同可统计单一年份。
3. **开始统计**：点击 `Start statistics`，查看 `Total`（总数）和 `First`（一作数）。完成后显示 `Done x/y`；未选择的等级显示 `—`。
4. **筛选展示**：按需勾选 `Selected ranks` 和 `First author`。筛选不改变统计数量；两项均不勾选时，显示当前统计年份范围内的全部已加载论文。
5. **更新统计**：扩大至未统计年份、修改等级或加载更多论文后，点击 `Update statistics`。已有补全结果会复用。

`Reset` 清空年份选择；重新选齐有效的起止年份后才能统计。待应用的新范围不会覆盖已有结果，`Counted` 会标明当前仍在展示的计数范围。补全过程支持暂停、继续及重试失败项。

需要显示面板时，点击浏览器工具栏中的扩展图标，再选择 `Show statistics panel`。

## 统计与匹配说明

- 仅统计**已加载论文**，年份范围包含起止年份；无年份记录不会纳入。
- 不自动点击加载更多，不发起 Scholar 搜索或详情页请求。
- 统一使用 **CCF 2026 第七版**评级，不按论文发表年份回溯历史等级。
- 一作识别基于页面作者列表及主页姓名。缩写、同名或不完整信息可能造成不确定；不推断共同一作。
- 截断名称不一定能直接确认；明确的名称前缀、可靠年度届次或可验证书目信息优先本地匹配，其余保留补全。
- 混合论文集按实际会议或轨道区分，不会只因名称包含主会名称就统一计入主会等级。

## 隐私

设置和刊物缓存保存在浏览器本地，无分析、广告或开发者自建服务器。不要求登录扩展账号，也不读取无关网站内容。

补全未匹配刊物时，会通过 HTTPS 向 DBLP 发送**论文题名和首位作者姓氏**。详细说明见[隐私政策](PrivacyPolicy.md)。

## 更新记录

### 1.0.0

- Google Scholar 主页 CCF 标签、论文总数与一作统计。
- 起止年份必选、统计范围内即时筛选、扩大范围后增量补全。
- 紧凑统计面板、等级与一作展示筛选、同色书签。
- 本地目录优先匹配、DBLP 缓存补全和请求控制。

## 问题反馈

有问题或建议，欢迎在本仓库的 **Issues** 中反馈。

## 许可证

本项目代码采用 [MIT 许可证](LICENSE)。

## 致谢

参考了 [CCFrank](https://github.com/WenyanLiu/CCFrank4dblp) 和 [Google Scholar Author Highlighter](https://chromewebstore.google.com/detail/google-scholar-author-hig/ijmngekkpaccbbjimedfkjpigplaikah)，感谢这两个项目的作者。

CCF 目录数据整理自[目录镜像](https://github.com/haozhou-wong/ccf-recommended-list-2026-markdown)，以 [CCF 官方目录](https://www.ccf.org.cn/Academic_Evaluation/By_category/)为准。
