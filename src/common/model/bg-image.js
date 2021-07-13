const variable2ImageName = {
    normal: ['bg_normal.png!d1'],
    suspense: ['bg_suspense.png!d1'],
    scienceFinction: ['bg_science_fiction.png!d1'],
    magic: ['bg_magic.png!d1'],
    modern: ['bg_modern.png!d1'],
    ancientCustoms: ['bg_ancient_customs.png!d1'],
    terror: ['bg_terror.png!d1'],
};

const variable2Chinese = {
    suspense: ['悬疑'],
    ancientCustoms: ['古风'],
    scienceFinction: ['科幻'],
    modern: ['机械', '大型机械'],
    terror: ['微恐', '中恐', '重恐', '恐怖'],
    magic: ['二次元', '角色扮演'],
};

function getBackgroundImage(tags = []) {
    const type = Object.keys(variable2Chinese).find(key => variable2Chinese[key].find(tag => tags.findIndex(t => t === tag) >= 0));
    const urls = variable2ImageName[type || 'normal'];
    const url = urls[Math.floor(Math.random() * urls.length)];
    return url;
}

export default getBackgroundImage;