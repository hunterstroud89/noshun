/**
 * Block Types and Utilities
 * Defines all block types and their behaviors
 */

const BlockTypes = {
    // Text blocks
    paragraph: {
        id: 'paragraph',
        name: 'Text',
        icon: 'T',
        emoji: 'note',
        description: 'Just start writing with plain text.',
        shortcut: '/text',
        dataType: 'p'
    },
    heading1: {
        id: 'heading1',
        name: 'Heading 1',
        icon: 'H1',
        emoji: 'heading1',
        description: 'Big section heading.',
        shortcut: '/h1',
        dataType: 'h1'
    },
    heading2: {
        id: 'heading2',
        name: 'Heading 2',
        icon: 'H2',
        emoji: 'heading2',
        description: 'Medium section heading.',
        shortcut: '/h2',
        dataType: 'h2'
    },
    heading3: {
        id: 'heading3',
        name: 'Heading 3',
        icon: 'H3',
        emoji: 'heading3',
        description: 'Small section heading.',
        shortcut: '/h3',
        dataType: 'h3'
    },
    
    // List blocks
    bulletList: {
        id: 'bulletList',
        name: 'Bulleted List',
        icon: '•',
        emoji: 'bullet',
        description: 'Create a simple bulleted list.',
        shortcut: '/bullet',
        dataType: 'bullet'
    },
    numberedList: {
        id: 'numberedList',
        name: 'Numbered List',
        icon: '1.',
        emoji: 'numbered',
        description: 'Create a numbered list.',
        shortcut: '/numbered',
        dataType: 'numbered'
    },
    todo: {
        id: 'todo',
        name: 'To-do List',
        icon: '☐',
        emoji: 'check',
        description: 'Track tasks with a to-do list.',
        shortcut: '/todo',
        dataType: 'todo'
    },
    toggle: {
        id: 'toggle',
        name: 'Toggle List',
        icon: '▶',
        emoji: 'play',
        description: 'Toggles can hide and show content.',
        shortcut: '/toggle',
        dataType: 'toggle'
    },
    
    // Content blocks
    quote: {
        id: 'quote',
        name: 'Quote',
        icon: '"',
        emoji: 'chat',
        description: 'Capture a quote.',
        shortcut: '/quote',
        dataType: 'quote'
    },
    divider: {
        id: 'divider',
        name: 'Divider',
        icon: '—',
        emoji: 'pause',
        description: 'Visually divide blocks.',
        shortcut: '/divider',
        dataType: 'divider'
    },
    code: {
        id: 'code',
        name: 'Code',
        icon: '</>',
        emoji: 'code',
        description: 'Capture a code snippet.',
        shortcut: '/code',
        dataType: 'code'
    },
    callout: {
        id: 'callout',
        name: 'Callout',
        icon: 'lightbulb',
        emoji: 'lightbulb',
        description: 'Make writing stand out.',
        shortcut: '/callout',
        dataType: 'callout'
    },
    
    // Media blocks
    image: {
        id: 'image',
        name: 'Image',
        icon: 'img',
        emoji: 'image',
        description: 'Upload or embed an image.',
        shortcut: '/image',
        dataType: 'image'
    },
    table: {
        id: 'table',
        name: 'Table',
        icon: 'tbl',
        emoji: 'table',
        description: 'Add a simple table.',
        shortcut: '/table',
        dataType: 'table'
    },
    database: {
        id: 'database',
        name: 'Database',
        icon: 'db',
        emoji: 'table',
        description: 'Table with typed columns, sorting & filtering.',
        shortcut: '/database',
        dataType: 'database'
    },
    syncedBlock: {
        id: 'syncedBlock',
        name: 'Synced Block',
        icon: '⟳',
        emoji: 'check',
        description: 'Reusable block synced across pages.',
        shortcut: '/synced',
        dataType: 'synced'
    }
};

// Get all block types as array for menu
const getBlockTypesList = () => Object.values(BlockTypes);

// Create a new block element
function createBlockElement(type = 'paragraph', content = '', options = {}) {
    const blockType = BlockTypes[type] || BlockTypes.paragraph;
    const block = document.createElement('div');
    block.className = 'block';
    block.setAttribute('data-type', blockType.dataType);
    block.setAttribute('data-id', generateBlockId());
    
    // Add block menu
    const blockMenu = document.createElement('div');
    blockMenu.className = 'block-menu';
    blockMenu.innerHTML = `
        <button class="block-menu-btn" data-action="add" title="Add block below">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0.5a0.75 0.75 0 0 1 0.75 0.75v5h5a0.75 0.75 0 0 1 0 1.5h-5v5a0.75 0.75 0 0 1-1.5 0v-5h-5a0.75 0.75 0 0 1 0-1.5h5v-5A0.75 0.75 0 0 1 7 0.5z"/></svg>
        </button>
        <button class="block-menu-btn" data-action="drag" title="Click for menu, drag to move">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M4.5 2.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm-5 4a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm-5 4a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/></svg>
        </button>
    `;
    block.appendChild(blockMenu);
    
    // Add button - insert new block below
    const addBtn = blockMenu.querySelector('[data-action="add"]');
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newBlock = createBlockElement('paragraph');
        block.parentNode.insertBefore(newBlock, block.nextSibling);
        newBlock.querySelector('.block-content')?.focus();
        if (typeof saveCurrentPage === 'function') saveCurrentPage();
    });
    
    // Drag handle click opens context menu
    const dragBtn = blockMenu.querySelector('[data-action="drag"]');
    dragBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showBlockContextMenu(block, dragBtn);
    });
    
    // Add block handle for drag and drop
    const handle = blockMenu.querySelector('[data-action="drag"]');
    if (handle) {
        handle.setAttribute('draggable', 'true');
        handle.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', block.getAttribute('data-id'));
            e.dataTransfer.effectAllowed = 'move';
            
            // Create a faint drag ghost — no background fill
            const ghost = block.cloneNode(true);
            ghost.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:' + block.offsetWidth + 'px;opacity:0.35;pointer-events:none;';
            ghost.querySelector('.block-menu')?.remove();
            document.body.appendChild(ghost);
            e.dataTransfer.setDragImage(ghost, 20, 20);
            requestAnimationFrame(() => ghost.remove());
            
            // Hide the block after the browser captures the drag image
            requestAnimationFrame(() => {
                block.classList.add('dragging');
            });
            if (typeof Editor !== 'undefined') Editor.draggedBlock = block;
        });
    }
    
    // Create content based on block type
    switch (blockType.dataType) {
        case 'todo':
            const checkbox = document.createElement('div');
            checkbox.className = 'todo-checkbox';
            checkbox.onclick = (e) => {
                e.stopPropagation();
                block.classList.toggle('checked');
                if (typeof saveCurrentPage === 'function') saveCurrentPage();
            };
            block.appendChild(checkbox);
            break;
            
        case 'toggle':
            const toggleIcon = document.createElement('div');
            toggleIcon.className = 'toggle-icon';
            toggleIcon.innerHTML = '▶';
            toggleIcon.onclick = (e) => {
                e.stopPropagation();
                block.classList.toggle('open');
            };
            block.appendChild(toggleIcon);
            break;
            
        case 'divider':
            const dividerEl = document.createElement('div');
            dividerEl.className = 'block-content';
            dividerEl.setAttribute('data-type', 'divider');
            block.appendChild(dividerEl);
            return block;
            
        case 'image':
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'block-content image-block';
            imgWrapper.setAttribute('data-type', 'image');
            
            if ((content && content.startsWith('<img')) || (content && (content.startsWith('http') || content.startsWith('data:')))) {
                // Already has an image src
                const src = content.startsWith('<img') ? content.match(/src="([^"]+)"/)?.[1] || content : content;
                imgWrapper.innerHTML = `
                    <div class="image-container">
                        <img src="${src}" alt="Image" />
                        <div class="image-resize-handle left"></div>
                        <div class="image-resize-handle right"></div>
                        <div class="image-actions">
                            <button class="image-action-btn" data-action="align-left" title="Align left">⫷</button>
                            <button class="image-action-btn" data-action="align-center" title="Center">⫿</button>
                            <button class="image-action-btn" data-action="align-full" title="Full width">⟷</button>
                            <button class="image-action-btn" data-action="replace">Replace</button>
                            <button class="image-action-btn" data-action="caption">Caption</button>
                            <button class="image-action-btn" data-action="remove">Remove</button>
                        </div>
                    </div>
                `;
                // Restore saved width/alignment
                if (options.width) {
                    imgWrapper.querySelector('.image-container').style.width = options.width;
                }
                if (options.align) {
                    imgWrapper.querySelector('.image-container').dataset.align = options.align;
                }
                setupImageActions(imgWrapper, block);
                setupImageResize(imgWrapper, block);
            } else {
                // Empty image — show upload UI
                imgWrapper.innerHTML = `
                    <div class="image-placeholder">
                        <span class="image-placeholder-icon">${Icons.get('image', 48)}</span>
                        <span>Add an image</span>
                        <div class="image-upload-options">
                            <button class="btn-image-upload" data-action="upload">Upload</button>
                            <button class="btn-image-upload" data-action="url">Embed link</button>
                        </div>
                        <input type="file" class="image-file-input" accept="image/*" style="display:none;">
                        <input type="url" class="image-url-input" placeholder="Paste image URL..." style="display:none;">
                    </div>
                `;
                setupImageUploadUI(imgWrapper, block);
            }
            
            block.appendChild(imgWrapper);
            return block;
            
        case 'table':
            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'block-content table-block';
            tableWrapper.setAttribute('data-type', 'table');
            
            // Parse existing table data or create default 3x3
            let tableData;
            try {
                tableData = content ? JSON.parse(content) : null;
            } catch (e) {
                tableData = null;
            }
            if (!tableData) {
                tableData = {
                    rows: [
                        ['', '', ''],
                        ['', '', ''],
                        ['', '', '']
                    ],
                    header: true
                };
            }
            
            buildTable(tableWrapper, tableData, block);
            block.appendChild(tableWrapper);
            return block;
            
        case 'database':
            const dbWrapper = document.createElement('div');
            dbWrapper.className = 'block-content database-block';
            dbWrapper.setAttribute('data-type', 'database');
            
            let dbData;
            try {
                dbData = content ? JSON.parse(content) : null;
            } catch (e) {
                dbData = null;
            }
            if (!dbData) {
                dbData = {
                    columns: [
                        { name: 'Name', type: 'text' },
                        { name: 'Tags', type: 'select', options: [] },
                        { name: 'Status', type: 'checkbox' }
                    ],
                    rows: [
                        { cells: ['', '', false] },
                        { cells: ['', '', false] }
                    ],
                    sort: null,
                    filter: null
                };
            }
            
            buildDatabase(dbWrapper, dbData, block);
            block.appendChild(dbWrapper);
            return block;
            
        case 'synced':
            const syncWrapper = document.createElement('div');
            syncWrapper.className = 'block-content synced-block';
            syncWrapper.setAttribute('data-type', 'synced');
            
            // content is the synced block ID
            const syncId = content || null;
            
            if (syncId) {
                syncWrapper.dataset.syncId = syncId;
                // Load content from synced blocks store
                const syncData = getSyncedBlockData(syncId);
                if (syncData) {
                    const innerContent = document.createElement('div');
                    innerContent.className = 'synced-inner';
                    innerContent.contentEditable = 'true';
                    innerContent.innerHTML = syncData.content || '';
                    innerContent.addEventListener('input', () => {
                        updateSyncedBlock(syncId, innerContent.innerHTML);
                        if (typeof saveCurrentPage === 'function') saveCurrentPage();
                    });
                    syncWrapper.appendChild(innerContent);
                } else {
                    syncWrapper.innerHTML = '<div class="synced-missing">Synced block not found</div>';
                }
            } else {
                // New synced block — create ID and editable area
                const newSyncId = 'sync_' + generateBlockId();
                syncWrapper.dataset.syncId = newSyncId;
                const innerContent = document.createElement('div');
                innerContent.className = 'synced-inner';
                innerContent.contentEditable = 'true';
                innerContent.setAttribute('data-placeholder', 'Type synced content...');
                innerContent.addEventListener('input', () => {
                    updateSyncedBlock(newSyncId, innerContent.innerHTML);
                    if (typeof saveCurrentPage === 'function') saveCurrentPage();
                });
                syncWrapper.appendChild(innerContent);
                // Initialize in storage
                updateSyncedBlock(newSyncId, '');
            }
            
            // Add sync indicator
            const syncBadge = document.createElement('div');
            syncBadge.className = 'synced-badge';
            syncBadge.textContent = '⟳ Synced';
            syncBadge.title = 'This block is synced across pages. Copy the block ID to embed elsewhere.';
            syncBadge.addEventListener('click', (e) => {
                e.stopPropagation();
                const sid = syncWrapper.dataset.syncId;
                navigator.clipboard?.writeText(sid).then(() => {
                    if (typeof App !== 'undefined') App.showToast('Synced block ID copied');
                });
            });
            syncWrapper.appendChild(syncBadge);
            
            block.appendChild(syncWrapper);
            return block;
    }
    
    // Create editable content area
    const contentEl = document.createElement('div');
    contentEl.className = 'block-content';
    contentEl.setAttribute('contenteditable', 'true');
    contentEl.setAttribute('data-type', blockType.dataType);
    contentEl.setAttribute('data-placeholder', getPlaceholder(blockType.dataType));
    contentEl.innerHTML = content;
    
    block.appendChild(contentEl);
    
    // Add toggle children container
    if (blockType.dataType === 'toggle') {
        const children = document.createElement('div');
        children.className = 'toggle-children';
        block.appendChild(children);
    }
    
    return block;
}

// Block context menu (triggered by clicking drag handle)
function showBlockContextMenu(block, anchor) {
    // Remove any existing context menu
    document.querySelectorAll('.block-context-menu').forEach(m => m.remove());
    
    const menu = document.createElement('div');
    menu.className = 'block-context-menu';
    menu.innerHTML = `
        <button class="bcm-item" data-action="delete"><span class="bcm-icon">&#x2715;</span> Delete</button>
        <button class="bcm-item" data-action="duplicate"><span class="bcm-icon">&#x2398;</span> Duplicate</button>
        <div class="bcm-divider"></div>
        <button class="bcm-item" data-action="turn-text"><span class="bcm-icon">T</span> Text</button>
        <button class="bcm-item" data-action="turn-h1"><span class="bcm-icon">H1</span> Heading 1</button>
        <button class="bcm-item" data-action="turn-h2"><span class="bcm-icon">H2</span> Heading 2</button>
        <button class="bcm-item" data-action="turn-bullet"><span class="bcm-icon">&bull;</span> Bulleted list</button>
        <button class="bcm-item" data-action="turn-todo"><span class="bcm-icon">&#x2610;</span> To-do</button>
    `;
    
    // Position relative to anchor
    const rect = anchor.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.left = rect.left + 'px';
    menu.style.top = rect.bottom + 4 + 'px';
    document.body.appendChild(menu);
    
    // Keep menu in viewport
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.bottom > window.innerHeight) {
        menu.style.top = (rect.top - menuRect.height - 4) + 'px';
    }
    if (menuRect.right > window.innerWidth) {
        menu.style.left = (window.innerWidth - menuRect.width - 8) + 'px';
    }
    
    menu.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.bcm-item');
        if (!btn) return;
        const action = btn.dataset.action;
        
        if (action === 'delete') {
            block.remove();
            if (typeof Editor !== 'undefined') Editor.ensureTrailingBlock();
            if (typeof saveCurrentPage === 'function') saveCurrentPage();
        } else if (action === 'duplicate') {
            const clone = block.cloneNode(true);
            clone.setAttribute('data-id', generateBlockId());
            block.parentNode.insertBefore(clone, block.nextSibling);
            if (typeof saveCurrentPage === 'function') saveCurrentPage();
        } else if (action.startsWith('turn-')) {
            const typeMap = { 'turn-text': 'paragraph', 'turn-h1': 'heading1', 'turn-h2': 'heading2', 'turn-bullet': 'bulletList', 'turn-todo': 'todo' };
            const newType = typeMap[action];
            if (newType) convertBlockType(block, newType);
        }
        menu.remove();
    });
    
    // Close on outside click
    const close = (ev) => {
        if (!menu.contains(ev.target)) {
            menu.remove();
            document.removeEventListener('mousedown', close);
        }
    };
    setTimeout(() => document.addEventListener('mousedown', close), 0);
}

// Get placeholder text for block type
function getPlaceholder(type) {
    const placeholders = {
        'p': "Type '/' for commands...",
        'h1': 'Heading 1',
        'h2': 'Heading 2',
        'h3': 'Heading 3',
        'bullet': 'List item',
        'numbered': 'List item',
        'todo': 'To-do',
        'toggle': 'Toggle',
        'quote': 'Quote',
        'code': 'Code',
        'callout': 'Callout'
    };
    return placeholders[type] || '';
}

// Generate unique block ID
function generateBlockId() {
    return 'blk_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Convert block to different type
function convertBlockType(blockEl, newType) {
    const blockType = BlockTypes[newType];
    if (!blockType) return;
    
    const content = blockEl.querySelector('.block-content')?.innerHTML || '';
    const newBlock = createBlockElement(newType, content);
    
    blockEl.parentNode.replaceChild(newBlock, blockEl);
    
    // Focus the new block
    const newContent = newBlock.querySelector('.block-content');
    if (newContent) {
        newContent.focus();
        // Move cursor to end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(newContent);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    
    return newBlock;
}

// Serialize blocks to JSON for storage
function serializeBlocks(containerEl) {
    const blocks = containerEl.querySelectorAll('.block');
    return Array.from(blocks).map(block => {
        const type = block.getAttribute('data-type');
        let content = '';
        let imageWidth = '';
        let imageAlign = '';
        
        if (type === 'image') {
            // Store the img src directly
            const img = block.querySelector('img');
            content = img ? img.src : '';
            const container = block.querySelector('.image-container');
            if (container) {
                if (container.style.width) imageWidth = container.style.width;
                if (container.dataset.align) imageAlign = container.dataset.align;
            }
        } else if (type === 'table') {
            // Store table data as JSON
            const tableEl = block.querySelector('table');
            content = tableEl ? JSON.stringify(getTableData(tableEl)) : '';
        } else if (type === 'database') {
            const dbWrapper = block.querySelector('.database-block');
            content = dbWrapper?._dbData ? JSON.stringify(dbWrapper._dbData) : '';
        } else if (type === 'synced') {
            const syncWrapper = block.querySelector('.synced-block');
            content = syncWrapper?.dataset.syncId || '';
        } else {
            content = block.querySelector('.block-content')?.innerHTML || '';
        }
        
        const result = {
            id: block.getAttribute('data-id'),
            type,
            content,
            checked: block.classList.contains('checked'),
            open: block.classList.contains('open'),
            indent: parseInt(block.dataset.indent || '0', 10) || 0
        };
        if (imageWidth) result.width = imageWidth;
        if (imageAlign) result.align = imageAlign;
        return result;
    });
}

// Deserialize blocks from JSON
function deserializeBlocks(blocksData) {
    const fragment = document.createDocumentFragment();
    
    blocksData.forEach(blockData => {
        const typeKey = Object.keys(BlockTypes).find(k => BlockTypes[k].dataType === blockData.type);
        const opts = {};
        if (blockData.width) opts.width = blockData.width;
        if (blockData.align) opts.align = blockData.align;
        const block = createBlockElement(typeKey || 'paragraph', blockData.content, opts);
        
        if (blockData.checked) block.classList.add('checked');
        if (blockData.open) block.classList.add('open');
        if (blockData.indent) {
            block.dataset.indent = blockData.indent;
            block.style.marginLeft = (blockData.indent * INDENT_PX) + 'px';
        }
        
        fragment.appendChild(block);
    });
    
    return fragment;
}

// Number the numbered list items
function updateNumberedLists(containerEl) {
    let number = 0;
    containerEl.querySelectorAll('.block').forEach(block => {
        if (block.getAttribute('data-type') === 'numbered') {
            number++;
            block.setAttribute('data-number', number);
        } else {
            number = 0;
        }
    });
}

// Max image file size: 5MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Shared indent config
const INDENT_PX = 24;

// Image block — upload UI setup
function setupImageUploadUI(wrapper, block) {
    const uploadBtn = wrapper.querySelector('[data-action="upload"]');
    const urlBtn = wrapper.querySelector('[data-action="url"]');
    const fileInput = wrapper.querySelector('.image-file-input');
    const urlInput = wrapper.querySelector('.image-url-input');
    
    uploadBtn?.addEventListener('click', () => fileInput.click());
    
    urlBtn?.addEventListener('click', () => {
        urlInput.style.display = 'block';
        urlInput.focus();
    });
    
    fileInput?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > MAX_IMAGE_SIZE) {
            alert('Image must be under 5MB');
            return;
        }
        try {
            const url = await Storage.uploadImage(file);
            setImageContent(wrapper, block, url);
        } catch (err) {
            alert('Failed to upload image');
        }
    });
    
    urlInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const url = urlInput.value.trim();
            if (url) setImageContent(wrapper, block, url);
        }
    });
}

// Replace placeholder with rendered image
function setImageContent(wrapper, block, src) {
    wrapper.innerHTML = `
        <div class="image-container">
            <img src="${src}" alt="Image" />
            <div class="image-resize-handle left"></div>
            <div class="image-resize-handle right"></div>
            <div class="image-actions">
                <button class="image-action-btn" data-action="align-left" title="Align left">⫷</button>
                <button class="image-action-btn" data-action="align-center" title="Center">⫿</button>
                <button class="image-action-btn" data-action="align-full" title="Full width">⟷</button>
                <button class="image-action-btn" data-action="replace">Replace</button>
                <button class="image-action-btn" data-action="caption">Caption</button>
                <button class="image-action-btn" data-action="remove">Remove</button>
            </div>
        </div>
    `;
    setupImageActions(wrapper, block);
    setupImageResize(wrapper, block);
    if (typeof saveCurrentPage === 'function') saveCurrentPage();
}

// Image actions (replace, caption, remove, alignment)
function setupImageActions(wrapper, block) {
    wrapper.querySelectorAll('.image-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            const container = wrapper.querySelector('.image-container');
            if (action === 'remove') {
                // Convert back to empty paragraph
                const newBlock = createBlockElement('paragraph');
                block.parentNode.replaceChild(newBlock, block);
                newBlock.querySelector('.block-content')?.focus();
                if (typeof saveCurrentPage === 'function') saveCurrentPage();
            } else if (action === 'replace') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.addEventListener('change', async (ev) => {
                    const file = ev.target.files[0];
                    if (!file) return;
                    if (file.size > MAX_IMAGE_SIZE) {
                        alert('Image must be under 5MB');
                        return;
                    }
                    try {
                        const url = await Storage.uploadImage(file);
                        wrapper.querySelector('img').src = url;
                        if (typeof saveCurrentPage === 'function') saveCurrentPage();
                    } catch (err) {
                        alert('Failed to upload image');
                    }
                });
                input.click();
            } else if (action === 'caption') {
                let caption = wrapper.querySelector('.image-caption');
                if (!caption) {
                    caption = document.createElement('div');
                    caption.className = 'image-caption';
                    caption.contentEditable = 'true';
                    caption.setAttribute('data-placeholder', 'Add a caption...');
                    container.appendChild(caption);
                }
                caption.focus();
            } else if (action === 'align-left') {
                container.dataset.align = 'left';
                container.style.width = container.style.width || '50%';
                if (typeof saveCurrentPage === 'function') saveCurrentPage();
            } else if (action === 'align-center') {
                container.dataset.align = 'center';
                if (typeof saveCurrentPage === 'function') saveCurrentPage();
            } else if (action === 'align-full') {
                container.dataset.align = '';
                container.style.width = '100%';
                if (typeof saveCurrentPage === 'function') saveCurrentPage();
            }
        });
    });
}

// Image resize handles
function setupImageResize(wrapper, block) {
    const container = wrapper.querySelector('.image-container');
    if (!container) return;
    
    const handles = container.querySelectorAll('.image-resize-handle');
    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isLeft = handle.classList.contains('left');
            const startX = e.clientX;
            const startWidth = container.offsetWidth;
            const parentWidth = container.parentElement.offsetWidth;
            
            container.classList.add('resizing');
            
            const onMouseMove = (ev) => {
                const dx = ev.clientX - startX;
                const delta = isLeft ? -dx : dx;
                let newWidth = startWidth + delta;
                // Clamp between 100px and parent width
                newWidth = Math.max(100, Math.min(newWidth, parentWidth));
                const pct = Math.round((newWidth / parentWidth) * 100);
                container.style.width = pct + '%';
            };
            
            const onMouseUp = () => {
                container.classList.remove('resizing');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if (typeof saveCurrentPage === 'function') saveCurrentPage();
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}

// ======= Table Block =======

function buildTable(wrapper, tableData, block) {
    wrapper.innerHTML = '';
    
    const table = document.createElement('table');
    table.className = 'notion-table';
    
    tableData.rows.forEach((row, ri) => {
        const tr = document.createElement('tr');
        row.forEach((cell, ci) => {
            const td = document.createElement(ri === 0 && tableData.header ? 'th' : 'td');
            td.contentEditable = 'true';
            td.textContent = cell;
            td.addEventListener('input', () => {
                if (typeof saveCurrentPage === 'function') saveCurrentPage();
            });
            // Tab between cells
            td.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const cells = Array.from(table.querySelectorAll('th, td'));
                    const idx = cells.indexOf(td);
                    const next = e.shiftKey ? cells[idx - 1] : cells[idx + 1];
                    if (next) next.focus();
                }
                // Enter inside cell shouldn't create new block
                if (e.key === 'Enter') {
                    e.stopPropagation();
                }
            });
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    
    wrapper.appendChild(table);
    
    // Table controls
    const controls = document.createElement('div');
    controls.className = 'table-controls';
    controls.innerHTML = `
        <button class="table-ctrl-btn" data-action="add-row" title="Add row">+ Row</button>
        <button class="table-ctrl-btn" data-action="add-col" title="Add column">+ Col</button>
        <button class="table-ctrl-btn" data-action="del-row" title="Delete row">− Row</button>
        <button class="table-ctrl-btn" data-action="del-col" title="Delete column">− Col</button>
    `;
    controls.addEventListener('click', (e) => {
        const btn = e.target.closest('.table-ctrl-btn');
        if (!btn) return;
        const data = getTableData(table);
        const action = btn.dataset.action;
        
        if (action === 'add-row') {
            data.rows.push(new Array(data.rows[0]?.length || 3).fill(''));
        } else if (action === 'add-col') {
            data.rows.forEach(r => r.push(''));
        } else if (action === 'del-row' && data.rows.length > 1) {
            data.rows.pop();
        } else if (action === 'del-col' && (data.rows[0]?.length || 0) > 1) {
            data.rows.forEach(r => r.pop());
        }
        
        buildTable(wrapper, data, block);
        if (typeof saveCurrentPage === 'function') saveCurrentPage();
    });
    wrapper.appendChild(controls);
}

function getTableData(tableEl) {
    const rows = [];
    let header = false;
    tableEl.querySelectorAll('tr').forEach((tr, ri) => {
        const cells = [];
        tr.querySelectorAll('th, td').forEach(td => {
            cells.push(td.textContent);
            if (td.tagName === 'TH') header = true;
        });
        rows.push(cells);
    });
    return { rows, header };
}

// ======= Database Block =======

const DB_COLUMN_TYPES = ['text', 'number', 'select', 'date', 'checkbox'];

function buildDatabase(wrapper, dbData, block) {
    wrapper.innerHTML = '';
    wrapper._dbData = dbData;
    
    const save = () => {
        wrapper._dbData = dbData;
        if (typeof saveCurrentPage === 'function') saveCurrentPage();
    };
    
    // Apply sort for display
    let displayRows = dbData.rows.map((r, i) => ({ ...r, _origIdx: i }));
    if (dbData.sort && dbData.sort.col !== null) {
        const ci = dbData.sort.col;
        const dir = dbData.sort.dir === 'desc' ? -1 : 1;
        const colType = dbData.columns[ci]?.type || 'text';
        displayRows.sort((a, b) => {
            let va = a.cells[ci] ?? '', vb = b.cells[ci] ?? '';
            if (colType === 'number') return (parseFloat(va) - parseFloat(vb)) * dir;
            if (colType === 'checkbox') return ((va ? 1 : 0) - (vb ? 1 : 0)) * dir;
            return String(va).localeCompare(String(vb)) * dir;
        });
    }
    
    // Apply filter for display
    if (dbData.filter && dbData.filter.col !== null && dbData.filter.value) {
        const ci = dbData.filter.col;
        const fv = dbData.filter.value.toLowerCase();
        const colType = dbData.columns[ci]?.type || 'text';
        displayRows = displayRows.filter(r => {
            const val = r.cells[ci];
            if (colType === 'checkbox') return String(!!val) === fv;
            return String(val ?? '').toLowerCase().includes(fv);
        });
    }
    
    // Toolbar (sort & filter)
    const toolbar = document.createElement('div');
    toolbar.className = 'db-toolbar';
    toolbar.innerHTML = `
        <button class="db-toolbar-btn" data-action="sort">Sort</button>
        <button class="db-toolbar-btn" data-action="filter">Filter</button>
    `;
    wrapper.appendChild(toolbar);
    
    // Sort/filter popovers
    toolbar.addEventListener('click', (e) => {
        const btn = e.target.closest('.db-toolbar-btn');
        if (!btn) return;
        e.stopPropagation();
        // Remove any existing popover
        wrapper.querySelectorAll('.db-popover').forEach(p => p.remove());
        
        const action = btn.dataset.action;
        const pop = document.createElement('div');
        pop.className = 'db-popover';
        
        const colOpts = dbData.columns.map((c, i) => `<option value="${i}" ${(action === 'sort' ? dbData.sort?.col : dbData.filter?.col) === i ? 'selected' : ''}>${c.name}</option>`).join('');
        
        if (action === 'sort') {
            pop.innerHTML = `
                <label>Column</label>
                <select class="db-pop-select" data-field="col">${colOpts}</select>
                <label>Direction</label>
                <select class="db-pop-select" data-field="dir">
                    <option value="asc" ${dbData.sort?.dir !== 'desc' ? 'selected' : ''}>Ascending</option>
                    <option value="desc" ${dbData.sort?.dir === 'desc' ? 'selected' : ''}>Descending</option>
                </select>
                <div class="db-pop-actions">
                    <button class="db-pop-btn" data-action="apply-sort">Apply</button>
                    <button class="db-pop-btn" data-action="clear-sort">Clear</button>
                </div>
            `;
        } else {
            pop.innerHTML = `
                <label>Column</label>
                <select class="db-pop-select" data-field="col">${colOpts}</select>
                <label>Contains</label>
                <input type="text" class="db-pop-input" value="${dbData.filter?.value || ''}" placeholder="Filter value...">
                <div class="db-pop-actions">
                    <button class="db-pop-btn" data-action="apply-filter">Apply</button>
                    <button class="db-pop-btn" data-action="clear-filter">Clear</button>
                </div>
            `;
        }
        
        btn.parentElement.appendChild(pop);
        
        pop.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const ab = ev.target.closest('.db-pop-btn');
            if (!ab) return;
            const pa = ab.dataset.action;
            if (pa === 'apply-sort') {
                dbData.sort = {
                    col: parseInt(pop.querySelector('[data-field="col"]').value),
                    dir: pop.querySelector('[data-field="dir"]').value
                };
            } else if (pa === 'clear-sort') {
                dbData.sort = null;
            } else if (pa === 'apply-filter') {
                dbData.filter = {
                    col: parseInt(pop.querySelector('[data-field="col"]').value),
                    value: pop.querySelector('.db-pop-input').value
                };
            } else if (pa === 'clear-filter') {
                dbData.filter = null;
            }
            pop.remove();
            buildDatabase(wrapper, dbData, block);
            save();
        });
        
        // Close on outside click
        const closePopover = (ev) => {
            if (!pop.contains(ev.target) && ev.target !== btn) {
                pop.remove();
                document.removeEventListener('click', closePopover);
            }
        };
        setTimeout(() => document.addEventListener('click', closePopover), 0);
    });
    
    // Table
    const table = document.createElement('table');
    table.className = 'db-table';
    
    // Header
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    dbData.columns.forEach((col, ci) => {
        const th = document.createElement('th');
        th.className = 'db-th';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'db-col-name';
        nameSpan.contentEditable = 'true';
        nameSpan.textContent = col.name;
        nameSpan.addEventListener('blur', () => {
            dbData.columns[ci].name = nameSpan.textContent.trim() || 'Column';
            save();
        });
        nameSpan.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); nameSpan.blur(); }
        });
        
        const typeBtn = document.createElement('span');
        typeBtn.className = 'db-col-type';
        typeBtn.textContent = col.type;
        typeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Cycle through types
            const idx = DB_COLUMN_TYPES.indexOf(col.type);
            const newType = DB_COLUMN_TYPES[(idx + 1) % DB_COLUMN_TYPES.length];
            dbData.columns[ci].type = newType;
            // Reset cells to default for new type
            dbData.rows.forEach(r => {
                if (newType === 'checkbox') r.cells[ci] = false;
                else if (newType === 'number') r.cells[ci] = r.cells[ci] !== '' ? r.cells[ci] : '0';
                else r.cells[ci] = String(r.cells[ci] ?? '');
            });
            buildDatabase(wrapper, dbData, block);
            save();
        });
        
        th.appendChild(nameSpan);
        th.appendChild(typeBtn);
        headRow.appendChild(th);
    });
    
    // Add column button in header
    const thAdd = document.createElement('th');
    thAdd.className = 'db-th db-add-col';
    thAdd.textContent = '+';
    thAdd.title = 'Add column';
    thAdd.addEventListener('click', () => {
        dbData.columns.push({ name: 'Column', type: 'text' });
        dbData.rows.forEach(r => r.cells.push(''));
        buildDatabase(wrapper, dbData, block);
        save();
    });
    headRow.appendChild(thAdd);
    thead.appendChild(headRow);
    table.appendChild(thead);
    
    // Body
    const tbody = document.createElement('tbody');
    displayRows.forEach((row) => {
        const origIdx = row._origIdx;
        const tr = document.createElement('tr');
        dbData.columns.forEach((col, ci) => {
            const td = document.createElement('td');
            td.className = 'db-td';
            
            renderDbCell(td, col, dbData.rows[origIdx].cells, ci, save);
            
            tr.appendChild(td);
        });
        // Empty cell under add-col
        const tdEmpty = document.createElement('td');
        tdEmpty.className = 'db-td db-td-spacer';
        tr.appendChild(tdEmpty);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrapper.appendChild(table);
    
    // Controls
    const controls = document.createElement('div');
    controls.className = 'db-controls';
    controls.innerHTML = `
        <button class="db-ctrl-btn" data-action="add-row">+ New</button>
        <button class="db-ctrl-btn" data-action="del-row">− Row</button>
        <button class="db-ctrl-btn" data-action="del-col">− Col</button>
    `;
    controls.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.db-ctrl-btn');
        if (!btn) return;
        const a = btn.dataset.action;
        if (a === 'add-row') {
            const newCells = dbData.columns.map(c => c.type === 'checkbox' ? false : '');
            dbData.rows.push({ cells: newCells });
        } else if (a === 'del-row' && dbData.rows.length > 1) {
            dbData.rows.pop();
        } else if (a === 'del-col' && dbData.columns.length > 1) {
            dbData.columns.pop();
            dbData.rows.forEach(r => r.cells.pop());
        }
        buildDatabase(wrapper, dbData, block);
        save();
    });
    wrapper.appendChild(controls);
}

function renderDbCell(td, col, cells, ci, save) {
    td.innerHTML = '';
    
    switch (col.type) {
        case 'checkbox': {
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = !!cells[ci];
            cb.className = 'db-checkbox';
            cb.addEventListener('change', () => {
                cells[ci] = cb.checked;
                save();
            });
            td.appendChild(cb);
            break;
        }
        case 'select': {
            const val = cells[ci] || '';
            if (val) {
                const tag = document.createElement('span');
                tag.className = 'db-tag';
                tag.textContent = val;
                tag.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showSelectEditor(td, col, cells, ci, save);
                });
                td.appendChild(tag);
            } else {
                td.addEventListener('click', () => showSelectEditor(td, col, cells, ci, save), { once: true });
            }
            break;
        }
        case 'date': {
            const inp = document.createElement('input');
            inp.type = 'date';
            inp.className = 'db-date-input';
            inp.value = cells[ci] || '';
            inp.addEventListener('change', () => {
                cells[ci] = inp.value;
                save();
            });
            td.appendChild(inp);
            break;
        }
        case 'number': {
            const inp = document.createElement('input');
            inp.type = 'number';
            inp.className = 'db-number-input';
            inp.value = cells[ci] ?? '';
            inp.addEventListener('change', () => {
                cells[ci] = inp.value;
                save();
            });
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') e.stopPropagation();
            });
            td.appendChild(inp);
            break;
        }
        default: {
            // text
            const span = document.createElement('span');
            span.contentEditable = 'true';
            span.className = 'db-text-cell';
            span.textContent = cells[ci] || '';
            span.addEventListener('blur', () => {
                cells[ci] = span.textContent;
                save();
            });
            span.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') e.stopPropagation();
            });
            td.appendChild(span);
        }
    }
}

function showSelectEditor(td, col, cells, ci, save) {
    // Remove existing
    td.querySelectorAll('.db-select-dropdown').forEach(d => d.remove());
    
    const drop = document.createElement('div');
    drop.className = 'db-select-dropdown';
    
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'db-select-input';
    inp.placeholder = 'Type an option...';
    inp.value = cells[ci] || '';
    drop.appendChild(inp);
    
    const optList = document.createElement('div');
    optList.className = 'db-select-options';
    
    const renderOptions = (filter) => {
        const opts = col.options || [];
        const filtered = filter ? opts.filter(o => o.toLowerCase().includes(filter.toLowerCase())) : opts;
        optList.innerHTML = filtered.map(o => `<div class="db-select-opt">${o}</div>`).join('');
        if (filter && !opts.includes(filter)) {
            optList.innerHTML += `<div class="db-select-opt db-select-create">Create "${filter}"</div>`;
        }
    };
    renderOptions('');
    drop.appendChild(optList);
    
    inp.addEventListener('input', () => renderOptions(inp.value));
    
    optList.addEventListener('click', (e) => {
        const opt = e.target.closest('.db-select-opt');
        if (!opt) return;
        if (opt.classList.contains('db-select-create')) {
            const newVal = inp.value.trim();
            if (newVal && !col.options.includes(newVal)) {
                col.options.push(newVal);
            }
            cells[ci] = newVal;
        } else {
            cells[ci] = opt.textContent;
        }
        drop.remove();
        renderDbCell(td, col, cells, ci, save);
        save();
    });
    
    inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            const val = inp.value.trim();
            if (val && !col.options.includes(val)) {
                col.options.push(val);
            }
            cells[ci] = val;
            drop.remove();
            renderDbCell(td, col, cells, ci, save);
            save();
        }
        if (e.key === 'Escape') {
            drop.remove();
            renderDbCell(td, col, cells, ci, save);
        }
    });
    
    td.appendChild(drop);
    inp.focus();
    
    const closeDrop = (ev) => {
        if (!drop.contains(ev.target)) {
            drop.remove();
            renderDbCell(td, col, cells, ci, save);
            document.removeEventListener('mousedown', closeDrop);
        }
    };
    setTimeout(() => document.addEventListener('mousedown', closeDrop), 0);
}

// ======= Synced Blocks =======

function getSyncedBlockData(syncId) {
    const blocks = Storage.getPref('syncedBlocks') || {};
    return blocks[syncId] || null;
}

function updateSyncedBlock(syncId, content) {
    const blocks = Storage.getPref('syncedBlocks') || {};
    blocks[syncId] = { content, updatedAt: Date.now() };
    Storage.setPref('syncedBlocks', blocks);
    
    // Update all other instances of this synced block on the current page
    document.querySelectorAll(`.synced-block[data-sync-id="${syncId}"]`).forEach(el => {
        const inner = el.querySelector('.synced-inner');
        if (inner && inner !== document.activeElement && inner.innerHTML !== content) {
            inner.innerHTML = content;
        }
    });
}
