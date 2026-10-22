document.addEventListener('DOMContentLoaded', function () {
    injectNavbar();
    injectFooter();
    setActiveNav();
    if (window.I18n) {
        I18n.init();
    }
});

function getBasePath() {
    var path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../../';
    }
    return './';
}

function injectNavbar() {
    var base = getBasePath();
    var navHTML = `
        <nav class="site-nav">
            <div class="nav-inner">
                <a class="nav-logo" href="${base}index.html" data-i18n="nav.logo">TUCM 造语者联盟</a>
                <div class="nav-right">
                    <div class="nav-links">
                        <a href="${base}index.html" data-page="index.html" data-i18n="nav.home">首页</a>
                        <a href="${base}pages/articles/ruqiehou-profile.html" data-page="ruqiehou-profile.html" data-i18n="nav.profile">人物</a>
                        <a href="${base}pages/articles/cooperation-groups.html" data-page="cooperation-groups.html" data-i18n="nav.cooperation">合作</a>
                        <a href="${base}pages/articles/collection.html" data-page="collection.html" data-i18n="nav.collection">文集</a>
                        <a href="${base}pages/tools/csms-dictionary.html" data-page="csms-dictionary.html" data-i18n="nav.dictionary">词典</a>
                        <a href="${base}pages/tools/word-generator.html" data-page="word-generator.html" data-i18n="nav.wordgen">造词机</a>
                        <a href="${base}pages/tools/random-name-place-generator.html" data-page="random-name-place-generator.html" data-i18n="nav.generator">生成器</a>
                        <a href="${base}pages/tools/user-center.html" data-page="user-center.html" data-i18n="nav.user">用户中心</a>
                    </div>
                    <select id="langSelect" class="lang-select" data-i18n-aria-label="lang.label" aria-label="语言">
                        <option value="zh" data-i18n="lang.zh">中文</option>
                        <option value="en" data-i18n="lang.en">English</option>
                        <option value="fr" data-i18n="lang.fr">Français</option>
                        <option value="de" data-i18n="lang.de">Deutsch</option>
                    </select>
                    <button class="nav-menu-btn" type="button" data-i18n-aria-label="nav.menuAria" aria-label="打开菜单">☰</button>
                </div>
            </div>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    var button = document.querySelector('.nav-menu-btn');
    var links = document.querySelector('.nav-links');
    if (button && links) {
        button.addEventListener('click', function () {
            links.classList.toggle('open');
        });
    }
}

function injectFooter() {
    var footerHTML = `
        <footer class="site-footer">
            <p data-i18n="footer.copyright">版权所有 © 2020-2026 TUCM 造语者联盟</p>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

function setActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        if (link.dataset.page === current) {
            link.classList.add('active');
        }
    });
}
