// 布局注入模块
document.addEventListener('DOMContentLoaded', () => {
    injectNavbar();
    injectFooter();
});

function injectNavbar() {
    const navHTML = `
        <nav class="nav-tech">
            <div class="nav-logo">TUCM 造语者联盟</div>
            <div class="nav-links">
                <a href="/">首页</a>
                <a href="/csmsword.html">词典</a>
                <a href="/zcj.html">造词机</a>
                <a href="/sjrmdm.html">随机生成</a>
            </div>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

function injectFooter() {
    const footerHTML = `
        <footer style="text-align: center; padding: 20px; color: var(--text-muted); border-top: var(--glass-border); margin-top: auto;">
            <p>版权所有 © 2020-2026 TUCM 造语者联盟 | Powered by Future Tech</p>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    
    // 确保 body 有足够的最小高度和 flex 布局以固定页脚
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
}
