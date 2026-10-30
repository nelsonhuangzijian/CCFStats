# CCF Statistics for Google Scholar — Privacy Policy

Effective date: 30 October 2026. Applies to public version 1.0.0.


## Purpose and information used

The extension labels and counts publications on Google Scholar author profiles. It reads the displayed profile name, author names, publication titles, venues, years and publication identifiers or links needed for this feature. It does not read the contents of unrelated websites, passwords, cookies, authentication tokens or payment details. It does not access your Google account through an API.


## Local processing and storage

Venue catalogue matching, first-author identification, counts and display filters are processed locally. Profile-specific preferences, author aliases, selected ranks, venue metadata, lookup results and request cooldown state are stored in the extension's local browser storage, not Chrome Sync. Year selections are stored separately in the Scholar page's sessionStorage, scoped to the current profile and tab session. They survive page reloads but are not synchronized between devices; Reset clears the selected bounds. Positive ranked or non-CCF lookup results are eligible for reuse for up to 90 days; unresolved results for up to one day. Failed network responses are not stored as successful matches. Caches are bounded and entries may remain in local storage until replaced or evicted, even after they stop being eligible for reuse. Extension-local preferences remain until removed or the extension is uninstalled. Year selections follow the lifetime of the browser page session, including browser session restoration behavior.


## Requests to DBLP

For unresolved venues, the extension sends a publication title and the first author's surname to [DBLP](https://dblp.org/) using its HTTPS publication search API. Your browser also provides ordinary connection information such as your IP address to that service. The query includes a constant extension identifier, not a per-user identifier. No Google Scholar profile identifier, complete author list, saved alias list or account credentials are intentionally included in the search query. DBLP's processing is governed by its own [privacy information](https://dblp.org/db/about/privacy.html).

Labels and completion start automatically on opening a profile: local and cached results are used first, with network requests prioritised around the visible papers. Starting statistics may complete the remaining loaded papers in scope. Requests are shared, rate-limited and cached. This extension does not initiate Scholar search requests, open Scholar publication detail pages or click Load more.


## Sharing and limited use

The extension has no developer-operated server, analytics, advertising or tracking service. It does not sell user data. Publication queries are transmitted only to DBLP as needed for venue identification. Data accessed by the extension is used only to provide its stated publication-labeling and statistics purpose, consistent with the Chrome Web Store User Data Policy, including its Limited Use requirements.


## Your choices

During a statistics run you can pause completion with the panel's Pause completion control. To prevent browsing lookups, restrict or revoke DBLP site access in Chrome's extension settings, or disable the extension on Scholar. Revoking DBLP access leaves local and cached matching available. Uninstalling the extension removes its extension-local storage from that browser profile through Chrome's normal removal process. No developer account or cloud copy of your data is maintained.


## Contact and updates

For questions about this policy, use Issues in the GitHub repository distributing this extension. If you obtained the extension through the Chrome Web Store, you can also use the developer contact or support link shown in that listing. Any changes to data practices will be reflected in an updated policy and corresponding extension release.


This is an independent extension and is not affiliated with or endorsed by Google, CCF or DBLP.
