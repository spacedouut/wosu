// wosu launcher chrome — additive, runs on every page.
// 1. keyboard access for beatmap cards (wraps addpreviewbox)
// 2. difficulty popup escapes carousel clipping (position:fixed + close on scroll)
// 3. command palette (Ctrl/Cmd+K), injected so every page gets it

(function () {
    "use strict";

    // ---- 1. beatmap cards: make them real buttons for keyboards ----
    function enhanceCard(box, map) {
        if (!box || box.dataset.wosuA11y) return box;
        box.dataset.wosuA11y = "1";
        box.tabIndex = 0;
        box.setAttribute("role", "button");
        var name = map && (map.title || map.artist) ? (map.title + " — " + map.artist) : "beatmap";
        box.setAttribute("aria-label", name);
        box.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                box.click();
            }
        });
        return box;
    }
    if (window.NSaddBeatmapList && window.NSaddBeatmapList.addpreviewbox) {
        var origAdd = window.NSaddBeatmapList.addpreviewbox;
        window.NSaddBeatmapList.addpreviewbox = function (map, list) {
            return enhanceCard(origAdd.call(window.NSaddBeatmapList, map, list), map);
        };
    }

    // ---- 2. difficulty popup: reposition into viewport space ----
    // The popup is created inside the card (absolute). Inside a scrollable
    // carousel it would be clipped, so convert it to fixed coordinates.
    var origCDL = window.createDifficultyList;
    window.createDifficultyList = function (box, event) {
        origCDL(box, event);
        var pop = window.currentDifficultyList;
        if (!pop) return;
        var hostRect = box.getBoundingClientRect();
        var x = parseFloat(pop.style.left) || 0;
        var y = parseFloat(pop.style.top) || 0;
        var w = Math.max(pop.offsetWidth, 330);
        var h = pop.offsetHeight || 220;
        pop.style.position = "fixed";
        pop.style.left = Math.max(8, Math.min(hostRect.left + x, window.innerWidth - w - 8)) + "px";
        pop.style.top = Math.max(8, Math.min(hostRect.top + y, window.innerHeight - h - 8)) + "px";
        var close = pop.clicklistener;
        if (close) {
            window.addEventListener("scroll", function onscroll() {
                window.removeEventListener("scroll", onscroll);
                close();
            }, { passive: true, once: true });
        }
    };

    // ---- 3. command palette ----
    var palette = null, paletteInput = null, lastFocus = null;

    function buildPalette() {
        palette = document.createElement("div");
        palette.className = "palette";
        palette.hidden = true;
        palette.setAttribute("role", "dialog");
        palette.setAttribute("aria-modal", "true");
        palette.setAttribute("aria-label", "Search beatmaps");
        var hint = (window.wosuI18n && wosuI18n.t("nav.search.placeholder")) || "Search beatmaps or SID";
        var esc = (window.wosuI18n && wosuI18n.t("palette.esc")) || "ESC to close";
        var enter = (window.wosuI18n && wosuI18n.t("palette.enter")) || "Enter to search";
        palette.innerHTML =
            '<div class="palette-panel">' +
            '  <form class="palette-row" action="search.html">' +
            '    <input type="text" name="q" autocomplete="off" spellcheck="false" aria-label="' + hint + '" placeholder="' + hint + '">' +
            "  </form>" +
            '  <div class="palette-quick">' +
            '    <a href="new.html">Latest</a>' +
            '    <a href="hot.html">Hot</a>' +
            '    <a href="genre.html">Genre</a>' +
            '    <a href="local.html">Favorites</a>' +
            '    <a href="history.html">History</a>' +
            "  </div>" +
            '  <div class="palette-hints">' +
            "    <span><kbd>↵</kbd>" + enter + "</span>" +
            "    <span><kbd>esc</kbd>" + esc + "</span>" +
            "  </div>" +
            "</div>";
        paletteInput = palette.querySelector("input");
        palette.addEventListener("click", function (e) {
            if (e.target === palette) closePalette();
        });
        document.body.appendChild(palette);
    }

    function openPalette() {
        if (document.body.classList.contains("gaming")) return;
        if (!palette) buildPalette();
        lastFocus = document.activeElement;
        palette.hidden = false;
        document.documentElement.classList.add("palette-open");
        paletteInput.focus();
        paletteInput.select();
    }

    function closePalette() {
        if (!palette || palette.hidden) return;
        palette.hidden = true;
        document.documentElement.classList.remove("palette-open");
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
            e.preventDefault();
            if (!palette || palette.hidden) openPalette();
            else closePalette();
        } else if (e.key === "Escape") {
            closePalette();
        }
    });

    function wireTriggers() {
        var btn = document.getElementById("palette-open-btn");
        if (btn && !btn.dataset.wired) {
            btn.dataset.wired = "1";
            btn.addEventListener("click", openPalette);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wireTriggers);
    } else {
        wireTriggers();
    }
})();
