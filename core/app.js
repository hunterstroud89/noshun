/**
 * Main Application Module
 * Handles page management, navigation, and UI interactions
 */

const MAX_RECENT_PAGES = 20;

const App = {
    currentPage: null,
    commandPaletteVisible: false,
    sidebarCollapsed: false,
    _expandedPages: new Set(),
    
    // SVG fallback icon for pages without a custom icon
    defaultIcon: Icons.get('page', 20),

    async init() {
        // Inject SVG icons into DOM placeholders
        this.injectIcons();

        // Initialize storage (loads pages + preferences from server)
        await Storage.init();
        
        // Apply theme from preferences
        const theme = Storage.getPref('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else if (theme === 'light') {
            document.body.classList.add('light-mode');
        }
        
        // Initialize editor
        Editor.init('editor-blocks');
        
        // Initialize features (emoji picker, covers)
        if (typeof Features !== 'undefined') {
            Features.init();
        }
        
        // Initialize history (undo/redo)
        if (typeof History !== 'undefined') {
            History.init();
        }
        
        // Setup UI event listeners
        this.setupEventListeners();
        
        // Setup format toolbar actions
        this.setupFormatToolbar();
        
        // Load pages
        this.loadPageList();
        
        // Load last opened page or show home
        this.loadLastPage();
        
        console.log('Notion Clone initialized');
    },

    injectIcons() {
        const map = {
            'workspace-icon': ['page', 18],
            'icon-search': ['search', 16],
            'icon-plus': ['plus', 16],
            'icon-trash': ['trash', 16],
            'icon-settings': ['settings', 16],
            'icon-star': ['star', 16],
            'icon-clock': ['clock', 16],
            'icon-page': ['page', 16],
            'icon-empty': ['page', 48],
            'icon-create-first': ['plus', 16],
            'icon-add-icon': ['smile', 16],
            'icon-change-icon': ['smile', 16],
            'icon-add-cover': ['image', 16],
            'icon-add-cover-inline': ['image', 16],
            'icon-format-link': ['link', 16],
            'icon-format-highlight': ['highlight', 16],
            'icon-trash-header': ['trash', 18],
            'icon-settings-header': ['settings', 18],
        };
        for (const [id, [name, size]] of Object.entries(map)) {
            const el = document.getElementById(id);
            if (el) el.innerHTML = Icons.get(name, size);
        }
    },

    setupEventListeners() {
        // New page button
        document.getElementById('new-page-btn').addEventListener('click', () => {
            this.createNewPage();
        });

        // Search button
        document.getElementById('search-btn').addEventListener('click', () => {
            this.showCommandPalette();
        });
        
        // Welcome screen create button
        document.getElementById('btn-create-first').addEventListener('click', () => {
            this.createNewPage();
        });

        // Workspace switcher → go Home
        document.getElementById('workspace-switcher')?.addEventListener('click', () => {
            this.showHome();
        });

        // Command palette
        document.getElementById('command-palette-input').addEventListener('input', (e) => {
            this.filterCommands(e.target.value);
        });
        document.getElementById('command-palette-input').addEventListener('keydown', (e) => {
            this.handleCommandPaletteKeydown(e);
        });
        document.querySelector('.command-palette-overlay').addEventListener('click', () => {
            this.hideCommandPalette();
        });

        // Page title editing
        const pageTitle = document.getElementById('page-title');
        pageTitle.addEventListener('input', () => {
            if (this.currentPage) {
                this.currentPage.title = pageTitle.textContent || 'Untitled';
                this.saveCurrentPage();
                this.updatePageListItem(this.currentPage.id, this.currentPage.title);
                this.updateBreadcrumbs(this.currentPage);
            }
        });
        pageTitle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.querySelector('.block-content')?.focus();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + K - Command palette
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.showCommandPalette();
            }
            
            // Cmd/Ctrl + N - New page
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                this.createNewPage();
            }
            
            // Cmd/Ctrl + S - Save
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentPage();
                this.showToast('Saved');
            }
            
            // Escape - Close modals
            if (e.key === 'Escape') {
                this.hideCommandPalette();
            }
            
            // Cmd/Ctrl + B - Bold
            if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
                e.preventDefault();
                this.formatSelection('bold');
            }
            
            // Cmd/Ctrl + I - Italic
            if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
                e.preventDefault();
                this.formatSelection('italic');
            }
            
            // Cmd/Ctrl + U - Underline
            if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
                e.preventDefault();
                this.formatSelection('underline');
            }
        });

        // Trash modal
        document.getElementById('btn-trash').addEventListener('click', () => this.showTrash());
        document.getElementById('close-trash').addEventListener('click', () => {
            document.getElementById('trash-modal').style.display = 'none';
        });
        document.getElementById('trash-modal').addEventListener('click', (e) => {
            if (e.target.id === 'trash-modal') document.getElementById('trash-modal').style.display = 'none';
        });
        
        // Settings modal
        document.getElementById('btn-settings').addEventListener('click', () => this.showSettings());
        document.getElementById('close-settings').addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'none';
        });
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') document.getElementById('settings-modal').style.display = 'none';
        });
        
        // Settings actions
        document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
                Storage.setPref('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                Storage.setPref('theme', 'light');
            }
        });
        
        document.getElementById('btn-export').addEventListener('click', () => {
            const data = Storage.exportData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'notion-clone-export.json';
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('Data exported');
        });
        
        document.getElementById('btn-import').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    await Storage.importData(data);
                    this.loadPageList();
                    this.showToast('Data imported');
                    document.getElementById('settings-modal').style.display = 'none';
                } catch (err) {
                    this.showToast('Invalid JSON file');
                }
            };
            reader.readAsText(file);
        });
        
        document.getElementById('btn-sync-now').addEventListener('click', async () => {
            await Storage.loadFromServer();
            this.loadPageList();
            if (this.currentPage) {
                const updated = Storage.getPage(this.currentPage.id);
                if (updated) {
                    this.currentPage = updated;
                    Editor.loadContent(updated.content);
                }
            }
            this.showToast('Synced with server');
        });
        
        document.getElementById('btn-clear-data').addEventListener('click', async () => {
            if (confirm('This will delete ALL pages permanently. Are you sure?')) {
                await Storage.clearAll();
                location.reload();
            }
        });


        
        // Hamburger menu toggle (works on all screen sizes)
        document.getElementById('btn-mobile-menu')?.addEventListener('click', () => {
            this.toggleSidebar();
        });
        // Close sidebar on overlay tap (mobile)
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && 
                !e.target.closest('#btn-mobile-menu')) {
                sidebar.classList.remove('open');
            }
        });

        // Page details panel
        document.getElementById('btn-page-details')?.addEventListener('click', () => {
            this.togglePageDetails();
        });
        document.getElementById('btn-close-details')?.addEventListener('click', () => {
            this.togglePageDetails();
        });
    },

    setupFormatToolbar() {
        document.querySelectorAll('#format-toolbar button[data-format]').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                this.formatSelection(format);
            });
        });
    },

    // Page operations
    createNewPage(parentId = null) {
        const page = Storage.createPage({ title: 'Untitled', parentId });
        this.loadPage(page.id);
        this.loadPageList();
        this.showToast('New page created');
    },

    loadPage(pageId) {
        const page = Storage.getPage(pageId);
        if (!page) return;
        
        this.currentPage = page;
        
        // Clear history when switching pages
        if (typeof History !== 'undefined') {
            History.clear();
            History.push(page.content || []);
        }
        
        // Show editor, hide home
        document.getElementById('home-screen').style.display = 'none';
        document.getElementById('page-editor').style.display = 'block';
        
        // Update title
        const pageTitle = document.getElementById('page-title');
        pageTitle.textContent = page.title;
        
        // Update page icon and cover
        if (typeof Features !== 'undefined') {
            Features.loadPageMeta(page);
        }
        
        // Load content into editor
        Editor.loadContent(page.content);
        
        // Update active state in sidebar
        document.querySelectorAll('.page-item').forEach(item => {
            item.classList.toggle('active', item.dataset.pageId === pageId);
        });
        
        // Update breadcrumbs
        this.updateBreadcrumbs(page);
        
        // Save as last opened
        Storage.setPref('lastPage', pageId);
        
        // Track recent pages
        this.trackRecentPage(pageId);

        // Update details panel if open
        if (document.getElementById('right-sidebar').classList.contains('open')) {
            this.updatePageDetails();
        }
    },

    trackRecentPage(pageId) {
        let recent = Storage.getPref('recentPages') || [];
        recent = recent.filter(id => id !== pageId);
        recent.unshift(pageId);
        recent = recent.slice(0, MAX_RECENT_PAGES);
        Storage.setPref('recentPages', recent);
    },

    saveCurrentPage() {
        if (!this.currentPage) return;
        
        this.currentPage.content = Editor.getContent();
        Storage.updatePage(this.currentPage.id, this.currentPage);

        // Update details panel if open
        if (document.getElementById('right-sidebar').classList.contains('open')) {
            this.updatePageDetails();
        }
        
        // Push to history for undo/redo
        if (typeof History !== 'undefined') {
            History.push(this.currentPage.content);
        }
    },

    deletePage(pageId) {
        if (confirm('Delete this page?')) {
            Storage.deletePage(pageId);
            this.loadPageList();
            
            if (this.currentPage?.id === pageId) {
                this.showHome();
            }
            
            this.showToast('Page deleted');
        }
    },

    toggleFavorite(pageId) {
        const page = Storage.getPage(pageId);
        if (page) {
            page.isFavorite = !page.isFavorite;
            Storage.updatePage(pageId, page);
            this.loadPageList();
        }
    },

    // Page list — tree structure with nested pages
    loadPageList() {
        const pageList = document.getElementById('page-list');
        const favoritesList = document.getElementById('favorites-list');
        const pages = Storage.getActivePages();
        
        // Clear lists
        pageList.innerHTML = '';
        favoritesList.innerHTML = '';
        
        // Build child map for tree rendering
        const childMap = {};
        pages.forEach(p => {
            if (p.parentId) {
                if (!childMap[p.parentId]) childMap[p.parentId] = [];
                childMap[p.parentId].push(p);
            }
        });
        
        // Root pages (no parent)
        const rootPages = pages.filter(p => !p.parentId);
        
        // Favorites (flat, regardless of nesting)
        const favorites = pages.filter(p => p.isFavorite);
        favorites.forEach(page => {
            favoritesList.appendChild(this.createPageListItem(page, 0, childMap));
        });
        
        // Render tree (non-favorite roots)
        rootPages.filter(p => !p.isFavorite).forEach(page => {
            pageList.appendChild(this.createPageListItem(page, 0, childMap));
        });
        
        // Show/hide favorites section
        document.querySelector('.favorites-section').style.display = 
            favorites.length > 0 ? 'block' : 'none';
    },

    createPageListItem(page, depth = 0, childMap = {}) {
        const hasChildren = childMap[page.id] && childMap[page.id].length > 0;
        const isExpanded = this._expandedPages.has(page.id);
        
        const item = document.createElement('div');
        item.className = 'page-item' + (this.currentPage?.id === page.id ? ' active' : '');
        item.dataset.pageId = page.id;
        item.draggable = true;
        item.style.paddingLeft = (8 + depth * 16) + 'px';
        
        item.innerHTML = `
            <span class="page-toggle ${hasChildren ? '' : 'invisible'}" data-action="toggle-children">${isExpanded ? '▾' : '▸'}</span>
            <span class="page-icon">${page.icon ? Icons.get(page.icon, 20) : this.defaultIcon}</span>
            <span class="page-name">${this.escapeHtml(page.title || 'Untitled')}</span>
            <div class="page-actions">
                <button class="page-action-btn add-subpage-btn" title="Add sub-page">+</button>
                <button class="page-action-btn favorite-btn" title="${page.isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                    ${page.isFavorite ? Icons.get('star-filled', 16) : Icons.get('star', 16)}
                </button>
                <button class="page-action-btn delete-btn" title="Delete">×</button>
            </div>
        `;
        
        // Wrapper to hold item + children
        const wrapper = document.createElement('div');
        wrapper.className = 'page-tree-node';
        wrapper.appendChild(item);
        
        // Click to open
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.page-action-btn') && !e.target.closest('.page-toggle')) {
                this.loadPage(page.id);
            }
        });
        
        // Toggle expand/collapse
        item.querySelector('.page-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            if (this._expandedPages.has(page.id)) {
                this._expandedPages.delete(page.id);
            } else {
                this._expandedPages.add(page.id);
            }
            this.loadPageList();
        });
        
        // Add sub-page
        item.querySelector('.add-subpage-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this._expandedPages.add(page.id);
            this.createNewPage(page.id);
        });
        
        // Favorite button
        item.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(page.id);
        });
        
        // Delete button
        item.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deletePage(page.id);
        });
        
        // Drag and drop
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', page.id);
            item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            document.querySelectorAll('.page-item').forEach(i => i.classList.remove('drop-target'));
        });
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dragging = document.querySelector('.page-item.dragging');
            if (dragging && dragging !== item) item.classList.add('drop-target');
        });
        item.addEventListener('dragleave', () => item.classList.remove('drop-target'));
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            if (draggedId !== page.id) {
                const draggedPage = Storage.getPage(draggedId);
                if (draggedPage) {
                    draggedPage.parentId = page.id;
                    Storage.updatePage(draggedId, draggedPage);
                    this._expandedPages.add(page.id);
                    this.loadPageList();
                }
            }
            item.classList.remove('drop-target');
        });
        
        // Render children if expanded
        if (hasChildren && isExpanded) {
            const childContainer = document.createElement('div');
            childContainer.className = 'page-children';
            childMap[page.id].forEach(child => {
                childContainer.appendChild(this.createPageListItem(child, depth + 1, childMap));
            });
            wrapper.appendChild(childContainer);
        }
        
        return wrapper;
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Breadcrumb navigation for nested pages
    updateBreadcrumbs(page) {
        const breadcrumbs = document.getElementById('breadcrumbs');
        const chain = [];
        let current = page;
        while (current) {
            chain.unshift(current);
            current = current.parentId ? Storage.getPage(current.parentId) : null;
        }
        
        breadcrumbs.innerHTML = '';
        // Workspace root
        const rootSpan = document.createElement('span');
        rootSpan.className = 'breadcrumb-item';
        rootSpan.innerHTML = Icons.get('home', 18);
        rootSpan.title = 'Home';
        rootSpan.addEventListener('click', () => this.showHome());
        breadcrumbs.appendChild(rootSpan);
        
        chain.forEach((p, i) => {
            // Separator
            const sep = document.createElement('span');
            sep.className = 'breadcrumb-sep';
            sep.textContent = '/';
            breadcrumbs.appendChild(sep);
            
            const crumb = document.createElement('span');
            crumb.className = 'breadcrumb-item' + (i === chain.length - 1 ? ' active' : '');
            crumb.innerHTML = (p.icon ? Icons.get(p.icon, 18) + ' ' : '<span class="breadcrumb-icon">' + this.defaultIcon + '</span> ') + this.escapeHtml(p.title || 'Untitled');
            crumb.addEventListener('click', () => this.loadPage(p.id));
            breadcrumbs.appendChild(crumb);
        });
    },

    updatePageListItem(pageId, title) {
        const item = document.querySelector(`.page-item[data-page-id="${pageId}"]`);
        if (item) {
            item.querySelector('.page-name').textContent = title;
        }
    },

    loadLastPage() {
        const lastPageId = Storage.getPref('lastPage');
        if (lastPageId && Storage.getPage(lastPageId)) {
            this.loadPage(lastPageId);
        } else {
            this.showHome();
        }
    },

    showHome() {
        this.currentPage = null;
        Storage.setPref('lastPage', null);
        document.getElementById('page-editor').style.display = 'none';
        document.getElementById('page-cover-container').style.display = 'none';
        document.getElementById('home-screen').style.display = '';
        
        // Clear active state in sidebar
        document.querySelectorAll('.page-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Update breadcrumbs to just show Home
        const breadcrumbs = document.getElementById('breadcrumbs');
        breadcrumbs.innerHTML = '<span class="breadcrumb-item active">Home</span>';
        
        // Greeting
        const hour = new Date().getHours();
        let greeting = 'Good evening';
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 17) greeting = 'Good afternoon';
        document.getElementById('home-greeting').textContent = greeting;
        
        const pages = Storage.getActivePages();
        
        if (pages.length === 0) {
            document.getElementById('home-empty').style.display = '';
            document.getElementById('home-favorites-section').style.display = 'none';
            document.getElementById('home-recent-section').style.display = 'none';
            document.getElementById('home-all-section').style.display = 'none';
            return;
        }
        
        document.getElementById('home-empty').style.display = 'none';
        
        // Favorites
        const favs = pages.filter(p => p.isFavorite);
        const favsSection = document.getElementById('home-favorites-section');
        const favsGrid = document.getElementById('home-favorites');
        if (favs.length > 0) {
            favsSection.style.display = '';
            favsGrid.innerHTML = favs.map(p => this.renderHomeCard(p)).join('');
        } else {
            favsSection.style.display = 'none';
        }
        
        // Recent pages
        const recentIds = Storage.getPref('recentPages') || [];
        const recentPages = recentIds
            .map(id => pages.find(p => p.id === id))
            .filter(Boolean)
            .slice(0, 8);
        const recentSection = document.getElementById('home-recent-section');
        const recentGrid = document.getElementById('home-recent');
        if (recentPages.length > 0) {
            recentSection.style.display = '';
            recentGrid.innerHTML = recentPages.map(p => this.renderHomeCard(p)).join('');
        } else {
            recentSection.style.display = 'none';
        }
        
        // All pages (sorted by last updated)
        const allSorted = [...pages].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        const allSection = document.getElementById('home-all-section');
        const allList = document.getElementById('home-all-pages');
        allSection.style.display = '';
        allList.innerHTML = allSorted.map(p => this.renderHomeRow(p, pages)).join('');
        
        // Bind click events
        document.querySelectorAll('.home-page-card, .home-page-row').forEach(el => {
            el.addEventListener('click', () => {
                this.loadPage(el.dataset.pageId);
            });
        });
    },

    renderHomeCard(page) {
        let bannerStyle = '';
        let bannerImg = '';
        if (page.cover) {
            const cover = typeof page.cover === 'object' ? page.cover : { type: 'image', value: page.cover };
            if (cover.type === 'gradient' || cover.type === 'color') {
                bannerStyle = ` style="background: ${cover.value}"`;
            } else if (cover.type === 'image' && cover.value) {
                const src = cover.value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                bannerImg = `<img class="home-card-banner-img" src="${this.escapeHtml(src)}" alt="">`;
            }
        }
        const timeAgo = this.timeAgo(page.updatedAt || page.createdAt);
        return `<div class="home-page-card" data-page-id="${page.id}">
            <div class="home-card-banner"${bannerStyle}>${bannerImg}<span class="home-card-icon">${page.icon ? Icons.get(page.icon, 34) : Icons.get('page', 34)}</span></div>
            <div class="home-card-body">
                <div class="home-card-title">${this.escapeHtml(page.title || 'Untitled')}</div>
                <div class="home-card-meta">${timeAgo}</div>
            </div>
        </div>`;
    },

    renderHomeRow(page, allPages) {
        const timeAgo = this.timeAgo(page.updatedAt || page.createdAt);
        let parentHtml = '';
        if (page.parentId && allPages) {
            const parent = allPages.find(p => p.id === page.parentId);
            if (parent) {
                parentHtml = `<span class="home-row-parent">in ${parent.icon ? Icons.get(parent.icon, 16) : Icons.get('page', 16)} ${this.escapeHtml(parent.title || 'Untitled')}</span>`;
            }
        }
        return `<div class="home-page-row" data-page-id="${page.id}">
            <span class="home-row-icon">${page.icon ? Icons.get(page.icon, 20) : Icons.get('page', 20)}</span>
            <span class="home-row-title">${this.escapeHtml(page.title || 'Untitled')}${parentHtml}</span>
            <span class="home-row-meta">${timeAgo}</span>
        </div>`;
    },

    timeAgo(ts) {
        if (!ts) return '';
        const diff = Date.now() - ts;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return mins + 'm ago';
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return hrs + 'h ago';
        const days = Math.floor(hrs / 24);
        if (days < 7) return days + 'd ago';
        return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    },

    // Command palette
    showCommandPalette() {
        const palette = document.getElementById('command-palette');
        palette.style.display = 'flex';
        this.commandPaletteVisible = true;
        
        const input = document.getElementById('command-palette-input');
        input.value = '';
        input.focus();
        
        this.populateCommandResults('');
    },

    hideCommandPalette() {
        const palette = document.getElementById('command-palette');
        palette.style.display = 'none';
        this.commandPaletteVisible = false;
    },

    filterCommands(query) {
        this.populateCommandResults(query);
    },

    populateCommandResults(query) {
        const results = document.getElementById('command-results');
        const pages = Storage.getActivePages();
        
        const commands = [
            { type: 'action', name: 'New Page', icon: 'plus', action: () => this.createNewPage() },
            { type: 'action', name: 'Export Data', icon: 'download', action: () => Storage.exportData() },
            { type: 'action', name: 'Toggle Dark Mode', icon: 'moon', action: () => this.toggleTheme() },
        ];
        
        // Add pages to results
        pages.forEach(page => {
            commands.push({
                type: 'page',
                name: page.title,
                icon: page.icon || 'page',
                action: () => this.loadPage(page.id)
            });
        });
        
        // Filter
        const filtered = query 
            ? commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
            : commands;
        
        results.innerHTML = filtered.map((cmd, i) => `
            <div class="command-result ${i === 0 ? 'active' : ''}" data-index="${i}">
                <span class="command-icon">${Icons.get(cmd.icon, 20)}</span>
                <span class="command-name">${cmd.name}</span>
                <span class="command-type">${cmd.type}</span>
            </div>
        `).join('');
        
        // Store filtered commands for selection
        this._filteredCommands = filtered;
        this._commandIndex = 0;
        
        // Add click handlers
        results.querySelectorAll('.command-result').forEach((el, i) => {
            el.addEventListener('click', () => {
                filtered[i].action();
                this.hideCommandPalette();
            });
        });
    },

    handleCommandPaletteKeydown(e) {
        const results = document.querySelectorAll('.command-result');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this._commandIndex = Math.min(this._commandIndex + 1, results.length - 1);
            this.updateCommandActive();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this._commandIndex = Math.max(this._commandIndex - 1, 0);
            this.updateCommandActive();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this._filteredCommands[this._commandIndex]) {
                this._filteredCommands[this._commandIndex].action();
                this.hideCommandPalette();
            }
        }
    },

    updateCommandActive() {
        document.querySelectorAll('.command-result').forEach((el, i) => {
            el.classList.toggle('active', i === this._commandIndex);
        });
    },

    // Formatting — using Selection/Range API (no deprecated execCommand)
    formatSelection(format) {
        const selection = window.getSelection();
        if (!selection.toString() || selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        
        // Check if already wrapped in the target tag
        const parentTag = this._getFormatParent(range, format);
        
        if (parentTag) {
            // Unwrap — remove the formatting
            this._unwrapFormat(parentTag);
        } else {
            // Wrap selection in the appropriate element
            switch (format) {
                case 'bold': this._wrapSelection(range, 'strong'); break;
                case 'italic': this._wrapSelection(range, 'em'); break;
                case 'underline': this._wrapSelection(range, 'u'); break;
                case 'strike': this._wrapSelection(range, 's'); break;
                case 'code': this._wrapSelection(range, 'code'); break;
                case 'highlight': {
                    const mark = document.createElement('mark');
                    mark.style.background = 'rgba(255, 212, 0, 0.4)';
                    mark.style.padding = '0 2px';
                    mark.style.borderRadius = '2px';
                    range.surroundContents(mark);
                    break;
                }
                case 'link': {
                    const url = prompt('Enter URL:');
                    if (url) {
                        const a = document.createElement('a');
                        a.href = url;
                        a.target = '_blank';
                        a.rel = 'noopener';
                        range.surroundContents(a);
                    }
                    break;
                }
                case 'color': {
                    const color = prompt('Enter color (e.g. red, #ff0000):');
                    if (color) {
                        const span = document.createElement('span');
                        span.style.color = color;
                        range.surroundContents(span);
                    }
                    break;
                }
            }
        }
        
        Editor.hideFormatToolbar();
        Editor.scheduleSave();
    },
    
    // Find if the selection is inside a formatting element
    _getFormatParent(range, format) {
        const tagMap = {
            bold: 'STRONG', italic: 'EM', underline: 'U',
            strike: 'S', code: 'CODE', highlight: 'MARK'
        };
        const tag = tagMap[format];
        if (!tag) return null;
        
        let node = range.commonAncestorContainer;
        while (node && node !== document.body) {
            if (node.nodeName === tag) return node;
            node = node.parentNode;
        }
        return null;
    },
    
    // Wrap a range in an element
    _wrapSelection(range, tagName) {
        const el = document.createElement(tagName);
        try {
            range.surroundContents(el);
        } catch (e) {
            // surroundContents fails if selection spans partial nodes
            el.appendChild(range.extractContents());
            range.insertNode(el);
        }
    },
    
    // Unwrap a formatting element
    _unwrapFormat(el) {
        const parent = el.parentNode;
        while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
    },

    // UI utilities
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        if (isMobile) {
            sidebar.classList.toggle('open');
        } else {
            this.sidebarCollapsed = !this.sidebarCollapsed;
            sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
        }
    },

    togglePageDetails() {
        const panel = document.getElementById('right-sidebar');
        const btn = document.getElementById('btn-page-details');
        const isOpen = panel.classList.toggle('open');
        btn.classList.toggle('active', isOpen);
        if (isOpen) this.updatePageDetails();
    },

    updatePageDetails() {
        const page = this.currentPage;
        if (!page) return;

        document.getElementById('detail-created').textContent = page.createdAt ? this.formatDate(page.createdAt) : '\u2014';
        document.getElementById('detail-edited').textContent = page.updatedAt ? this.formatDate(page.updatedAt) : '\u2014';

        const blocks = document.querySelectorAll('#editor-blocks .block');
        const text = document.getElementById('editor-blocks').innerText || '';
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).length : 0;

        document.getElementById('detail-words').textContent = words.toLocaleString();
        document.getElementById('detail-chars').textContent = trimmed.length.toLocaleString();
        document.getElementById('detail-blocks').textContent = blocks.length.toLocaleString();

        let parentText = '\u2014';
        if (page.parentId) {
            const parent = Storage.getPage(page.parentId);
            if (parent) parentText = parent.title || 'Untitled';
        }
        document.getElementById('detail-parent').textContent = parentText;

        // Backlinks — find pages that reference this page
        const backlinksGroup = document.getElementById('backlinks-group');
        const backlinksList = document.getElementById('backlinks-list');
        const allPages = Storage.getActivePages();
        const currentId = page.id;
        const currentTitle = (page.title || '').toLowerCase();
        const backlinks = [];

        allPages.forEach(p => {
            if (p.id === currentId) return;
            const blocks = p.content || [];
            const hasLink = blocks.some(b => {
                if (!b.content || typeof b.content !== 'string') return false;
                // Check for page ID mention or title mention in block content
                return b.content.includes(currentId) || 
                       (currentTitle && currentTitle.length > 2 && b.content.toLowerCase().includes(currentTitle));
            });
            // Also check if this page is a child
            if (hasLink || p.parentId === currentId) {
                backlinks.push(p);
            }
        });

        if (backlinks.length > 0) {
            backlinksGroup.style.display = '';
            backlinksList.innerHTML = backlinks.map(p => `
                <div class="backlink-item" data-page-id="${p.id}">
                    <span class="backlink-icon">${p.icon ? Icons.get(p.icon, 16) : Icons.get('page', 16)}</span>
                    <span class="backlink-title">${this.escapeHtml(p.title || 'Untitled')}</span>
                </div>
            `).join('');
            backlinksList.querySelectorAll('.backlink-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.loadPage(item.dataset.pageId);
                });
            });
        } else {
            backlinksGroup.style.display = 'none';
            backlinksList.innerHTML = '';
        }
    },

    formatDate(ts) {
        const d = new Date(ts);
        const now = new Date();
        const opts = { month: 'short', day: 'numeric' };
        if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric';
        let str = d.toLocaleDateString(undefined, opts);
        str += ' at ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
        return str;
    },

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode', !isDark);
        Storage.setPref('theme', isDark ? 'dark' : 'light');
    },
    
    // Trash modal
    showTrash() {
        const modal = document.getElementById('trash-modal');
        const list = document.getElementById('trash-list');
        const deletedPages = Storage.getDeletedPages();
        
        if (deletedPages.length === 0) {
            list.innerHTML = '<p class="empty-state">Trash is empty</p>';
        } else {
            list.innerHTML = deletedPages.map(p => `
                <div class="trash-item" data-id="${p.id}">
                    <span class="trash-icon">${p.icon ? Icons.get(p.icon, 20) : Icons.get('page', 20)}</span>
                    <span class="trash-name">${this.escapeHtml(p.title || 'Untitled')}</span>
                    <div class="trash-actions">
                        <button class="btn-setting" data-action="restore">Restore</button>
                        <button class="btn-setting btn-danger" data-action="delete">Delete Forever</button>
                    </div>
                </div>
            `).join('');
            
            list.querySelectorAll('.trash-item').forEach(item => {
                const id = item.dataset.id;
                item.querySelector('[data-action="restore"]').addEventListener('click', () => {
                    Storage.restorePage(id);
                    this.loadPageList();
                    this.showTrash(); // refresh
                    this.showToast('Page restored');
                });
                item.querySelector('[data-action="delete"]').addEventListener('click', () => {
                    if (confirm('Permanently delete this page?')) {
                        Storage.deletePage(id, true);
                        this.showTrash(); // refresh
                        this.showToast('Page permanently deleted');
                    }
                });
            });
        }
        
        modal.style.display = 'flex';
    },
    
    // Settings modal
    showSettings() {
        const modal = document.getElementById('settings-modal');
        const isDark = document.body.classList.contains('dark-mode');
        document.getElementById('dark-mode-toggle').checked = isDark;
        modal.style.display = 'flex';
    },

    showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },

};

// Make saveCurrentPage available globally for Editor
function saveCurrentPage() {
    App.saveCurrentPage();
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await App.init();
});
