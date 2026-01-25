// 文件路径: c:\Users\ASUS\OneDrive\Desktop\tucm_web\js\user_auth.js

document.addEventListener('DOMContentLoaded', function() {
    // 页面元素引用
    const authSection = document.getElementById('authSection');
    const dictionarySection = document.getElementById('dictionarySection');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabButtons = document.querySelectorAll('.tab-button');
    const dictTabBtn = document.getElementById('dictTabBtn');
    
    // 登录相关元素
    const loginNickname = document.getElementById('loginNickname');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const loginNicknameError = document.getElementById('login-nickname-error');
    const loginPasswordError = document.getElementById('login-password-error');
    const loginSuccess = document.getElementById('login-success');
    
    // 注册相关元素
    const regNickname = document.getElementById('regNickname');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const registerBtn = document.getElementById('registerBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const regNicknameError = document.getElementById('reg-nickname-error');
    const regPasswordError = document.getElementById('reg-password-error');
    const regConfirmError = document.getElementById('reg-confirm-error');
    const regSuccess = document.getElementById('reg-success');
    
    // 词库管理相关元素
    const userInfo = document.getElementById('userInfo');
    const displayNickname = document.getElementById('displayNickname');
    const logoutBtn = document.getElementById('logoutBtn');
    const wordInput = document.getElementById('word');
    const definitionInput = document.getElementById('definition');
    const pronunciationInput = document.getElementById('pronunciation');
    const addWordBtn = document.getElementById('addWordBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const wordsContainer = document.getElementById('wordsContainer');
    const addSuccess = document.getElementById('add-success');
    
    // 当前登录用户
    let currentUser = null;
    
    // 初始化页面
    initApp();
    
    function initApp() {
        // 检查是否有已登录用户
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            showDictionarySection();
        } else {
            showAuthSection();
        }
        
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // 标签页切换
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                
                // 更新标签页状态
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // 显示对应内容
                if (tab === 'auth') {
                    showAuthSection();
                } else if (tab === 'dictionary' && currentUser) {
                    showDictionarySection();
                } else if (tab === 'dictionary' && !currentUser) {
                    alert('请先登录以访问词库管理功能');
                    document.querySelector('[data-tab="auth"]').click();
                }
            });
        });
        
        // 登录表单事件
        loginBtn.addEventListener('click', handleLogin);
        showRegisterBtn.addEventListener('click', () => {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        });
        
        // 注册表单事件
        registerBtn.addEventListener('click', handleRegister);
        showLoginBtn.addEventListener('click', () => {
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
        
        // 词库管理事件
        addWordBtn.addEventListener('click', addWord);
        clearFormBtn.addEventListener('click', clearWordForm);
        logoutBtn.addEventListener('click', handleLogout);
        
        // 输入验证
        loginNickname.addEventListener('input', () => hideError(loginNickname, loginNicknameError));
        loginPassword.addEventListener('input', () => hideError(loginPassword, loginPasswordError));
        regNickname.addEventListener('input', () => hideError(regNickname, regNicknameError));
        regPassword.addEventListener('input', () => {
            hideError(regPassword, regPasswordError);
            if (regConfirmPassword.value) {
                validatePasswordsMatch();
            }
        });
        regConfirmPassword.addEventListener('input', validatePasswordsMatch);
    }
    
    function showAuthSection() {
        authSection.style.display = 'block';
        dictionarySection.style.display = 'none';
    }
    
    function showDictionarySection() {
        authSection.style.display = 'none';
        dictionarySection.style.display = 'block';
        displayNickname.textContent = currentUser.nickname;
        loadUserDictionary();
    }
    
    // 用户注册处理
    function handleRegister() {
        const nickname = regNickname.value.trim();
        const password = regPassword.value;
        const confirmPassword = regConfirmPassword.value;
        
        // 隐藏之前的消息
        hideAllMessages();
        
        // 验证输入
        let isValid = true;
        
        if (!validateNickname(nickname)) {
            showError(regNickname, regNicknameError, '昵称至少需要2个字符，最多20个字符，且不能包含特殊字符');
            isValid = false;
        } else if (isNicknameTaken(nickname)) {
            showError(regNickname, regNicknameError, '该昵称已被占用，请选择其他昵称');
            isValid = false;
        }
        
        if (!validatePassword(password)) {
            showError(regPassword, regPasswordError, '密码至少需要6个字符');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            showError(regConfirmPassword, regConfirmError, '两次输入的密码不一致');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // 创建新用户
        const newUser = {
            nickname: nickname,
            password: password,
            joinDate: new Date().toISOString(),
            dictionary: [] // 新用户初始词库为空
        };
        
        // 保存用户
        saveUser(newUser);
        
        // 显示成功消息
        regSuccess.style.display = 'block';
        
        // 自动登录新用户
        setTimeout(() => {
            currentUser = newUser;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDictionarySection();
            document.querySelector('[data-tab="dictionary"]').click();
        }, 1000);
    }
    
    // 用户登录处理
    function handleLogin() {
        const nickname = loginNickname.value.trim();
        const password = loginPassword.value;
        
        // 隐藏之前的消息
        hideAllMessages();
        
        // 验证输入
        if (!nickname) {
            showError(loginNickname, loginNicknameError, '请输入昵称');
            return;
        }
        
        // 查找用户
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const user = registeredUsers.find(u => u.nickname === nickname && u.password === password);
        
        if (!user) {
            if (!registeredUsers.some(u => u.nickname === nickname)) {
                showError(loginNickname, loginNicknameError, '用户不存在');
            } else {
                showError(loginPassword, loginPasswordError, '密码不正确');
            }
            return;
        }
        
        // 登录成功
        currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        loginSuccess.style.display = 'block';
        
        setTimeout(() => {
            showDictionarySection();
            document.querySelector('[data-tab="dictionary"]').click();
        }, 1000);
    }
    
    // 登出处理
    function handleLogout() {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        showAuthSection();
        document.querySelector('[data-tab="auth"]').click();
    }
    
    // 添加词条
    function addWord() {
        const word = wordInput.value.trim();
        const definition = definitionInput.value.trim();
        const pronunciation = pronunciationInput.value.trim();
        
        if (!word || !definition) {
            alert('词语和定义不能为空');
            return;
        }
        
        // 创建词条对象
        const newWord = {
            id: Date.now(), // 使用时间戳作为唯一ID
            word: word,
            definition: definition,
            pronunciation: pronunciation,
            dateAdded: new Date().toISOString()
        };
        
        // 添加到当前用户的词库
        currentUser.dictionary = currentUser.dictionary || [];
        currentUser.dictionary.push(newWord);
        
        // 保存更新后的用户数据
        updateUserDictionary(currentUser.nickname, currentUser.dictionary);
        
        // 显示成功消息并清空表单
        addSuccess.style.display = 'block';
        setTimeout(() => {
            addSuccess.style.display = 'none';
            clearWordForm();
            loadUserDictionary(); // 刷新词库列表
        }, 2000);
    }
    
    // 加载用户词库
    function loadUserDictionary() {
        if (!currentUser) return;
        
        const dictionary = currentUser.dictionary || [];
        wordsContainer.innerHTML = '';
        
        if (dictionary.length === 0) {
            wordsContainer.innerHTML = '<p>您的词库是空的。添加一些词条开始吧！</p>';
            return;
        }
        
        // 按添加时间倒序排列
        const sortedWords = [...dictionary].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        
        sortedWords.forEach(wordObj => {
            const wordItem = document.createElement('div');
            wordItem.className = 'dictionary-item';
            wordItem.innerHTML = `
                <div class="info">
                    <strong>${escapeHtml(wordObj.word)}</strong>
                    ${wordObj.pronunciation ? `<em>/${wordObj.pronunciation}/</em>` : ''}
                    <p>${escapeHtml(wordObj.definition)}</p>
                    <small>添加于: ${new Date(wordObj.dateAdded).toLocaleString()}</small>
                </div>
                <div class="actions">
                    <button class="btn" onclick="editWord('${wordObj.id}')">编辑</button>
                    <button class="btn btn-danger" onclick="deleteWord('${wordObj.id}')">删除</button>
                </div>
            `;
            wordsContainer.appendChild(wordItem);
        });
    }
    
    // 删除词条
    function deleteWord(wordId) {
        if (!confirm('确定要删除这个词条吗？')) return;
        
        // 从当前用户词库中移除词条
        currentUser.dictionary = currentUser.dictionary.filter(w => w.id != wordId);
        
        // 保存更新后的用户数据
        updateUserDictionary(currentUser.nickname, currentUser.dictionary);
        
        // 刷新词库列表
        loadUserDictionary();
    }
    
    // 编辑词条
    function editWord(wordId) {
        const wordObj = currentUser.dictionary.find(w => w.id == wordId);
        if (!wordObj) return;
        
        // 将词条信息填入表单
        wordInput.value = wordObj.word;
        definitionInput.value = wordObj.definition;
        pronunciationInput.value = wordObj.pronunciation || '';
        
        // 从词库中移除原词条
        currentUser.dictionary = currentUser.dictionary.filter(w => w.id != wordId);
        
        // 保存更新后的用户数据
        updateUserDictionary(currentUser.nickname, currentUser.dictionary);
        
        // 刷新词库列表
        loadUserDictionary();
        
        // 更新按钮文本为"更新词条"
        const addWordBtnText = addWordBtn.innerText;
        if(addWordBtnText !== '更新词条') {
            addWordBtn.dataset.originalText = addWordBtnText; // 保存原始文本
        }
        addWordBtn.innerText = '更新词条';
        addWordBtn.onclick = function() { updateWord(wordId); };
    }
    
    // 更新词条（在编辑模式下保存更改）
    function updateWord(wordId) {
        const word = wordInput.value.trim();
        const definition = definitionInput.value.trim();
        const pronunciation = pronunciationInput.value.trim();
        
        if (!word || !definition) {
            alert('词语和定义不能为空');
            return;
        }
        
        // 创建更新后的词条对象
        const updatedWord = {
            id: wordId, // 使用原来的ID
            word: word,
            definition: definition,
            pronunciation: pronunciation,
            dateAdded: new Date().toISOString()
        };
        
        // 添加到当前用户的词库
        currentUser.dictionary = currentUser.dictionary || [];
        // 如果已有相同ID的词条，先移除它
        currentUser.dictionary = currentUser.dictionary.filter(w => w.id != wordId);
        currentUser.dictionary.push(updatedWord);
        
        // 保存更新后的用户数据
        updateUserDictionary(currentUser.nickname, currentUser.dictionary);
        
        // 恢复按钮文本
        if(addWordBtn.dataset.originalText) {
            addWordBtn.innerText = addWordBtn.dataset.originalText;
            addWordBtn.onclick = function() { addWord(); };
        }
        
        // 显示成功消息并清空表单
        addSuccess.style.display = 'block';
        setTimeout(() => {
            addSuccess.style.display = 'none';
            clearWordForm();
            loadUserDictionary(); // 刷新词库列表
        }, 2000);
    }
    

    
    // 清空词条表单
    function clearWordForm() {
        wordInput.value = '';
        definitionInput.value = '';
        pronunciationInput.value = '';
    }
    
    // 工具函数
    function validateNickname(nickname) {
        if (!nickname || nickname.trim().length < 2 || nickname.trim().length > 20) {
            return false;
        }
        // 检查是否包含非法字符
        const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialChars.test(nickname)) {
            return false;
        }
        return true;
    }
    
    function validatePassword(password) {
        return password && password.length >= 6;
    }
    
    function validatePasswordsMatch() {
        const password = regPassword.value;
        const confirmPassword = regConfirmPassword.value;
        
        if (password !== confirmPassword) {
            showError(regConfirmPassword, regConfirmError, '两次输入的密码不一致');
            return false;
        } else {
            hideError(regConfirmPassword, regConfirmError);
            return true;
        }
    }
    
    function isNicknameTaken(nickname) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        return registeredUsers.some(user => user.nickname === nickname);
    }
    
    function saveUser(user) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        registeredUsers.push(user);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
    
    function updateUserDictionary(nickname, dictionary) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const userIndex = registeredUsers.findIndex(u => u.nickname === nickname);
        
        if (userIndex !== -1) {
            registeredUsers[userIndex].dictionary = dictionary;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            
            // 同时更新当前会话中的用户数据
            currentUser.dictionary = dictionary;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
    
    function showError(inputElement, errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.style.borderColor = '#e74c3c';
    }
    
    function hideError(inputElement, errorElement) {
        errorElement.style.display = 'none';
        inputElement.style.borderColor = '#ddd';
    }
    
    function hideAllMessages() {
        // 隐藏所有错误和成功消息
        const messages = document.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => msg.style.display = 'none');
        
        // 重置边框颜色
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => input.style.borderColor = '#ddd');
    }
    
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    // 全局函数供HTML调用
    window.deleteWord = deleteWord;
    window.editWord = editWord;
    
    // 确保updateWord也可在全局范围内访问
    window.updateWord = updateWord;
});
