/**
 * 图片处理工具
 */
const ImageUtil = {
    /**
     * 将文件转为 Base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('未选择文件'));
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                reject(new Error('请选择图片文件'));
                return;
            }

            // 限制文件大小 5MB
            if (file.size > 5 * 1024 * 1024) {
                reject(new Error('图片大小不能超过 5MB'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('图片读取失败'));
            reader.readAsDataURL(file);
        });
    },

    /**
     * 压缩图片（可选）
     */
    compressImage(base64, maxWidth = 1080, quality = 0.85) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                if (img.width <= maxWidth) {
                    resolve(base64);
                    return;
                }
                
                const canvas = document.createElement('canvas');
                const ratio = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * ratio;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = base64;
        });
    },

    /**
     * 处理图片输入（URL 或 上传文件）
     */
    async processImageInput(source) {
        if (!source) return '';
        
        // 已经是 base64
        if (source.startsWith('data:')) return source;
        
        // URL 直接返回
        if (source.startsWith('http://') || source.startsWith('https://')) return source;
        
        return source;
    }
};
