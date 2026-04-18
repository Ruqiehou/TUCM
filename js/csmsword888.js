// 词典管理模块
let dictionary = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1小时缓存

async function loadDictionary() {
    if (dictionary && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return dictionary;
    }
    try {
        const response = await fetch('data/dictionary.json');
        dictionary = await response.json();
        cacheTimestamp = Date.now();
        return dictionary;
    } catch (error) {
        console.error('词典加载失败:', error);
        return {};
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 查询功能
const searchWord = debounce(async function() {
    const input = document.getElementById('inputWord').value.trim().toLowerCase();
    const resultDiv = document.getElementById('result');
    
    if (!input) {
        resultDiv.innerHTML = '<p class="placeholder-text">请输入内容开始探索...</p>';
        return;
    }

    resultDiv.innerHTML = '<div class="loading-spinner"></div>';
    const vocal = await loadDictionary();

    // 精确查询
    if (input in vocal) {
        resultDiv.innerHTML = `
            <div class="result-card">
                <h3>查索玛苏语单词</h3>
                <p class="highlight">${vocal[input]}</p>
            </div>`;
        
        // 反向模糊查询
        const reverseMatches = Object.keys(vocal).filter(key => 
            vocal[key].toLowerCase() === input
        );
        if (reverseMatches.length > 0) {
            resultDiv.innerHTML += `
                <div class="result-card">
                    <h3>对应的汉语词</h3>
                    <p>${reverseMatches.join(', ')}</p>
                </div>`;
        }
    } else {
        // 模糊查询逻辑...
        const fuzzyMatches = Object.entries(vocal).filter(([key, value]) => 
            key.toLowerCase().includes(input) || value.toLowerCase().includes(input)
        ).slice(0, 10); // 限制结果数量

        if (fuzzyMatches.length > 0) {
            resultDiv.innerHTML = `<div class="result-list">
                ${fuzzyMatches.map(([k, v]) => `
                    <div class="list-item">
                        <span class="cn">${k}</span>
                        <span class="arrow">→</span>
                        <span class="conlang">${v}</span>
                    </div>
                `).join('')}
            </div>`;
        } else {
            resultDiv.innerHTML = '<p class="no-result">未找到相关数据流...</p>';
        }
    }
}, 300);
