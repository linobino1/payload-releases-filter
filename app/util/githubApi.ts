export const endpoint = "https://api.github.com";

/**
 * [
 *   {
    "url": "https://api.github.com/repos/payloadcms/payload/releases/171153061",
    "assets_url": "https://api.github.com/repos/payloadcms/payload/releases/171153061/assets",
    "upload_url": "https://uploads.github.com/repos/payloadcms/payload/releases/171153061/assets{?name,label}",
    "html_url": "https://github.com/payloadcms/payload/releases/tag/v3.0.0-beta.88",
    "id": 171153061,
    "author": {
      "login": "denolfe",
      "id": 65888,
      "node_id": "MDQ6VXNlcjY1ODg4",
      "avatar_url": "https://avatars.githubusercontent.com/u/65888?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/denolfe",
      "html_url": "https://github.com/denolfe",
      "followers_url": "https://api.github.com/users/denolfe/followers",
      "following_url": "https://api.github.com/users/denolfe/following{/other_user}",
      "gists_url": "https://api.github.com/users/denolfe/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/denolfe/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/denolfe/subscriptions",
      "organizations_url": "https://api.github.com/users/denolfe/orgs",
      "repos_url": "https://api.github.com/users/denolfe/repos",
      "events_url": "https://api.github.com/users/denolfe/events{/privacy}",
      "received_events_url": "https://api.github.com/users/denolfe/received_events",
      "type": "User",
      "site_admin": false
    },
    "node_id": "RE_kwDOE37-zs4KM5al",
    "tag_name": "v3.0.0-beta.88",
    "target_commitish": "main",
    "name": "v3.0.0-beta.88",
    "draft": false,
    "prerelease": true,
    "created_at": "2024-08-20T20:41:12Z",
    "published_at": "2024-08-20T20:46:11Z",
    "assets": [],
    "tarball_url": "https://api.github.com/repos/payloadcms/payload/tarball/v3.0.0-beta.88",
    "zipball_url": "https://api.github.com/repos/payloadcms/payload/zipball/v3.0.0-beta.88",
    "body": "## [v3.0.0-beta.88](https://github.com/payloadcms/payload/compare/v3.0.0-beta.87...v3.0.0-beta.88) (2024-08-20)\r\n\r\n\r\n### Features\r\n\r\n* ui: export Banner component ([#7779](https://github.com/payloadcms/payload/issues/7779)) ([95a8bb0](https://github.com/payloadcms/payload/commit/95a8bb0))\r\n\r\n### Bug Fixes\r\n\r\n* ui: on Table component crashing when looking for className on admin ([#7776](https://github.com/payloadcms/payload/issues/7776)) ([9c2ccbf](https://github.com/payloadcms/payload/commit/9c2ccbf))\r\n* plugin-search: not being able to override labels ([#7775](https://github.com/payloadcms/payload/issues/7775)) ([3ee0e84](https://github.com/payloadcms/payload/commit/3ee0e84))\r\n* ui: text clipping on document header title with Segoe UI font ([#7774](https://github.com/payloadcms/payload/issues/7774)) ([6ec9820](https://github.com/payloadcms/payload/commit/6ec9820))\r\n\r\n### Contributors\r\n\r\n- Elliot DeNolf (@denolfe)\r\n- Paul (@paulpopus)\r\n- Tylan Davis (@tylandavis)\r\n",
    "mentions_count": 3
  },
 * ]
 */
export const fetchReleases = async (page: number = 1) => {
  console.log("fetchReleases");
  const res = await fetch(
    `${endpoint}/repos/payloadcms/payload/releases?page=${page}&per_page=10`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch releases");
  }

  return await res.json();
};
