document.addEventListener('DOMContentLoaded', function () {
    injectNavbar();
    injectFooter();
    setActiveNav();
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
                <a class="nav-logo" href="${base}index.html">TUCM 造语者联盟</a>
                <button class="nav-menu-btn" type="button" aria-label="打开菜单">☰</button>
                <div class="nav-links">
                    <a href="${base}index.html" data-page="index.html">首页</a>
                    <a href="${base}pages/articles/ruqiehou-profile.html" data-page="ruqiehou-profile.html">人物</a>
                    <a href="${base}pages/articles/cooperation-groups.html" data-page="cooperation-groups.html">合作</a>
                    <a href="${base}pages/articles/collection.html" data-page="collection.html">文集</a>
                    <a href="${base}pages/tools/csms-dictionary.html" data-page="csms-dictionary.html">词典</a>
                    <a href="${base}pages/tools/word-generator.html" data-page="word-generator.html">造词机</a>
                    <a href="${base}pages/tools/random-name-place-generator.html" data-page="random-name-place-generator.html">生成器</a>
                    <a href="${base}pages/tools/user-center.html" data-page="user-center.html">用户中心</a>
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
            <p>版权所有 © 2020-2026 TUCM 造语者联盟</p>
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
