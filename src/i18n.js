(() => {
  if(globalThis.CCF_I18N)return;
  const pairs=[
["目录：{abbr}","Catalogue: {abbr}"],
["DBLP搜索：{abbr}","DBLP search: {abbr}"],
["未提供缩写","Abbreviation unavailable"],
["等待自动重试 · 部分结果", "Waiting to retry · Partial results"],
["重试失败项（{count}）", "Retry failed ({count})"],
["已识别 {identified} · 未匹配 {unmatched} · 失败 {failed} · 待处理 {pending}", "Identified {identified} · Unmatched {unmatched} · Failed {failed} · Pending {pending}"],
["{count} 篇刊物未匹配", "{count} unmatched venues"],
["DBLP 请求受限，{seconds} 秒后自动继续。", "DBLP rate limited. Continuing automatically in {seconds} s."],
["DBLP 暂时不可用，{seconds} 秒后自动继续。", "DBLP temporarily unavailable. Continuing automatically in {seconds} s."],
["临时查询失败，{seconds} 秒后自动重试。", "Temporary query failure. Retrying automatically in {seconds} s."],
["DBLP 多次恢复失败，已暂停；可稍后点击继续补全。", "Repeated DBLP recovery failures. Paused; resume completion later."],
  [
    "CCF 论文统计",
    "CCF Publication Statistics"
  ],
  [
    "CCF 一作统计",
    "CCF First-Author Statistics"
  ],
  [
    "折叠 CCF 统计",
    "Collapse CCF statistics"
  ],
  [
    "展开 CCF 统计",
    "Expand CCF statistics"
  ],
  [
    "先加载所需论文，选择条件后点击「开始统计」",
    "Load the publications you need, choose filters, then click “Start statistics”."
  ],
  [
    "筛选 CCF A 论文",
    "Filter CCF A publications"
  ],
  [
    "筛选 CCF B 论文",
    "Filter CCF B publications"
  ],
  [
    "筛选 CCF C 论文",
    "Filter CCF C publications"
  ],
  [
    "篇一作",
    "papers"
  ],
  [
    "篇",
    "papers"
  ],
  [
    "仅一作",
    "First author only"
  ],
  [
    "显示",
    "Showing"
  ],
  [
    "篇论文",
    "publications"
  ],
  [
    "开始统计",
    "Start statistics"
  ],
  [
    "更新统计",
    "Update statistics"
  ],
  [
    "重新统计",
    "Recalculate"
  ],
  [
    "核对详情",
    "Details"
  ],
  [
    "设置与统计口径",
    "Settings and scope"
  ],
  [
    "自动匹配未识别刊物",
    "Automatically resolve unknown venues"
  ],
  [
    "打开作者页及加载更多论文时自动补全未识别刊物（含非一作）。向 DBLP 发送论文标题和第一作者，以年份核对结果；不经开发者服务器。截断候选未能通过 DBLP 补全时，自动读取本篇 Scholar 详情。关闭后停止新查询。",
    "Unmatched venues, including non-first-author papers, are completed when the profile opens or more papers load. Titles and first authors are sent directly to DBLP, with years checked locally. If DBLP cannot complete a truncated candidate, its Scholar detail page is read. Turning this off stops new queries."
  ],
  [
    "本人姓名 / 其他别名（分号分隔）",
    "Your name / aliases (separated by semicolons)"
  ],
  [
    "例如 San Zhang; S Zhang",
    "e.g. San Zhang; S Zhang"
  ],
  [
    "自动比较完整作者列表中的姓名与缩写，并读取主页别名。可补充其他姓名写法。",
    "Match names and initials across the author list and profile aliases. Add other name variants if needed."
  ],
  [
    "起始年份",
    "From year"
  ],
  [
    "结束年份",
    "To year"
  ],
  [
    "「仅一作」同时控制统计与列表筛选。等级之间取并集，与一作条件取交集；不选等级则不限等级（含未匹配论文），全部不选显示所有论文。年份范围仍生效。CCF 2026 第七版统一评级。",
    "First-author mode controls both counts and the list. Selected ranks are combined with the author filter. No rank selected means any venue; no filters means all loaded publications. Year limits still apply. Uses the CCF 2026 seventh edition."
  ],
  [
    "CCF 2026 · 尚未统计",
    "CCF 2026 · Not started"
  ],
  [
    "尚未统计。请先加载论文并选择条件，再点击「开始统计」。",
    "Not started. Load publications and choose filters, then click “Start statistics”."
  ],
  [
    "条件或论文列表已更改，请点击「更新统计」应用。",
    "Filters or publications have changed. Click “Update statistics” to apply."
  ],
  [
    "起始年份不能大于结束年份。",
    "The start year cannot be later than the end year."
  ],
  [
    "仅统计已加载论文；加载更多后请点击更新统计。",
    "Counts include loaded publications only. Click Update statistics after loading more."
  ],
  [
    "仅统计已加载论文；新增记录后请点击更新统计。",
    "Counts include loaded publications. Click Update statistics after adding records."
  ],
  [
    "仅统计已加载论文；已完成本轮自动匹配。",
    "Counts include loaded publications only. Venue matching has finished."
  ],
  [
    "当前已加载论文。",
    "Currently loaded publications."
  ],
  [
    "DBLP 查询暂不可用；可补全详情，或点重新统计重试。",
    "DBLP is unavailable. Complete details manually or click Recalculate to retry."
  ],
  [
    "详情请求失败",
    "Could not load publication details"
  ],
  [
    "CCF {rank}，第一作者",
    "CCF {rank}, first author"
  ],
  [
    "{n} 篇刊物待匹配",
    "{n} unmatched venues"
  ],
  [
    "CCF 2026 · 当前已加载 {n} 篇",
    "CCF 2026 · {n} loaded publications"
  ],
  [
    "CCF {rank} · 2026 第七版",
    "CCF {rank} · 2026 seventh edition"
  ],
  [
    "正在自动补全 {venue} 完整刊物…",
    "Completing the full venue name for {venue}…"
  ],
  [
    "正在自动匹配未识别刊物…（{n} 篇）",
    "Resolving unmatched venues… ({n} remaining)"
  ],
  [
    "设置保存失败：{message}",
    "Could not save settings: {message}"
  ],
  [
    "第一作者论文详情",
    "First-Author Publications"
  ],
  [
    "关闭",
    "Close"
  ],
  [
    "CCF A · 第一作者",
    "CCF A · First author"
  ],
  [
    "CCF B · 第一作者",
    "CCF B · First author"
  ],
  [
    "CCF C · 第一作者",
    "CCF C · First author"
  ],
  [
    "已自动匹配并计数",
    "Automatically matched and counted"
  ],
  [
    "刊物待匹配",
    "Unmatched venues"
  ],
  [
    "一作论文中尚未匹配的刊物",
    "Unmatched first-author publications"
  ],
  [
    "重新读取页面",
    "Read page again"
  ],
  [
    "停止补全",
    "Stop completion"
  ],
  [
    "导出 CSV",
    "Export CSV"
  ],
  [
    "统计设置与口径",
    "Statistics settings and scope"
  ],
  [
    "姓名与其他写法（用分号分隔）",
    "Name and aliases (separated by semicolons)"
  ],
  [
    "例如：San Zhang; 张三; S Zhang",
    "e.g. San Zhang; S Zhang"
  ],
  [
    "自动规范化姓名，读取主页别名，并比较完整作者列表中的最佳匹配位置。DBLP 优先核对作者 PID。",
    "Normalize names, read profile aliases, and find the best match in the author list. DBLP author PID takes precedence."
  ],
  [
    "年份",
    "Year"
  ],
  [
    "起始",
    "From"
  ],
  [
    "结束",
    "To"
  ],
  [
    "清除本页校正",
    "Reset this profile’s corrections"
  ],
  [
    "一作指自动识别为作者列表第一位；不合并共同一作。匹配到会议或期刊后直接认定并计数，无需人工核准。统一套用 CCF 2026 第七版，不按发表年份回溯。会议与期刊版本分别计数；同一来源 ID 去重。未知刊物不等于非 CCF。已明确非一作的论文不计入待核对。",
    "First author means the first listed author; co-first authors are not combined. Matched venues are counted automatically without approval. Uses CCF 2026 seventh-edition ranks for every year. Conference and journal versions count separately; duplicate source IDs do not. An unknown venue is not necessarily unranked. Non-first-author papers are excluded here."
  ],
  [
    "论文列表",
    "Publications"
  ],
  [
    "搜索标题、作者或刊物",
    "Search titles, authors, or venues"
  ],
  [
    "搜索论文",
    "Search publications"
  ],
  [
    "筛选论文",
    "Filter publications"
  ],
  [
    "全部一作论文",
    "All first-author publications"
  ],
  [
    "已计入 A/B/C",
    "Counted in A/B/C"
  ],
  [
    "CCF A 一作",
    "CCF A first-author"
  ],
  [
    "CCF B 一作",
    "CCF B first-author"
  ],
  [
    "CCF C 一作",
    "CCF C first-author"
  ],
  [
    "论文 / 第一作者",
    "Publication / first author"
  ],
  [
    "刊物 / 匹配依据",
    "Venue / match evidence"
  ],
  [
    "结果",
    "Result"
  ],
  [
    "匹配处理",
    "Venue matching"
  ],
  [
    "CCF 2026 第七版 · 681 条目录记录 ·",
    "CCF 2026 seventh edition · 681 venues ·"
  ],
  [
    "官方目录",
    "Official catalogue"
  ],
  [
    "结构化数据来源",
    "Structured data source"
  ],
  [
    "论文在当前浏览器内处理；姓名补充与刊物设置保存在本机。已匹配刊物自动计数，无需人工核准；未匹配刊物可补全详情。",
    "Publications are processed in this browser. Name aliases and venue settings are stored locally. Matched venues count automatically; unmatched records can be completed from details."
  ],
  [
    "作者主页",
    "Author profile"
  ],
  [
    "需要完整统计时，请先在原页面点击“显示更多 / Show more”，加载所有论文后重新读取。",
    "For complete counts, use “Show more” on the author page to load all publications, then read the page again."
  ],
  [
    "DOM 模式包含已载入但被网页筛选隐藏的记录；可尝试读取完整 XML。",
    "Page mode includes loaded entries hidden by the website. You can also load the full XML."
  ],
  [
    "第一作者：{name}",
    "First author: {name}"
  ],
  [
    "未知",
    "Unknown"
  ],
  [
    "未获取到刊物",
    "Venue not available"
  ],
  [
    "期刊",
    "Journal"
  ],
  [
    "会议",
    "Conference"
  ],
  [
    "候选：{venue}（待补全确认）",
    "Candidate: {venue} (details needed)"
  ],
  [
    "尚未匹配目录",
    "No catalogue match yet"
  ],
  [
    "补全此篇详情",
    "Complete this publication"
  ],
  [
    "已自动认定",
    "Automatically accepted"
  ],
  [
    "已计入统计，无需人工核准",
    "Counted automatically; no approval needed"
  ],
  [
    "指定未识别刊物 / 备注",
    "Assign an unmatched venue / add a note"
  ],
  [
    "输入简称后选目录条目",
    "Type an abbreviation and choose a venue"
  ],
  [
    "{title} 目录刊物",
    "{title} catalogue venue"
  ],
  [
    "请选择下拉列表中的完整目录条目。",
    "Choose a complete venue from the list."
  ],
  [
    "请选择目录条目",
    "Choose a catalogue venue"
  ],
  [
    "备注（可选）",
    "Note (optional)"
  ],
  [
    "{title} 备注",
    "{title} note"
  ],
  [
    "没有符合条件的第一作者论文。",
    "No first-author publications match these filters."
  ],
  [
    "尚未读取到论文，请确认作者主页已加载。",
    "No publications loaded. Check that the author page is ready."
  ],
  [
    "本机保存失败：{message}",
    "Could not save locally: {message}"
  ],
  [
    "统计范围：Scholar 当前已加载的论文。",
    "Scope: publications currently loaded on Scholar."
  ],
  [
    "统计范围：DBLP 页面中已载入的期刊论文与会议论文。",
    "Scope: journal and conference publications loaded on DBLP."
  ],
  [
    "一作 {n} 篇 · 已自动计入 {count} 篇",
    "{n} first-author publications · {count} counted automatically"
  ],
  [
    "已读取 {n} 篇，仅显示自动识别的一作论文。",
    "{n} publications read; showing identified first-author publications only."
  ],
  [
    "自动识别 {n} 篇一作；已匹配刊物直接计数，无需人工核准。",
    "Identified {n} first-author publications. Matched venues count without approval."
  ],
  [
    "网站返回 {code}，请稍后再试。",
    "The website returned {code}. Please try again later."
  ],
  [
    "正在补全此篇论文的完整作者与刊物…",
    "Loading the full author list and venue…"
  ],
  [
    "已补全并匹配 {venue} · CCF {rank}",
    "Completed and matched {venue} · CCF {rank}"
  ],
  [
    "已补全，刊物仍未唯一匹配，可手动指定目录条目。",
    "Details loaded, but the venue is still ambiguous. You can assign it manually."
  ],
  [
    "已停止或请求超时。",
    "Stopped or timed out."
  ],
  [
    "补全失败：{message}",
    "Could not complete details: {message}"
  ],
  [
    "补全 Scholar 详情",
    "Complete Scholar details"
  ],
  [
    "读取 DBLP 完整 XML",
    "Load full DBLP XML"
  ],
  [
    "停止",
    "Stop"
  ],
  [
    "正在补全详情 {n} / {total}；约每 1.2 秒请求一篇，可随时停止。",
    "Completing details {n} / {total}; about one request every 1.2 seconds. You can stop at any time."
  ],
  [
    "已补全 {n} 篇一作详情。识别成功的刊物已自动计数。",
    "Completed {n} first-author records. Matched venues were counted automatically."
  ],
  [
    "正在请求作者 XML…",
    "Loading author XML…"
  ],
  [
    "统计范围：DBLP 作者 XML 中的期刊论文与会议论文（不含书籍、编辑卷等其他类型；未匹配项待核对）。",
    "Scope: journal and conference publications in the DBLP author XML (excluding books and edited volumes; unmatched venues remain unresolved)."
  ],
  [
    "完整 XML 已读取 {n} 篇期刊 / 会议记录。CoRR 等未匹配项不计入 A/B/C。",
    "Loaded {n} journal / conference records from XML. Unmatched venues such as CoRR are excluded from A/B/C."
  ],
  [
    "已停止或请求超时；已完成的结果保留。",
    "Stopped or timed out. Completed results are retained."
  ],
  [
    "补全已停止：{message} 已完成的结果保留，请在网站解除验证后重试。",
    "Completion stopped: {message} Completed results are retained. Retry after resolving the website verification."
  ],
  [
    "已清除当前作者主页的人工校正与年份设置。",
    "Corrections and year limits for this profile have been reset."
  ],
  [
    "不限",
    "Any"
  ],
  [
    "已导出年份范围内 {n} 篇，仅含一作论文、待匹配刊物及匹配依据；搜索和状态筛选只影响列表显示。",
    "Exported {n} first-author publications within the year limits, including unmatched venues and match evidence. Search and status filters affect the display only."
  ],
  [
    "无法读取本机设置，将使用默认设置。",
    "Could not read local settings. Using defaults."
  ],
  [
    "打开作者页即匹配 CCF 标签，并自动联网补全未识别刊物。选择等级后点击「开始统计」才计数；完成后可按所选等级或一作筛选展示。",
    "CCF labels and online venue completion start when an author page opens. Opening the page does not start a scan for statistics. Select ranks and start statistics to count, then filter by selected ranks or first author."
  ],
  [
    "显示统计框",
    "Show statistics panel"
  ],
  [
    "CCF 2026 第七版 · 本地处理",
    "CCF 2026 seventh edition · Local processing"
  ],
  [
    "请先打开 Google Scholar 或 DBLP 的个人作者主页。",
    "Open a Google Scholar or DBLP author profile first."
  ],
  [
    "目录全称 / 简称 / 别名精确匹配",
    "Exact catalogue name, abbreviation, or alias match"
  ],
  [
    "目录简称 / 别名匹配",
    "Catalogue abbreviation / alias match"
  ],
  [
    "移除年份、届次、出版社、卷号与页码后，刊物名称精确匹配",
    "Exact venue match after removing year, edition, publisher, volume, and pages"
  ],
  [
    "DBLP 期刊链接匹配",
    "DBLP journal URL match"
  ],
  [
    "ACM 论文集容器与明确会议期号匹配（{venue}）",
    "ACM proceedings container and explicit conference issue match ({venue})"
  ],
  [
    "截断名称前缀对应 {venue}，需补全详情确认",
    "Truncated name suggests {venue}; full details are needed"
  ],
  [
    "DBLP 第一作者 PID",
    "DBLP first-author PID"
  ],
  [
    "未获取到第一作者",
    "First author unavailable"
  ],
  [
    "第一作者姓名被截断",
    "First-author name is truncated"
  ],
  [
    "未读取到主页姓名",
    "Profile name unavailable"
  ],
  [
    "多个作者同分，身份无法唯一对应",
    "Author identity is ambiguous: tied name matches"
  ],
  [
    "主页姓名 / 别名规范化与缩写匹配，最佳匹配位于第 {n} 位",
    "Profile name / alias normalization and initial matching; best match at position {n}"
  ],
  [
    "第一作者与主页姓名 / 别名不匹配",
    "First author does not match the profile name / aliases"
  ],
  [
    "DBLP 完整作者姓名精确匹配",
    "Exact full DBLP author-name match"
  ],
  [
    "DBLP 同名编号未精确对应",
    "DBLP name-disambiguation number does not match exactly"
  ],
  [
    "DBLP 完整第一作者姓名不匹配",
    "Full DBLP first-author name does not match"
  ],
  [
    "DBLP 论文元数据自动核对",
    "Automatically verified DBLP publication metadata"
  ],
  [
    "DBLP 标题、年份、第一作者及刊物记录一致：{venue}",
    "DBLP title, year, first author, and venue agree: {venue}"
  ],
  [
    "已指定目录条目",
    "Manually assigned catalogue venue"
  ],
  [
    "未匹配，待补全",
    "Unmatched; details needed"
  ],
  [
    "目录版本",
    "Catalogue version"
  ],
  [
    "统计范围",
    "Scope"
  ],
  [
    "题名",
    "Title"
  ],
  [
    "第一作者",
    "First author"
  ],
  [
    "作者原文",
    "Original authors"
  ],
  [
    "刊物原文",
    "Original venue"
  ],
  [
    "一作状态",
    "First-author status"
  ],
  [
    "目录刊物",
    "Catalogue venue"
  ],
  [
    "一作依据",
    "Author evidence"
  ],
  [
    "分类依据",
    "Rank evidence"
  ],
  [
    "备注",
    "Note"
  ],
  [
    "链接",
    "URL"
  ],
  [
    "一作",
    "First author"
  ],
  [
    "非一作",
    "Other author position"
  ],
  [
    "待确认",
    "Unconfirmed"
  ],
  [
    "{venue} · 会议",
    "{venue} · Conference"
  ],
  [
    "{venue} · 期刊",
    "{venue} · Journal"
  ],
  [
    "详情不可用：网站可能要求验证码或登录。",
    "Publication details are unavailable. The website may require verification or sign-in."
  ],
  [
    "未识别详情字段；建议切换 Scholar 界面语言为中文或英文。",
    "Unrecognized detail fields. Set Scholar’s interface language to Chinese or English."
  ],
  [
    "DBLP 未返回有效作者 XML；可能触发访问验证。",
    "DBLP did not return valid author XML. Website verification may be required."
  ],
  [
    "年份 {from}—{to}",
    "Years {from}–{to}"
  ],
  [
    "统计 CCF A 论文",
    "Count CCF A publications"
  ],
  [
    "统计 CCF B 论文",
    "Count CCF B publications"
  ],
  [
    "统计 CCF C 论文",
    "Count CCF C publications"
  ],
  [
    "展示筛选",
    "Display filters"
  ],
  [
    "仅显示高亮论文",
    "Show only highlighted"
  ],
  [
    "仅展示一作",
    "Show first-author only"
  ],
  [
    "展示筛选不改变统计数量。",
    "Display filters do not change the counts."
  ],
  [
    "未选择此等级，未统计",
    "Rank not selected; not counted"
  ],
  [
    "请至少选择一个 CCF 等级后再开始统计。",
    "Select at least one CCF rank before starting statistics."
  ],
  [
    "只统计勾选的等级，未勾选等级不统计。统计包括所有作者位置；完成后可按高亮或一作筛选展示。年份范围仍生效。CCF 2026 第七版统一评级。",
    "Only selected ranks are counted, across all author positions. After counting, filter the display by highlighted papers or first authorship. Year limits still apply. Uses CCF 2026 seventh-edition ranks."
  ],
  [
    "DBLP 请求过于频繁（HTTP 429）；请稍后重新统计，已识别结果保留。",
    "DBLP rate limit (HTTP 429). Retry later; recognized results are retained."
  ],
  [
    "DBLP 拒绝访问（HTTP 403）；请检查网站访问状态后重试，已识别结果保留。",
    "DBLP denied access (HTTP 403). Check website access and retry; recognized results are retained."
  ],
  [
    "DBLP 查询超时；请检查网络后重新统计，已识别结果保留。",
    "DBLP query timed out. Check your connection and retry; recognized results are retained."
  ],
  [
    "DBLP 返回的内容无法解析，可能是访问验证页；请稍后重新统计。",
    "DBLP returned unreadable content, possibly an access challenge. Retry statistics later."
  ],
  [
    "DBLP 网络请求失败；请检查网络后重新统计，已识别结果保留。",
    "DBLP network request failed. Check your connection and retry; recognized results are retained."
  ],
  [
    "扩展查询连接中断；请刷新作者页后重新统计。",
    "The extension query connection was interrupted. Refresh the author page and retry."
  ],
  [
    "DBLP 服务暂时异常；请稍后重新统计，已识别结果保留。",
    "DBLP service error. Retry later; recognized results are retained."
  ],
  [
    "DBLP 查询失败；请稍后重新统计，已识别结果保留。",
    "DBLP query failed. Retry statistics later; recognized results are retained."
  ],
  [
    "允许 DBLP 搜索作为最后备用（默认关闭）",
    "Allow DBLP search as a last resort (off by default)"
  ],
  [
    "打开页面即补全标签。Scholar 优先读取本篇详情，再用 Crossref 按 DOI 或标题核对；DBLP 作者页优先读取一次作者 XML。开启备用后才逐篇搜索 DBLP。成功补全缓存 30 天，遇到验证或限流会停止对应来源的新请求。",
    "Labels are completed on page open. Scholar details come first, then Crossref by DOI or title. DBLP profiles use one author XML export. Per-paper DBLP search runs only when the fallback is enabled. Successful metadata is cached for 30 days; access challenges or rate limits pause the affected source."
  ],
  [
    "正在优先读取 Scholar 论文详情…",
    "Reading Scholar publication details first…"
  ],
  [
    "正在通过 Crossref 核对未识别刊物…",
    "Checking unmatched venues with Crossref…"
  ],
  [
    "正在使用 DBLP 备用搜索…",
    "Using the optional DBLP search fallback…"
  ],
  [
    "正在读取 DBLP 作者 XML，一次补全本页论文…",
    "Reading one DBLP author XML export to complete this profile…"
  ],
  [
    "DBLP 作者 XML：标题、年份、第一作者及刊物一致",
    "DBLP author XML: title, year, first author, and venue agree"
  ],
  [
    "DBLP 作者 XML 补全未完成；已识别标签保留，可稍后重新统计重试。",
    "DBLP author XML completion failed. Recognized labels are retained; retry statistics later."
  ],
  [
    "Crossref 标题、年份、第一作者及刊物一致：{venue}",
    "Crossref title, year, first author, and venue agree: {venue}"
  ],
  [
    "Crossref 请求受限；已暂停此来源，已识别标签保留，可稍后重试。",
    "Crossref rate limit. This source is paused; recognized labels are retained. Retry later."
  ],
  [
    "Crossref 查询超时；已暂停此来源，已识别标签保留，可稍后重试。",
    "Crossref query timed out. This source is paused; recognized labels are retained. Retry later."
  ],
  [
    "Crossref 查询未完成；已暂停此来源，已识别标签保留，可稍后重试。",
    "Crossref query failed. This source is paused; recognized labels are retained. Retry later."
  ],
  [
    "Crossref 访问权限未授予；请点击扩展图标，允许 Crossref 访问后重试。",
    "Crossref access is not granted. Click the extension icon, allow Crossref access, and retry."
  ],
  [
    "无法检查 Crossref 权限；请重新加载扩展并刷新作者页。",
    "Unable to check Crossref permissions. Reload the extension and refresh the profile."
  ],
  [
    "Crossref 连接失败（网络或跨域拦截）；请在扩展弹窗检查权限后重试。",
    "Crossref connection failed (network or cross-origin blocking). Check access in the extension popup and retry."
  ],
  [
    "DBLP 访问权限未授予；请在扩展管理页允许 DBLP 访问后重试。",
    "DBLP access is not granted. Allow DBLP access in extension settings and retry."
  ],
  [
    "无法检查 DBLP 权限；请重新加载扩展并刷新作者页。",
    "Unable to check DBLP permissions. Reload the extension and refresh the profile."
  ],
  [
    "DBLP 连接失败（网络或跨域拦截）；请检查网络与扩展访问权限后重试。",
    "DBLP connection failed (network or cross-origin blocking). Check your connection and extension site access, then retry."
  ],
  [
    "正在检查 Crossref 访问权限…",
    "Checking Crossref access…"
  ],
  [
    "允许 Crossref 访问",
    "Allow Crossref access"
  ],
  [
    "Crossref：已允许访问",
    "Crossref: access granted"
  ],
  [
    "Crossref：尚未允许访问",
    "Crossref: access not granted"
  ],
  [
    "允许后可从 Crossref 补全 DOI 或论文元数据，仅访问 api.crossref.org。",
    "Allows DOI or publication metadata completion from api.crossref.org only."
  ],
  [
    "无法检查 Crossref 权限",
    "Unable to check Crossref access"
  ],
  [
    "请在扩展管理页重新加载插件，再刷新作者页。",
    "Reload the extension in extension settings, then refresh the author profile."
  ],
  [
    "权限已启用。请刷新作者页，或点击「重新统计」重试。",
    "Access enabled. Refresh the author profile or click Recalculate to retry."
  ],
  [
    "未获得访问权限；本地标签和 Scholar 详情补全仍可使用。",
    "Access was not granted. Local labels and Scholar detail completion remain available."
  ],
  [
    "授权未完成。请在扩展管理页重新加载插件，并允许 api.crossref.org 访问。",
    "Authorization failed. Reload the extension in extension settings and allow api.crossref.org access."
  ],
  [
    "DBLP 作者主页 / PID（自动识别，可手动修正）",
    "DBLP author profile / PID (automatic; editable)"
  ],
  [
    "刷新 DBLP 作者缓存",
    "Refresh DBLP author cache"
  ],
  [
    "优先使用 DBLP 作者 XML；缓存 7 天，成功匹配记录保留 30 天。",
    "DBLP author XML comes first; cached for 7 days, with verified publication matches kept for 30 days."
  ],
  [
    "先复用缓存，再优先用关联的 DBLP 作者 XML 批量补全。Scholar 页自动搜索作者候选，并用论文交叉核对后关联；同名不确定时不自动认定。XML 未匹配的论文再读取 Scholar 详情；Crossref 和逐篇 DBLP 搜索均为可选，默认关闭。",
    "Reuse cached data, then complete publications from the linked DBLP author XML first. Scholar finds author candidates and verifies publications before linking; ambiguous names are not accepted. Remaining records use Scholar details. Crossref and per-paper DBLP search are optional and off by default."
  ],
  [
    "正在优先读取 DBLP 作者 XML，一次补全本页论文…",
    "Reading DBLP author XML first to complete this profile in one request…"
  ],
  [
    "DBLP 更新失败，正在使用此前缓存；可稍后刷新。",
    "DBLP refresh failed; using the previous cache. Retry refresh later."
  ],
  [
    "已复用 DBLP 作者 XML 缓存（7 天内）。",
    "Reused the DBLP author XML cache (within 7 days)."
  ],
  [
    "DBLP 作者 XML 已更新并缓存（7 天）。",
    "DBLP author XML updated and cached for 7 days."
  ],
  [
    "DBLP 作者 XML 未能读取；保留已匹配标签，继续尝试其他补全。",
    "Could not read DBLP author XML. Retaining verified labels and trying other sources."
  ],
  [
    "请填写有效的 DBLP 作者主页或 PID。",
    "Enter a valid DBLP author profile URL or PID."
  ],
  [
    "请先关联此作者的 DBLP 主页或 PID。",
    "Link this author’s DBLP profile or PID first."
  ],
  [
    "请先开启自动匹配未识别刊物。",
    "Enable automatic venue completion first."
  ],
  [
    "DBLP XML · 优先来源",
    "DBLP XML · Primary source"
  ],
  [
    "正在检查 DBLP 访问权限…",
    "Checking DBLP access…"
  ],
  [
    "允许 DBLP 访问",
    "Allow DBLP access"
  ],
  [
    "DBLP：已允许访问",
    "DBLP: access granted"
  ],
  [
    "DBLP：尚未允许访问",
    "DBLP: access not granted"
  ],
  [
    "自动定位作者并读取 XML，仅访问 dblp.org。",
    "Finds the author and reads XML from dblp.org only."
  ],
  [
    "无法检查 DBLP 权限",
    "Unable to check DBLP access"
  ],
  [
    "未获得 DBLP 访问权限；已缓存标签仍可使用。",
    "DBLP access was not granted. Cached labels remain available."
  ],
  [
    "授权未完成。请在扩展管理页允许 dblp.org 访问。",
    "Authorization failed. Allow dblp.org access in extension settings."
  ],
  [
    "DBLP 访问权限未授予；请在扩展弹窗允许 DBLP 访问后重试。",
    "DBLP access is not granted. Allow DBLP access in the extension popup and retry."
  ],
  [
    "DBLP 作者 XML 已读取；仅本页复用，未能持久保存。",
    "DBLP author XML loaded for this page; persistent caching was unavailable."
  ]
,
  ["启用 Crossref 补全（可选，默认关闭）","Enable Crossref completion (optional, off by default)"],
  ["尚未关联 DBLP 作者主页；请在设置中填写作者主页或 PID，以使用 XML 批量补全。","No DBLP author profile is linked. Enter the author profile URL or PID in settings to enable XML completion."],
  ["Crossref · 可选补全（默认关闭）","Crossref · Optional completion (off by default)"]
,
["正在自动定位 DBLP 作者，并核对论文…", "Finding the DBLP author and verifying publications…"],
["已通过论文核对，自动关联 DBLP 作者主页。", "DBLP author profile linked automatically after publication verification."],
["DBLP 作者定位暂时受限；已暂停请求，可稍后刷新作者缓存重试。", "DBLP author discovery is rate limited. Requests are paused; refresh the author cache later to retry."],
["DBLP 作者定位暂不可用；保留已有标签，可稍后刷新作者缓存重试。", "DBLP author discovery is unavailable. Existing labels are retained; refresh the author cache later to retry."],
["存在同名或多个候选，暂不自动关联；可加载更多论文后刷新作者缓存重试。", "Multiple or ambiguous author candidates. Load more publications and refresh the author cache to retry."],
["尚无足够论文证据确认 DBLP 作者；可加载更多论文后刷新作者缓存重试。", "Insufficient publication evidence to identify the DBLP author. Load more publications and refresh the author cache to retry."]
,
["Scholar 按论文标题和作者查询 DBLP，优先复用 24 小时缓存；DBLP 页面直接匹配已有刊物链接。", "Scholar queries DBLP by publication title and author, reusing the 24-hour cache. DBLP pages match existing venue links locally."],
["正在通过 DBLP 查询论文刊物…", "Looking up publication venues in DBLP…"],
["DBLP · 论文查询", "DBLP · Publication lookup"],
["按论文查询刊物，仅访问 dblp.org。", "Looks up publication venues on dblp.org only."],
["DBLP 页面刊物链接匹配：{venue}", "DBLP page venue link match: {venue}"],
["DBLP 论文搜索与刊物映射（CCFrank 方式）：{venue}", "DBLP publication search and venue mapping (CCFrank method): {venue}"]
,
["打开页面先展示本地和缓存标签，仅联网补全屏幕附近论文。点击统计后补全剩余已加载论文，可暂停。成功识别缓存 90 天，无结果缓存 1 天。", "Show local and cached labels immediately; look up nearby publications as you browse. Start statistics to complete all loaded publications, with pause and resume. Identified venues are cached for 90 days; no results for 1 day."],
["暂停补全", "Pause completion"],
["继续补全", "Resume completion"],
["已处理 {done}/{total} 篇", "Processed {done}/{total} publications"],
["正在补全 · 部分结果", "Completing · Partial results"],
["已暂停 · 部分结果", "Paused · Partial results"],
["部分结果 · 仍有待匹配论文", "Partial results · Some publications remain unmatched"],
["统计完成", "Statistics complete"],
["统计完成 · 部分结果", "Statistics complete · Partial results"],
["DBLP 已识别刊物，未列入当前 CCF A/B/C 目录", "Venue identified in DBLP; outside the current CCF A/B/C catalogue"],
["已识别为非 CCF A/B/C 刊物", "Identified as outside CCF A/B/C"],
["非 CCF A/B/C 刊物", "Outside CCF A/B/C"]
,
["当前为部分结果，补全尚未完成或仍有待匹配论文。","Partial results: completion is unfinished or some publications remain unmatched."]
,
["未列入 CCF A/B/C 目录","Outside the CCF A/B/C catalogue"]
,
    ['总数与一作数量','Total and first-author counts'],['总数','Total'],['仅显示所选等级','Show selected ranks only'],['一作筛选限定所选等级，不改变计数。','First-author filter uses selected ranks. Counts stay unchanged.'],['CCF {rank} 一作 {count} 篇','CCF {rank}: {count} first-author papers'],['只统计勾选的等级，未勾选等级不统计。同时展示总数与一作数；完成后可按所选等级或一作筛选展示。年份范围仍生效。CCF 2026 第七版统一评级。','Only selected ranks are counted, with total and first-author counts. Display filters use these ranks and the year range. CCF 2026, 7th edition.']
  ];
  const language='en';const listeners=new Set(),originals=new WeakMap();
  const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const compile=text=>{const names=[],parts=text.split(/(\{[a-zA-Z]+\})/g);return {names,regex:new RegExp('^'+parts.map(p=>/^\{/.test(p)?(names.push(p.slice(1,-1)),'([\\s\\S]*?)'):escape(p)).join('')+'$')};};
  const entries=pairs.map(([zh,en])=>({zh,en,z:compile(zh)}));
  function t(value){
    if(value===undefined||value===null)return value;
    const input=String(value),text=input.trim(),lead=input.slice(0,input.indexOf(text)),tail=input.slice(input.indexOf(text)+text.length);
    if(!text)return input;
    for(const item of entries){const from=item.zh,to=item.en;if(text===from)return lead+to+tail;}
    for(const item of entries){const source=item.z,target=item.en;if(!source.names.length)continue;const match=text.match(source.regex);if(match){const values=Object.fromEntries(source.names.map((n,i)=>[n,match[i+1]]));return lead+target.replace(/\{([a-zA-Z]+)\}/g,(_,n)=>['message','from','to'].includes(n)?t(values[n]):values[n])+tail;}}
    return input;
  }
  function localize(root){
    const skip='.paper > a,.venue > div:first-child,.user-note,[data-i18n-skip],#venues';
    const visit=node=>{
      if(node.nodeType===3){const prior=originals.get(node),source=prior&&node.textContent===prior.output?prior.source:node.textContent,output=t(source);node.textContent=output;originals.set(node,{source,output});return;}
      if(node.nodeType===1){if(node.matches('style,script')||node.matches(skip))return;
        for(const attr of ['placeholder','aria-label','title'])if(node.hasAttribute(attr)){const key='ccf-i18n-'+attr;let state=originals.get(node)||{};const previous=state[key],current=node.getAttribute(attr),source=previous&&current===previous.output?previous.source:current,output=t(source);node.setAttribute(attr,output);state[key]={source,output};originals.set(node,state);}}
      for(const child of node.childNodes||[])visit(child);
    };visit(root);
  }
  function emit(){for(const fn of listeners)fn(language);}
  const ready=(async()=>{try{const stored=await chrome.storage.local.get('ccf-ui-language');if(stored['ccf-ui-language']!=='en')await chrome.storage.local.set({'ccf-ui-language':'en'});}catch{}})();
  // Keep the internal compatibility hook, but the interface is English only.
  async function setLanguage(){await ready;emit();}
  globalThis.CCF_I18N={get language(){return language;},t,localize,ready,setLanguage,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);}};
})();
