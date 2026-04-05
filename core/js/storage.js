/**
 * Storage Module - Workspace-Scoped Server Storage
 * All data lives on the server as flat files under data/workspaces/{id}/.
 * Pages in pages/*.json, images in images/, settings in settings.json.
 * No localStorage usage.
 */

const Storage = {
    _pages: [],
    _settings: {},
    _workspaceId: null,
    _loaded: false,
    _settingsTimer: null,

    // Bootstrap: find or create workspace, then load data
    async init() {
        // 1. Get available workspaces
        let workspaces = [];
        try {
            const res = await fetch('core/php/api.php?action=workspaces');
            if (res.ok) workspaces = await res.json();
        } catch (e) {
            console.warn('Could not list workspaces:', e);
        }

        if (workspaces.length > 0) {
            // Use first workspace
            this._workspaceId = workspaces[0].id;
        } else {
            // Create default workspace
            await this.createWorkspace({
                name: 'My Workspace',
                icon: 'page'
            });
        }

        // 2. Load settings + pages in parallel
        await Promise.all([
            this.loadSettings(),
            this.loadFromServer()
        ]);

        this._loaded = true;
        return this;
    },

    // Create a new workspace on the server
    async createWorkspace(opts = {}) {
        const id = this.generateId();
        try {
            const res = await fetch('core/php/api.php?action=workspaces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    name: opts.name || 'My Workspace',
                    icon: opts.icon || 'page',
                    createdAt: Date.now()
                })
            });
            if (res.ok) {
                this._workspaceId = id;
                return await res.json();
            }
        } catch (e) {
            console.warn('Could not create workspace:', e);
        }
        // Fallback — set ID so the app can still function
        this._workspaceId = id;
        return { id, name: opts.name, icon: opts.icon };
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
    },

    // ---- Settings (stored in data/workspaces/{ws}/settings.json) ----

    getPref(key) {
        return this._settings[key] ?? null;
    },

    setPref(key, value) {
        this._settings[key] = value;
        this.saveSettings();
    },

    async loadSettings() {
        try {
            const res = await fetch(`core/php/api.php?action=settings&workspace=${encodeURIComponent(this._workspaceId)}`);
            if (res.ok) {
                this._settings = await res.json();
            }
        } catch (e) {
            console.warn('Could not load settings:', e);
            this._settings = {};
        }
    },

    saveSettings() {
        clearTimeout(this._settingsTimer);
        this._settingsTimer = setTimeout(() => {
            const url = `core/php/api.php?action=settings&workspace=${encodeURIComponent(this._workspaceId)}`;
            const body = JSON.stringify(this._settings);
            if (document.visibilityState === 'hidden' && navigator.sendBeacon) {
                navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
            } else {
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body
                }).catch(() => {});
            }
        }, 300);
    },

    // Workspace accessors (read from settings)
    getWorkspace() {
        if (!this._workspaceId) return null;
        return {
            id: this._workspaceId,
            name: this._settings.name || 'My Workspace',
            icon: this._settings.icon || 'page'
        };
    },

    setWorkspace(data) {
        if (data.name) this._settings.name = data.name;
        if (data.icon) this._settings.icon = data.icon;
        this.saveSettings();
    },

    // ---- Page operations ----

    getPages() {
        return this._pages;
    },

    getPage(id) {
        return this._pages.find(p => p.id === id) || null;
    },

    createPage(data = {}) {
        if (typeof data === 'string') {
            data = { title: data };
        }
        const page = {
            id: this.generateId(),
            title: data.title || '',
            icon: data.icon || null,
            content: data.content || [],
            parentId: data.parentId || null,
            isFavorite: false,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this._pages.push(page);
        this.syncToServer(page);
        return page;
    },

    updatePage(id, data) {
        const index = this._pages.findIndex(p => p.id === id);
        if (index !== -1) {
            this._pages[index] = {
                ...this._pages[index],
                ...data,
                updatedAt: Date.now()
            };
            this.syncToServer(this._pages[index]);
            return this._pages[index];
        }
        return null;
    },

    deletePage(id, permanent = false) {
        if (permanent) {
            this._pages = this._pages.filter(p => p.id !== id);
            this.deleteFromServer(id);
        } else {
            const index = this._pages.findIndex(p => p.id === id);
            if (index !== -1) {
                this._pages[index].isDeleted = true;
                this._pages[index].deletedAt = Date.now();
                this.syncToServer(this._pages[index]);
            }
        }
    },

    restorePage(id) {
        const index = this._pages.findIndex(p => p.id === id);
        if (index !== -1) {
            this._pages[index].isDeleted = false;
            this._pages[index].deletedAt = null;
            this.syncToServer(this._pages[index]);
        }
    },

    getActivePages() {
        return this._pages.filter(p => !p.isDeleted);
    },

    getFavoritePages() {
        return this._pages.filter(p => p.isFavorite && !p.isDeleted);
    },

    getDeletedPages() {
        return this._pages.filter(p => p.isDeleted);
    },

    toggleFavorite(id) {
        const index = this._pages.findIndex(p => p.id === id);
        if (index !== -1) {
            this._pages[index].isFavorite = !this._pages[index].isFavorite;
            this.syncToServer(this._pages[index]);
            return this._pages[index].isFavorite;
        }
        return false;
    },

    // ---- Image upload ----

    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(`core/php/api.php?action=images&workspace=${encodeURIComponent(this._workspaceId)}`, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) {
            throw new Error('Image upload failed');
        }
        const data = await res.json();
        return data.url;
    },

    // ---- Server operations ----

    async syncToServer(page) {
        const url = `core/php/api.php?action=pages&workspace=${encodeURIComponent(this._workspaceId)}`;
        const body = JSON.stringify(page);

        // Use sendBeacon during page teardown (refresh, tab close)
        if (document.visibilityState === 'hidden' && navigator.sendBeacon) {
            navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
            return true;
        }

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    },

    async deleteFromServer(id) {
        try {
            const res = await fetch(`core/php/api.php?action=pages&workspace=${encodeURIComponent(this._workspaceId)}&id=${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });
            return res.ok;
        } catch (e) {
            console.debug('Delete skipped:', e.message);
            return false;
        }
    },

    async loadFromServer() {
        try {
            const res = await fetch(`core/php/api.php?action=pages&workspace=${encodeURIComponent(this._workspaceId)}`);
            if (res.ok) {
                const data = await res.json();
                this._pages = Array.isArray(data) ? data : (data.pages || []);
                return true;
            }
        } catch (e) {
            console.warn('Could not load from server, starting empty:', e);
        }
        this._pages = [];
        return false;
    },

    // Export all data as JSON
    exportData() {
        return {
            workspace: this.getWorkspace(),
            pages: this._pages,
            settings: { ...this._settings },
            exportedAt: Date.now()
        };
    },

    // Import data from JSON
    async importData(data) {
        if (data.workspace) {
            this.setWorkspace(data.workspace);
        }
        if (data.settings) {
            this._settings = { ...this._settings, ...data.settings };
            this.saveSettings();
        }
        // Legacy support: import preferences as settings
        if (data.preferences) {
            this._settings = { ...this._settings, ...data.preferences };
            this.saveSettings();
        }
        if (data.pages) {
            this._pages = data.pages;
            for (const page of data.pages) {
                await this.syncToServer(page);
            }
        }
        return true;
    },

    // Clear all data
    async clearAll() {
        const pageIds = this._pages.map(p => p.id);
        for (const id of pageIds) {
            await this.deleteFromServer(id);
        }
        this._pages = [];
        this._settings = {};
        this.saveSettings();
    }
};
