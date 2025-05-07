// 照片元数据管理模块
const PhotoManager = {
  // 获取按日期分组的照片数据
  getGroupedPhotos() {
    const photos = JSON.parse(localStorage.getItem('photos')) || [];
    return photos.reduce((groups, photo) => {
      const date = new Date(photo.timestamp).toLocaleDateString();
      groups[date] = groups[date] || [];
      groups[date].push(photo);
      return groups;
    }, {});
  },

  // 渲染画廊界面
  renderGallery() {
    const container = document.getElementById('galleryContainer');
    const grouped = this.getGroupedPhotos();
    
    container.innerHTML = Object.entries(grouped).map(([date, photos]) => `
      <div class="date-section">
        <h2>${date}</h2>
        <div class="photo-grid">
          ${photos.map(photo => `
            <div class="photo-item" data-id="${photo.id}">
              <img src="${photo.url}" class="thumbnail">
              <div class="description-preview">${photo.description || '点击添加描述'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  // 初始化图片查看模态框
  initModal() {
    this.modal = document.getElementById('imageModal');
    this.modalImg = document.getElementById('modalImage');
    this.modalDesc = document.getElementById('imageDescription');
    
    // 点击缩略图绑定事件
    document.querySelectorAll('.photo-item').forEach(item => {
      item.addEventListener('click', () => {
        const photoId = item.dataset.id;
        const photo = this.getPhotoById(photoId);
        this.showModal(photo);
      });
    });

    // 关闭模态框
    document.querySelector('.close').onclick = () => {
      this.modal.style.display = 'none';
    };
  },

  // 显示模态框
  showModal(photo) {
    this.modal.style.display = 'block';
    this.modalImg.src = photo.url;
    this.modalDesc.value = photo.description || '';
  },

  // 保存描述
  saveDescription() {
    const photos = JSON.parse(localStorage.getItem('photos')) || [];
    const updated = photos.map(photo => {
      if (photo.id === this.currentPhotoId) {
        return {...photo, description: this.modalDesc.value};
      }
      return photo;
    });
    localStorage.setItem('photos', JSON.stringify(updated));
    this.renderGallery();
  },

  // 初始化模块
  init() {
    this.renderGallery();
    this.initModal();
  }
};

// 页面加载后初始化
window.onload = () => PhotoManager.init();