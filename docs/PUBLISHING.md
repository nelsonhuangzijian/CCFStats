# 发布与版本

1. 更新版本时，同步修改 `src/manifest.json` 和 `package.json`。
2. 运行测试、构建及安装包检查，并在 Chrome 中验收主要功能。
3. 将仓库文件提交到 GitHub，为版本创建对应标签，例如 `v1.0.0`。
4. 创建 GitHub Release，上传 `dist/CCFStats-1.0.0.zip`。安装包内的 `manifest.json` 位于 ZIP 根目录。
5. `dist/` 是生成目录，已在 `.gitignore` 中排除；安装包作为 Release 附件分发。

README 使用的真实截图位于 `docs/images/`；隐私政策位于仓库根目录的 `PrivacyPolicy.md`；`docs/privacy.html` 为 HTML 版本。

发布变更时递增版本号，不覆盖已分发版本的内容。
