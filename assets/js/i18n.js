// 多语言支持核心：中文 / English / Français / Deutsch
(function () {
    'use strict';

    var STORAGE_KEY = 'tucm_lang';
    var SUPPORTED = ['zh', 'en', 'fr', 'de'];
    var DEFAULT_LANG = 'zh';
    var currentLang = null;
    var initialized = false;

    function normalize(lang) {
        if (!lang) return null;
        var code = String(lang).toLowerCase().slice(0, 2);
        return SUPPORTED.indexOf(code) !== -1 ? code : null;
    }

    function detectLang() {
        var saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            saved = null;
        }
        return normalize(saved) || normalize(navigator.language) || DEFAULT_LANG;
    }

    function dictionary(lang) {
        return (window.TUCM_I18N && window.TUCM_I18N[lang]) || {};
    }

    function has(dict, key) {
        return Object.prototype.hasOwnProperty.call(dict, key);
    }

    // 读取翻译，缺失时回退到英文，再回退到页面原始文本
    function t(key, fallback) {
        var active = dictionary(currentLang);
        if (has(active, key)) return active[key];
        var en = dictionary('en');
        if (has(en, key)) return en[key];
        return fallback === undefined ? key : fallback;
    }

    function store(el) {
        if (!el.__i18nDefaults) el.__i18nDefaults = {};
        return el.__i18nDefaults;
    }

    function original(el, prop, value) {
        var defaults = store(el);
        if (!has(defaults, prop)) defaults[prop] = value;
        return defaults[prop];
    }

    function translateElement(el) {
        var key = el.getAttribute('data-i18n');
        if (key) {
            var text = original(el, 'text', el.textContent);
            el.textContent = currentLang === 'zh' ? text : t(key, text);
        }

        key = el.getAttribute('data-i18n-html');
        if (key) {
            var html = original(el, 'html', el.innerHTML);
            el.innerHTML = currentLang === 'zh' ? html : t(key, html);
        }

        key = el.getAttribute('data-i18n-placeholder');
        if (key) {
            var placeholder = original(el, 'placeholder', el.getAttribute('placeholder') || '');
            el.setAttribute('placeholder', currentLang === 'zh' ? placeholder : t(key, placeholder));
        }

        key = el.getAttribute('data-i18n-title');
        if (key) {
            var title = original(el, 'title', el.getAttribute('title') || '');
            el.setAttribute('title', currentLang === 'zh' ? title : t(key, title));
        }

        key = el.getAttribute('data-i18n-aria-label');
        if (key) {
            var aria = original(el, 'ariaLabel', el.getAttribute('aria-label') || '');
            el.setAttribute('aria-label', currentLang === 'zh' ? aria : t(key, aria));
        }
    }

    function apply(root) {
        root = root || document;
        var nodes = root.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria-label]');
        for (var i = 0; i < nodes.length; i++) {
            translateElement(nodes[i]);
        }
        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang;
    }

    function updateSwitcher() {
        var select = document.getElementById('langSelect');
        if (select) select.value = currentLang;
    }

    function setLang(lang) {
        var next = normalize(lang);
        if (!next) return;
        if (next === currentLang) {
            updateSwitcher();
            return;
        }
        currentLang = next;
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {
            // 本地存储不可用时仅切换当前页面
        }
        apply(document);
        updateSwitcher();
        document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: next } }));
    }

    function init() {
        initialized = true;
        apply(document);
        updateSwitcher();

        var select = document.getElementById('langSelect');
        if (select && !select.__i18nBound) {
            select.__i18nBound = true;
            select.addEventListener('change', function () {
                setLang(this.value);
            });
        }
    }

    currentLang = detectLang();

    window.I18n = {
        t: t,
        apply: apply,
        init: init,
        setLang: setLang,
        getLang: function () {
            return currentLang;
        },
        languages: SUPPORTED.slice()
    };

    document.addEventListener('DOMContentLoaded', function () {
        if (!initialized) init();
    });
})();
