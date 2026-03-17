<?php
// Read theme from the first workspace's settings.json to avoid flash of wrong theme
$themeClass = '';
$wsDir = __DIR__ . '/data/workspaces';
if (is_dir($wsDir)) {
    $dirs = glob("$wsDir/*", GLOB_ONLYDIR);
    if (!empty($dirs)) {
        $settingsFile = $dirs[0] . '/settings.json';
        if (file_exists($settingsFile)) {
            $settings = json_decode(file_get_contents($settingsFile), true);
            if (isset($settings['theme'])) {
                $themeClass = $settings['theme'] === 'dark' ? 'dark-mode' : ($settings['theme'] === 'light' ? 'light-mode' : '');
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notion Clone</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#191919">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235C9CE6' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/></svg>">
    <link rel="stylesheet" href="ui/style.css">
</head>
<body class="<?= htmlspecialchars($themeClass) ?>">
    <div id="app">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="workspace-switcher" id="workspace-switcher">
                    <span class="workspace-icon" id="workspace-icon"></span>
                    <span class="workspace-name">My Workspace</span>
                    <svg class="chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                </div>
            </div>
            
            <div class="sidebar-section">
                <div class="sidebar-section-header">
                    <span>Quick Actions</span>
                </div>
                <button class="sidebar-item" id="search-btn">
                    <span class="icon" id="icon-search"></span>
                    <span>Search</span>
                    <kbd>⌘K</kbd>
                </button>
                <button class="sidebar-item" id="new-page-btn">
                    <span class="icon" id="icon-plus"></span>
                    <span>New Page</span>
                </button>
            </div>
            
            <div class="sidebar-section favorites-section">
                <div class="sidebar-section-header">
                    <span>Favorites</span>
                </div>
                <div id="favorites-list" class="page-list"></div>
            </div>
            
            <div class="sidebar-section flex-1">
                <div class="sidebar-section-header">
                    <span>Pages</span>
                </div>
                <div id="page-list" class="page-list"></div>
            </div>
            
            <div class="sidebar-footer">
                <button class="sidebar-item" id="btn-trash">
                    <span class="icon" id="icon-trash"></span>
                    <span>Trash</span>
                </button>
                <button class="sidebar-item" id="btn-settings">
                    <span class="icon" id="icon-settings"></span>
                    <span>Settings</span>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main" id="main">
            <!-- Topbar -->
            <header class="topbar" id="topbar">
                <div class="topbar-left">
                    <button class="btn-icon mobile-menu-btn" id="btn-mobile-menu" title="Menu">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                    <div class="breadcrumbs" id="breadcrumbs">
                        <span class="breadcrumb-item">My Workspace</span>
                    </div>
                </div>
                <div class="topbar-actions">
                    <button class="btn-icon" id="btn-share" title="Share">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                    </button>
                    <button class="btn-icon" id="btn-favorite" title="Add to favorites">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                    </button>
                    <button class="btn-icon" id="btn-more" title="More options">
                        <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/></svg>
                    </button>
                    <button class="btn-icon" id="btn-page-details" title="Page details">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </button>
                </div>
            </header>

            <!-- Page Content -->
            <div class="page-container" id="page-container">
                <!-- Home Screen (Notion-style) -->
                <div class="home-screen" id="home-screen">
                    <div class="home-content">
                        <div class="home-greeting" id="home-greeting"></div>
                        
                        <div class="home-section" id="home-favorites-section" style="display:none;">
                            <div class="home-section-header">
                                <span class="home-section-icon" id="icon-star"></span>
                                <span>Favorites</span>
                            </div>
                            <div class="home-page-grid" id="home-favorites"></div>
                        </div>
                        
                        <div class="home-section" id="home-recent-section" style="display:none;">
                            <div class="home-section-header">
                                <span class="home-section-icon" id="icon-clock"></span>
                                <span>Recently visited</span>
                            </div>
                            <div class="home-page-grid" id="home-recent"></div>
                        </div>
                        
                        <div class="home-section" id="home-all-section" style="display:none;">
                            <div class="home-section-header">
                                <span class="home-section-icon" id="icon-page"></span>
                                <span>All pages</span>
                            </div>
                            <div class="home-page-list" id="home-all-pages"></div>
                        </div>
                        
                        <div class="home-empty" id="home-empty" style="display:none;">
                            <div class="home-empty-icon" id="icon-empty"></div>
                            <p>No pages yet</p>
                            <button class="btn-primary" id="btn-create-first">
                                <span id="icon-create-first"></span> Create a page
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Page Cover (outside editor for full-width) -->
                <div class="page-cover-container" id="page-cover-container" style="display: none;">
                    <div class="page-cover" id="page-cover">
                        <div class="cover-actions">
                            <button class="cover-btn" id="btn-toggle-cover-fit" title="Toggle between stretch and tile">Tile</button>
                            <button class="cover-btn" id="btn-change-cover">Change cover</button>
                            <button class="cover-btn" id="btn-remove-cover">Remove</button>
                        </div>
                    </div>
                </div>

                <!-- Page Editor (hidden by default) -->
                <div class="page-editor" id="page-editor" style="display: none;">
                    <div class="page-header">
                        <button class="page-icon-btn" id="page-icon" title="Click to change icon"></button>
                        <div class="page-header-actions" id="page-header-actions">
                            <button class="header-action-btn" id="btn-add-icon">
                                <span id="icon-add-icon"></span> Add icon
                            </button>
                            <button class="header-action-btn" id="btn-change-icon">
                                <span id="icon-change-icon"></span> Change icon
                            </button>
                            <button class="header-action-btn" id="btn-add-cover" >
                                <span id="icon-add-cover"></span> Add cover
                            </button>
                            <button class="header-action-btn" id="btn-add-cover-inline" style="display:none;">
                                <span id="icon-add-cover-inline"></span> Add cover
                            </button>
                        </div>
                        <h1 class="page-title" id="page-title" contenteditable="true" data-placeholder="Untitled"></h1>
                    </div>
                    <div class="editor-content" id="editor-blocks"></div>
                </div>
            </div>
        </main>

        <!-- Right Sidebar: Page Details -->
        <aside class="right-sidebar" id="right-sidebar">
            <div class="right-sidebar-header">
                <span class="right-sidebar-title">Page details</span>
                <button class="btn-icon" id="btn-close-details" title="Close">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div class="right-sidebar-content" id="right-sidebar-content">
                <div class="detail-group">
                    <div class="detail-row">
                        <span class="detail-label">Created</span>
                        <span class="detail-value" id="detail-created">—</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Last edited</span>
                        <span class="detail-value" id="detail-edited">—</span>
                    </div>
                </div>
                <div class="detail-group">
                    <div class="detail-row">
                        <span class="detail-label">Word count</span>
                        <span class="detail-value" id="detail-words">—</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Characters</span>
                        <span class="detail-value" id="detail-chars">—</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Blocks</span>
                        <span class="detail-value" id="detail-blocks">—</span>
                    </div>
                </div>
                <div class="detail-group">
                    <div class="detail-row">
                        <span class="detail-label">Parent page</span>
                        <span class="detail-value" id="detail-parent">—</span>
                    </div>
                </div>
                <div class="detail-group" id="backlinks-group" style="display:none;">
                    <div class="detail-section-title">Backlinks</div>
                    <div id="backlinks-list" class="backlinks-list"></div>
                </div>
            </div>
        </aside>
    </div>

    <!-- Emoji Picker Modal -->
    <div class="modal-overlay" id="emoji-picker-overlay" style="display: none;">
        <div class="emoji-picker" id="emoji-picker">
            <div class="emoji-picker-header">
                <input type="text" class="emoji-search" id="emoji-search" placeholder="Search icons...">
                <button class="btn-remove-icon" id="btn-remove-icon">Remove</button>
            </div>
            <div class="emoji-categories" id="emoji-categories"></div>
            <div class="emoji-grid" id="emoji-grid"></div>
        </div>
    </div>

    <!-- Cover Picker Modal -->
    <div class="modal-overlay" id="cover-picker-overlay" style="display: none;">
        <div class="cover-picker" id="cover-picker">
            <div class="cover-picker-header">
                <h3>Cover image</h3>
                <button class="close-btn" id="close-cover-picker">×</button>
            </div>
            <div class="cover-picker-tabs">
                <button class="cover-tab active" data-tab="gallery">Gallery</button>
                <button class="cover-tab" data-tab="upload">Upload</button>
                <button class="cover-tab" data-tab="link">Link</button>
                <button class="cover-tab" data-tab="gradient">Gradients</button>
            </div>
            <div class="cover-picker-content" id="cover-picker-content"></div>
        </div>
    </div>

    <!-- Command Palette Modal -->
    <div class="modal-overlay command-palette-overlay" id="command-palette" style="display: none;">
        <div class="command-palette-content">
            <input type="text" class="command-input" id="command-palette-input" placeholder="Search or type a command...">
            <div class="command-results" id="command-results"></div>
        </div>
    </div>

    <!-- Slash Command Menu -->
    <div class="slash-menu" id="slash-menu" style="display: none;">
        <div class="slash-menu-header">Basic Blocks</div>
        <div class="slash-menu-items" id="slash-menu-items"></div>
    </div>

    <!-- Format Toolbar (for text selection) -->
    <div class="format-toolbar" id="format-toolbar" style="display: none;">
        <button data-format="bold" title="Bold"><strong>B</strong></button>
        <button data-format="italic" title="Italic"><em>i</em></button>
        <button data-format="underline" title="Underline"><u>U</u></button>
        <button data-format="strike" title="Strikethrough"><s>S</s></button>
        <button data-format="code" title="Code">&lt;&gt;</button>
        <button data-format="link" title="Link" id="icon-format-link"></button>
        <div class="toolbar-divider"></div>
        <button data-format="highlight" title="Highlight" id="icon-format-highlight"></button>
        <button data-format="color" title="Text color">A</button>
    </div>

    <!-- Toast Notifications -->
    <div class="toast-container" id="toast-container"></div>

    <!-- Trash Modal -->
    <div class="modal-overlay" id="trash-modal" style="display: none;">
        <div class="settings-modal">
            <div class="settings-header">
                <h3><span id="icon-trash-header"></span> Trash</h3>
                <button class="close-btn" id="close-trash">×</button>
            </div>
            <div class="settings-body" id="trash-list"></div>
        </div>
    </div>

    <!-- Settings Modal -->
    <div class="modal-overlay" id="settings-modal" style="display: none;">
        <div class="settings-modal">
            <div class="settings-header">
                <h3><span id="icon-settings-header"></span> Settings</h3>
                <button class="close-btn" id="close-settings">×</button>
            </div>
            <div class="settings-body">
                <div class="setting-row">
                    <span class="setting-label">Dark Mode</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="dark-mode-toggle">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="setting-row">
                    <span class="setting-label">Export Data</span>
                    <button class="btn-setting" id="btn-export">Download JSON</button>
                </div>
                <div class="setting-row">
                    <span class="setting-label">Import Data</span>
                    <button class="btn-setting" id="btn-import">Upload JSON</button>
                    <input type="file" id="import-file" accept=".json" style="display:none;">
                </div>
                <div class="setting-row">
                    <span class="setting-label">Sync to Server</span>
                    <button class="btn-setting" id="btn-sync-now">Sync Now</button>
                </div>
                <div class="setting-row danger">
                    <span class="setting-label">Clear All Data</span>
                    <button class="btn-setting btn-danger" id="btn-clear-data">Clear</button>
                </div>
            </div>
        </div>
    </div>

    <script src="core/icons.js"></script>
    <script src="core/storage.js"></script>
    <script src="core/blocks.js"></script>
    <script src="core/editor.js"></script>
    <script src="core/history.js"></script>
    <script src="core/features.js"></script>
    <script src="core/app.js"></script>
    <script>
        // Register service worker for offline support
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service worker registered'))
                .catch(err => console.log('SW registration failed:', err));
        }
    </script>
</body>
</html>
