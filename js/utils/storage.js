/**
 * LocalStorage 管理工具
 */
const StorageUtil = {
    STORAGE_KEY: 'social-media-creator-projects',

    /**
     * 获取所有已保存项目
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('读取项目失败:', e);
            return [];
        }
    },

    /**
     * 保存项目
     */
    save(project) {
        const projects = this.getAll();
        const existingIdx = projects.findIndex(p => p.id === project.id);
        
        const saveData = {
            ...project,
            savedAt: new Date().toLocaleString('zh-CN'),
        };

        if (existingIdx >= 0) {
            projects[existingIdx] = saveData;
        } else {
            projects.push(saveData);
        }

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
            return true;
        } catch (e) {
            console.error('保存项目失败:', e);
            return false;
        }
    },

    /**
     * 删除项目
     */
    delete(index) {
        const projects = this.getAll();
        projects.splice(index, 1);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    },

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};
