// 随机数据生成器
// 添加全局数据存储
let namesData = null;


// 加载JSON数据
async function loadNamesData() {
    try {
        const response = await fetch('js/names.json');
        namesData = await response.json();
        initPage();
    } catch (error) {
        console.error('数据加载失败:', error);
    }
}

// 移除JSON相关代码，直接定义数据
const surnames = ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', '钱','孙','郑','冯','褚','卫','蒋','沈','韩','朱','秦','尤','许','何','吕','施','孔','曹','严','华','金','魏','陶','姜','戚','谢','邹','喻','柏','水','窦','章','云','苏','潘','葛','奚','范','彭','郎','鲁','韦','昌','马','苗','凤','花','方','俞','任','袁','柳','酆','鲍','史','唐','费','廖','毕','安','常','乐','于','时','傅','皮','卞','齐','康'];
const givenNames = ['伟','芳','娜','强','敏','浩','婷','杰','琳','斌','宇','欣','博','雅','睿'];
const prefixes = ['朝阳','平安','幸福','光明','龙泉','金水','白云','青山','碧海','红叶','东风','西河','南湖','北山','中关','东川','西川','北川','南川','语川','东拉','海洋','华阳川','四川'];
const suffixes = ['村','镇','街道','社区','区','县','市','巷','里','屯','庄','寨','乡','铺','营'];

// 简化后的生成函数
function generateRandomName() {
    return surnames[Math.floor(Math.random() * surnames.length)] + 
           givenNames[Math.floor(Math.random() * givenNames.length)];
}

function generateRandomLocation() {
    return prefixes[Math.floor(Math.random() * prefixes.length)] + 
           suffixes[Math.floor(Math.random() * suffixes.length)];
}

// 简化初始化流程
document.addEventListener('DOMContentLoaded', function() {
    // 初始生成
    generateName();
    generateLocation();
    
    // 立即绑定事件
    document.getElementById('generateNameBtn').addEventListener('click', generateName);
    document.getElementById('generateLocationBtn').addEventListener('click', generateLocation);
});

// 保留原有生成函数
function generateName() {
    document.getElementById('randomName').textContent = generateRandomName();
}

function generateLocation() {
    document.getElementById('randomLocation').textContent = generateRandomLocation();
}