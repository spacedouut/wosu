// wosu i18n - stateless, no build step
const WOSU_I18N = {
  zh: {
    "meta.title": "戳泡泡",
    "nav.brand": "Osaka Salmon University!",
    "nav.latest": "最新",
    "nav.hot": "热门",
    "nav.genre": "分类",
    "nav.search.placeholder": "谱面关键词或sid",
    "nav.favorites": "收藏夹",
    "nav.faq": "常见问题",
    "nav.settings": "设置",
    "nav.fullscreen": "进入全屏",
    "announcement": "公告：请考虑{link}！Sayobot是本站的谱面源，请给服务器续命❤️",
    "announcement.link": "支持Sayobot",
    "index.activity.title": "发生了什么",
    "index.activity.player": "玩家",
    "index.activity.song": "歌曲",
    "index.activity.combo": "连击",
    "index.activity.score": "分数",
    "index.activity.accuracy": "准确率",
    "index.activity.mods": "MODS",
    "index.activity.time": "时间",
    "index.random.title": "随机曲目",
    "index.random.refresh": "换一换",
    "index.recent.title": "最近游玩",
    "index.recent.more": "查看自己的游玩记录",
    "index.recent.empty": "你还没有玩过一首歌曲哦！单击曲目，待加载完成后选择难度即开始游玩。",
    "index.latest.title": "最新曲目",
    "index.latest.more": "查看更多最新曲目",
    "index.fav.title": "已收藏曲目",
    "index.fav.more": "查看更多已收藏曲目",
    "index.fav.empty": "你还没有收藏一首歌曲哦！点击曲目右下角的爱心以收藏这个曲目。",
    "index.hot.title": "热门曲目",
    "index.hot.more": "查看更多热门曲目",
    "index.support": "支持小夜",
    "index.support.suffix": "！请给服务器续命❤️",
    "index.recommend": "推荐使用最新版本 Firefox 或 Chrome.",
    "index.beta": "内测版v1.4.3.",
    "index.provided": "由{link}提供谱面",
    "index.provided.link": "Sayobot",
    "status.scripts": "Scripts",
    "status.skin": "Skin",
    "status.hitsounds": "Hitsounds",
    "page.latest.title": "最新曲目",
    "page.hot.title": "热门曲目",
    "page.genre.title": "分类",
    "page.favorites.title": "收藏夹",
    "page.faq.title": "常见问题",
    "page.history.title": "游玩记录",
    "page.local.title": "已收藏",
    "page.search.title": "搜索",
    "page.settings.title": "设置"
  },
  en: {
    "meta.title": "wosu",
    "nav.brand": "wosu",
    "nav.latest": "Latest",
    "nav.hot": "Hot",
    "nav.genre": "Genre",
    "nav.search.placeholder": "Search beatmaps or SID",
    "nav.favorites": "Favorites",
    "nav.faq": "FAQ",
    "nav.settings": "Settings",
    "nav.fullscreen": "Fullscreen",
    "announcement": "Notice: consider supporting {link}! Sayobot powers our beatmaps ❤️",
    "announcement.link": "Sayobot",
    "index.activity.title": "Recent Activity",
    "index.activity.player": "Player",
    "index.activity.song": "Song",
    "index.activity.combo": "Combo",
    "index.activity.score": "Score",
    "index.activity.accuracy": "Accuracy",
    "index.activity.mods": "MODS",
    "index.activity.time": "Time",
    "index.random.title": "Random Beatmaps",
    "index.random.refresh": "Refresh",
    "index.recent.title": "Recently Played",
    "index.recent.more": "View your play history",
    "index.recent.empty": "You haven't played any songs yet! Click a beatmap, wait for it to load, then pick a difficulty to play.",
    "index.latest.title": "Latest Beatmaps",
    "index.latest.more": "View more latest",
    "index.fav.title": "Favorited Beatmaps",
    "index.fav.more": "View more favorited",
    "index.fav.empty": "No favorites yet! Click the heart on a beatmap to favorite it.",
    "index.hot.title": "Popular Beatmaps",
    "index.hot.more": "View more popular",
    "index.support": "Support Sayobot",
    "index.support.suffix": " — keep the server alive ❤️",
    "index.recommend": "Recommended: latest Firefox or Chrome.",
    "index.beta": "Beta v1.4.3.",
    "index.provided": "Beatmaps provided by {link}",
    "index.provided.link": "Sayobot",
    "status.scripts": "Scripts",
    "status.skin": "Skin",
    "status.hitsounds": "Hitsounds",
    "page.latest.title": "Latest Beatmaps",
    "page.hot.title": "Popular Beatmaps",
    "page.genre.title": "Genre",
    "page.favorites.title": "Favorites",
    "page.faq.title": "FAQ",
    "page.history.title": "History",
    "page.local.title": "Favorites",
    "page.search.title": "Search",
    "page.settings.title": "Settings"
  }
};

(function() {
  const LANGS = { zh: "中文", en: "English" };
  const STORAGE_KEY = "wosu_lang";

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && WOSU_I18N[saved]) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    if (nav.startsWith("zh")) return "zh";
    return "en";
  }

  let currentLang = detectLang();

  function t(key, params) {
    const dict = WOSU_I18N[currentLang] || WOSU_I18N.en;
    let str = dict[key] || WOSU_I18N.en[key] || key;
    if (params) for (const k in params) str = str.replace("{"+k+"}", params[k]);
    return str;
  }

  function applyI18n() {
    document.documentElement.lang = currentLang;
    // title
    const titleKey = document.querySelector("title")?.getAttribute("data-i18n");
    if (titleKey) document.title = t(titleKey);
    else if (WOSU_I18N[currentLang]["meta.title"]) {
      // fallback: set generic title if page is chinese default
      const isZhTitle = document.title === "戳泡泡";
      if (isZhTitle || currentLang === "en") document.title = t("meta.title");
    }
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      // handle link-containing strings with {link} placeholder
      if (key === "announcement" || key === "index.provided") {
        const linkKey = key + ".link";
        const linkText = t(linkKey);
        const href = el.querySelector("a")?.getAttribute("href") || (key==="announcement" ? "https://osu.sayobot.cn/support" : "https://osu.sayobot.cn/");
        const template = t(key);
        // rebuild with link
        const a = `<a href="${href}">${linkText}</a>`;
        el.innerHTML = template.replace("{link}", a) + (el.getAttribute("data-i18n-suffix") ? t(el.getAttribute("data-i18n-suffix")) : "");
        // append extra suffix link if needed (donate)
        if (key === "announcement") {
          // keep donate link if exists in original
          if (!el.innerHTML.includes("paypal.me")) el.innerHTML += ` <a href="https://paypal.me/Sayobot">Donate with Paypal</a>`;
        }
      } else {
        el.textContent = t(key);
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    // lang picker value
    const picker = document.getElementById("wosu-lang-picker");
    if (picker) picker.value = currentLang;
  }

  function setLang(lang) {
    if (!WOSU_I18N[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyI18n();
  }

  function injectPicker() {
    if (document.getElementById("wosu-lang-picker")) return;
    const navTool = document.querySelector(".nav-tool");
    if (!navTool) return;
    const sel = document.createElement("select");
    sel.id = "wosu-lang-picker";
    sel.style.cssText = "margin-left:8px;padding:4px 6px;border-radius:6px;border:1px solid #ccc;background:#fff;font-size:13px;cursor:pointer;";
    for (const code in LANGS) {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = LANGS[code];
      sel.appendChild(opt);
    }
    sel.value = currentLang;
    sel.addEventListener("change", () => setLang(sel.value));
    navTool.appendChild(sel);
  }

  // expose
  window.wosuI18n = { t, setLang, getLang: () => currentLang };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { injectPicker(); applyI18n(); });
  } else {
    injectPicker(); applyI18n();
  }
  // re-apply for dynamically added beatmap lists after a short delay (covers still English)
  new MutationObserver(() => {
    // only re-apply static UI, not beatmap data
  });
})();
