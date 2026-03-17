/**
 * Features Module
 * Icon picker, cover images, and other UI features
 */

const Features = {
    // Gradient covers
    gradients: [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
        'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
        'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
        'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
        'linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)',
        'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
        'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
    ],

    // Solid color covers
    solidColors: [
        '#eb5757', '#ffa344', '#ffdc49', '#4dab9a', '#529cca', 
        '#9a6dd7', '#e255a1', '#787774', '#37352f', '#2383e2'
    ],

    init() {
        this.setupIconPicker();
        this.setupCoverPicker();
        this.setupPageIcon();
        this.setupCoverActions();
    },

    // Icon Picker — Emojis tab (default) + Icons tab
    _pickerMode: 'emojis', // 'emojis' or 'icons'

    setupIconPicker() {
        const overlay = document.getElementById('emoji-picker-overlay');
        const picker = document.getElementById('emoji-picker');
        const categories = document.getElementById('emoji-categories');
        const grid = document.getElementById('emoji-grid');
        const search = document.getElementById('emoji-search');
        const removeBtn = document.getElementById('btn-remove-icon');

        // Add tab buttons before categories
        const tabBar = document.createElement('div');
        tabBar.className = 'icon-picker-tabs';
        tabBar.innerHTML = `
            <button class="icon-picker-tab active" data-tab="emojis">Emojis</button>
            <button class="icon-picker-tab" data-tab="icons">Icons</button>
        `;
        categories.parentNode.insertBefore(tabBar, categories);

        // Tab switching
        tabBar.addEventListener('click', (e) => {
            const tab = e.target.closest('.icon-picker-tab');
            if (!tab) return;
            tabBar.querySelectorAll('.icon-picker-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            this._pickerMode = tab.dataset.tab;
            search.value = '';
            this._loadPickerCategories();
            this._loadFirstCategory();
        });

        // Load initial (emojis)
        this._loadPickerCategories();
        this._loadFirstCategory();

        // Category click
        categories.addEventListener('click', (e) => {
            const btn = e.target.closest('.emoji-category-btn');
            if (btn) {
                categories.querySelectorAll('.emoji-category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this._loadCategoryGrid(btn.dataset.category);
            }
        });

        // Icon click
        grid.addEventListener('click', (e) => {
            const item = e.target.closest('.emoji-item');
            if (item) {
                this.selectIcon(item.dataset.icon);
                this.hideIconPicker();
            }
        });

        // Search
        search.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (!query) {
                this._loadFirstCategory();
                return;
            }
            this._searchIcons(query);
        });

        // Remove icon
        removeBtn.addEventListener('click', () => {
            this.selectIcon(null);
            this.hideIconPicker();
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideIconPicker();
            }
        });
    },

    _loadPickerCategories() {
        const categories = document.getElementById('emoji-categories');
        const cats = this._pickerMode === 'emojis' ? Icons.emojiCategories : Icons.categories;
        const catNames = Object.keys(cats);

        categories.innerHTML = catNames.map((name, i) => {
            const firstItem = cats[name][0];
            const iconHtml = this._pickerMode === 'emojis'
                ? `<span style="font-size:18px;line-height:1">${firstItem}</span>`
                : Icons.get(firstItem, 18);
            return `<button class="emoji-category-btn ${i === 0 ? 'active' : ''}" data-category="${name}" title="${name}">
                ${iconHtml}
            </button>`;
        }).join('');
    },

    _loadFirstCategory() {
        const cats = this._pickerMode === 'emojis' ? Icons.emojiCategories : Icons.categories;
        this._loadCategoryGrid(Object.keys(cats)[0]);
    },

    _loadCategoryGrid(category) {
        const grid = document.getElementById('emoji-grid');
        const isEmoji = this._pickerMode === 'emojis';
        const cats = isEmoji ? Icons.emojiCategories : Icons.categories;
        const items = cats[category] || [];

        if (isEmoji) {
            grid.innerHTML = items.map(char => `
                <button class="emoji-item" data-icon="emoji:${char}" title="${char}">
                    <span class="icon-emoji" style="font-size:28px;line-height:1">${char}</span>
                </button>
            `).join('');
        } else {
            grid.innerHTML = items.map(name => `
                <button class="emoji-item" data-icon="${name}" title="${name}">
                    ${Icons.get(name, 28)}
                </button>
            `).join('');
        }
    },

    _searchIcons(query) {
        const grid = document.getElementById('emoji-grid');
        let html = '';

        // Search UI icons by name
        Icons.list().forEach(name => {
            if (name.includes(query)) {
                html += `<button class="emoji-item" data-icon="${name}" title="${name}">${Icons.get(name, 28)}</button>`;
            }
        });

        // Search emoji categories by category name
        for (const [cat, chars] of Object.entries(Icons.emojiCategories)) {
            if (cat.toLowerCase().includes(query)) {
                chars.forEach(char => {
                    html += `<button class="emoji-item" data-icon="emoji:${char}" title="${cat}"><span class="icon-emoji" style="font-size:28px;line-height:1">${char}</span></button>`;
                });
            }
        }

        grid.innerHTML = html;
    },

    showIconPicker() {
        document.getElementById('emoji-picker-overlay').style.display = 'flex';
        document.getElementById('emoji-search').value = '';
        document.getElementById('emoji-search').focus();
        // Reset to emojis tab
        this._pickerMode = 'emojis';
        const tabs = document.querySelectorAll('.icon-picker-tab');
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === 'emojis'));
        this._loadPickerCategories();
        this._loadFirstCategory();
    },

    hideIconPicker() {
        document.getElementById('emoji-picker-overlay').style.display = 'none';
    },

    selectIcon(iconName) {
        if (App.currentPage) {
            App.currentPage.icon = iconName;
            document.getElementById('page-icon').innerHTML = iconName ? Icons.get(iconName, 60) : '';
            
            // Update has-icon class
            const header = document.querySelector('.page-header');
            if (iconName) {
                header.classList.add('has-icon');
            } else {
                header.classList.remove('has-icon');
            }
            
            App.saveCurrentPage();
            App.loadPageList();
            App.updateBreadcrumbs(App.currentPage);
        }
    },

    // Page Icon
    setupPageIcon() {
        const iconBtn = document.getElementById('page-icon');
        const addIconBtn = document.getElementById('btn-add-icon');
        const changeIconBtn = document.getElementById('btn-change-icon');

        iconBtn.addEventListener('click', () => {
            this.showIconPicker();
        });

        addIconBtn?.addEventListener('click', () => {
            this.showIconPicker();
        });

        changeIconBtn?.addEventListener('click', () => {
            this.showIconPicker();
        });
    },

    // Cover Picker
    setupCoverPicker() {
        const overlay = document.getElementById('cover-picker-overlay');
        const picker = document.getElementById('cover-picker');
        const content = document.getElementById('cover-picker-content');
        const closeBtn = document.getElementById('close-cover-picker');
        const tabs = document.querySelectorAll('.cover-tab');

        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.loadCoverTab(tab.dataset.tab);
            });
        });

        // Load initial tab (matches the default active tab 'gallery')
        this.loadCoverTab('gallery');

        // Close
        closeBtn.addEventListener('click', () => this.hideCoverPicker());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideCoverPicker();
            }
        });
    },

    loadCoverTab(tab) {
        const content = document.getElementById('cover-picker-content');
        
        switch (tab) {
            case 'gradient':
                content.innerHTML = `
                    <div class="gradient-grid">
                        ${this.gradients.map((g, i) => `
                            <div class="gradient-option" style="background: ${g}" data-gradient="${g}"></div>
                        `).join('')}
                    </div>
                `;
                content.querySelectorAll('.gradient-option').forEach(opt => {
                    opt.addEventListener('click', () => {
                        this.selectCover(opt.dataset.gradient, 'gradient');
                    });
                });
                break;

            case 'gallery':
                content.innerHTML = `
                    <div class="cover-grid">
                        ${this.solidColors.map(c => `
                            <div class="cover-option" style="background: ${c}" data-color="${c}"></div>
                        `).join('')}
                    </div>
                    <p style="margin-top: 16px; color: var(--text-muted); font-size: 13px;">
                        Or use any image URL in the Link tab
                    </p>
                `;
                content.querySelectorAll('.cover-option').forEach(opt => {
                    opt.addEventListener('click', () => {
                        this.selectCover(opt.dataset.color, 'color');
                    });
                });
                break;

            case 'upload':
                content.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <input type="file" id="cover-upload" accept="image/*" style="display: none;">
                        <button class="btn-primary" onclick="document.getElementById('cover-upload').click()">
                            Upload an image
                        </button>
                        <p style="margin-top: 12px; color: var(--text-muted); font-size: 13px;">
                            Images are saved to the workspace
                        </p>
                    </div>
                `;
                document.getElementById('cover-upload').addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        try {
                            const url = await Storage.uploadImage(file);
                            this.selectCover(`url(${url})`, 'image');
                        } catch (err) {
                            alert('Failed to upload cover image');
                        }
                    }
                });
                break;

            case 'link':
                content.innerHTML = `
                    <div style="padding: 20px 0;">
                        <input type="url" id="cover-url" placeholder="Paste image URL..." 
                            style="width: 100%; padding: 10px; border: 1px solid var(--border-color); 
                            border-radius: var(--radius-md); background: var(--bg-secondary); 
                            color: var(--text-primary); font-size: 14px;">
                        <button class="btn-primary" id="btn-apply-cover-url" style="margin-top: 12px;">
                            Apply
                        </button>
                    </div>
                `;
                document.getElementById('btn-apply-cover-url').addEventListener('click', () => {
                    const url = document.getElementById('cover-url').value;
                    if (url) {
                        this.selectCover(`url(${url})`, 'image');
                    }
                });
                break;
        }
    },

    showCoverPicker() {
        document.getElementById('cover-picker-overlay').style.display = 'flex';
    },

    hideCoverPicker() {
        document.getElementById('cover-picker-overlay').style.display = 'none';
    },

    selectCover(value, type) {
        if (App.currentPage) {
            const fit = App.currentPage.cover?.fit || 'cover';
            App.currentPage.cover = { value, type, fit };
            this.applyCover(value, type, fit);
            this._updateFitButton(fit);
            App.saveCurrentPage();
            this.hideCoverPicker();
        }
    },

    applyCover(value, type, fit) {
        const cover = document.getElementById('page-cover');
        const container = document.getElementById('page-cover-container');
        const editor = document.getElementById('page-editor');
        cover.classList.add('has-cover');
        container.style.display = '';
        editor.classList.add('has-cover');
        
        // Reset styles
        cover.style.background = '';
        cover.style.backgroundImage = '';
        cover.style.backgroundSize = '';
        cover.style.backgroundRepeat = '';
        cover.style.backgroundPosition = '';
        
        if (type === 'gradient' || type === 'color') {
            cover.style.background = value;
        } else if (type === 'image') {
            const imgUrl = value.startsWith('url(') ? value : `url(${value})`;
            cover.style.backgroundImage = imgUrl;
            
            if (fit === 'tile') {
                cover.style.backgroundSize = 'auto';
                cover.style.backgroundRepeat = 'repeat';
                cover.style.backgroundPosition = 'top left';
            } else {
                cover.style.backgroundSize = 'cover';
                cover.style.backgroundRepeat = 'no-repeat';
                cover.style.backgroundPosition = 'center';
            }
        }
    },

    removeCover() {
        const cover = document.getElementById('page-cover');
        const container = document.getElementById('page-cover-container');
        const editor = document.getElementById('page-editor');
        cover.classList.remove('has-cover');
        container.style.display = 'none';
        editor.classList.remove('has-cover');
        cover.style.background = '';
        cover.style.backgroundImage = '';
        
        if (App.currentPage) {
            App.currentPage.cover = null;
            App.saveCurrentPage();
        }
    },

    setupCoverActions() {
        const addCoverBtn = document.getElementById('btn-add-cover');
        const addCoverInlineBtn = document.getElementById('btn-add-cover-inline');
        const changeCoverBtn = document.getElementById('btn-change-cover');
        const removeCoverBtn = document.getElementById('btn-remove-cover');
        const toggleFitBtn = document.getElementById('btn-toggle-cover-fit');

        addCoverBtn?.addEventListener('click', () => this.showCoverPicker());
        addCoverInlineBtn?.addEventListener('click', () => this.showCoverPicker());
        changeCoverBtn?.addEventListener('click', () => this.showCoverPicker());
        removeCoverBtn?.addEventListener('click', () => this.removeCover());
        toggleFitBtn?.addEventListener('click', () => this.toggleCoverFit());
    },

    toggleCoverFit() {
        if (!App.currentPage || !App.currentPage.cover) return;
        const cover = App.currentPage.cover;
        cover.fit = cover.fit === 'tile' ? 'cover' : 'tile';
        this.applyCover(cover.value, cover.type, cover.fit);
        this._updateFitButton(cover.fit);
        App.saveCurrentPage();
    },

    _updateFitButton(fit) {
        const btn = document.getElementById('btn-toggle-cover-fit');
        if (!btn) return;
        const cover = App.currentPage?.cover;
        if (cover && cover.type === 'image') {
            btn.style.display = '';
            btn.textContent = fit === 'tile' ? 'Stretch' : 'Tile';
        } else {
            btn.style.display = 'none';
        }
    },

    // Load page cover and icon
    loadPageMeta(page) {
        // Icon — store icon name string, render SVG
        document.getElementById('page-icon').innerHTML = page.icon ? Icons.get(page.icon, 60) : '';
        
        // Toggle has-icon class
        const header = document.querySelector('.page-header');
        if (page.icon) {
            header.classList.add('has-icon');
        } else {
            header.classList.remove('has-icon');
        }
        
        // Cover
        const cover = document.getElementById('page-cover');
        const coverContainer = document.getElementById('page-cover-container');
        const editorEl = document.getElementById('page-editor');
        if (page.cover) {
            this.applyCover(page.cover.value, page.cover.type, page.cover.fit || 'cover');
            this._updateFitButton(page.cover.fit || 'cover');
        } else {
            cover.classList.remove('has-cover');
            coverContainer.style.display = 'none';
            editorEl.classList.remove('has-cover');
            cover.style.background = '';
            cover.style.backgroundImage = '';
            cover.style.backgroundSize = '';
            cover.style.backgroundRepeat = '';
            cover.style.backgroundPosition = '';
        }
    }
};
