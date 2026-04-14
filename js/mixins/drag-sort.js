/**
 * 拖拽排序 Mixin - 为评论列表提供拖拽排序功能
 */

const DragSortMixin = {
    props: ['sortableData'],
    emits: ['update:sortableData'],
    data() {
        return {
            dragItem: null,
            dragOverItem: null,
            originalOrder: []
        };
    },
    mounted() {
        this.originalOrder = [...this.sortableData];
    },
    methods: {
        // 开始拖拽
        onDragStart(item, index) {
            this.dragItem = item;
            this.dragOverItem = null;
            // 添加拖拽样式类
            const element = event.target.closest('.comment-item');
            if (element) {
                element.classList.add('dragging');
            }
        },
        
        // 拖拽经过
        onDragOver(item, index, event) {
            event.preventDefault();
            if (item === this.dragItem) return;
            
            const element = event.target.closest('.comment-item');
            if (!element) return;
            
            this.dragOverItem = item;
            
            // 计算鼠标位置相对于元素的高度
            const rect = element.getBoundingClientRect();
            const mouseY = event.clientY;
            const middleY = rect.top + rect.height / 2;
            
            // 清除之前的样式
            element.classList.remove('drag-over', 'drag-over-bottom');
            
            // 根据鼠标位置添加相应的样式
            if (mouseY < middleY) {
                element.classList.add('drag-over');
                element.style.paddingTop = '9px';
                element.style.paddingBottom = '';
            } else {
                element.classList.add('drag-over-bottom');
                element.style.paddingBottom = '9px';
                element.style.paddingTop = '';
            }
        },
        
        // 拖拽离开
        onDragLeave(item, index, event) {
            if (item === this.dragOverItem) {
                this.dragOverItem = null;
                const element = event.target.closest('.comment-item');
                if (element) {
                    element.classList.remove('drag-over', 'drag-over-bottom');
                    element.style.paddingTop = '';
                    element.style.paddingBottom = '';
                }
            }
        },
        
        // 放置
        onDrop(item, index, event) {
            event.preventDefault();
            
            if (this.dragItem && this.dragOverItem && this.dragItem !== this.dragOverItem) {
                // 获取原始数据
                const data = [...this.sortableData];
                
                // 找到拖拽项和目标项的索引
                const dragIndex = data.findIndex(d => d === this.dragItem);
                const dropIndex = data.findIndex(d => d === this.dragOverItem);
                
                if (dragIndex !== -1 && dropIndex !== -1) {
                    // 移除拖拽项
                    const [removed] = data.splice(dragIndex, 1);
                    
                    // 计算插入位置
                    let insertIndex = dropIndex;
                    if (mouseY > rect.top + rect.height / 2 && dragIndex < dropIndex) {
                        insertIndex = dropIndex + 1;
                    }
                    
                    // 插入到新位置
                    data.splice(insertIndex, 0, removed);
                    
                    // 更新数据
                    this.$emit('update:sortableData', data);
                    
                    // 显示提示
                    this.showToast('排序已更新');
                }
            }
            
            // 重置拖拽状态
            this.dragItem = null;
            this.dragOverItem = null;
            
            // 清除所有拖拽样式
            const elements = document.querySelectorAll('.comment-item');
            elements.forEach(el => {
                el.classList.remove('dragging', 'drag-over', 'drag-over-bottom');
                el.style.paddingTop = '';
                el.style.paddingBottom = '';
            });
        },
        
        // 显示提示
        showToast(message) {
            // 触发自定义事件让父组件显示提示
            this.$emit('show-toast', message);
        }
    }
};