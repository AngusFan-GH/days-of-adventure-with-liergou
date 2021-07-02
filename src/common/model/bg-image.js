const variable2ImageName = {
    normal: ['bg_normal.png'],
    suspense: ['bg_suspense.png'],
    scienceFinction: ['bg_science_fiction.png'],
    magic: ['bg_magic.png'],
    modern: ['bg_modern.png'],
    ancientCustoms: ['bg_ancient_customs.png'],
    terror: ['bg_terror.png'],
};

const variable2Chinese = {
    suspense: ['悬疑'],
    ancientCustoms: ['古风'],
    scienceFinction: ['科幻'],
    modern: ['机械', '大型机械'],
    magic: ['二次元', '角色扮演'],
    terror: ['微恐', '中恐', '重恐', '恐怖'],
};

function getBackgroundImage(tags = []) {
    const type = Object.keys(variable2Chinese).find(key => variable2Chinese[key].find(tag => tags.findIndex(t => t === tag) >= 0));
    const urls = variable2ImageName[type || 'normal'];
    const url = urls[Math.floor(Math.random() * urls.length)];
    return url;
}

export default getBackgroundImage;