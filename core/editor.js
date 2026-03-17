/**
 * Editor Module
 * Handles the block editor functionality
 */

const MAX_INDENT = 6;
const SAVE_DELAY_MS = 500;

const Editor = {
    container: null,
    slashMenu: null,
    formatToolbar: null,
    currentBlock: null,
    slashMenuVisible: false,
    slashMenuIndex: 0,
    slashFilteredItems: [],
    saveTimeout: null,
    dropIndicator: null,
    draggedBlock: null,

    init(containerId) {
        this.container = document.getElementById(containerId);
        this.slashMenu = document.getElementById('slash-menu');
        this.formatToolbar = document.getElementById('format-toolbar');
        
        if (!this.container) return;
        
        this.setupEventListeners();
        this.populateSlashMenu();
        
        return this;
    },

    setupEventListeners() {
        // Global keyboard handler
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
        
        // Editor container events
        this.container.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.container.addEventListener('input', (e) => this.handleInput(e));
        this.container.addEventListener('click', (e) => this.handleClick(e));
        this.container.addEventListener('mouseup', () => this.handleSelection());
        
        // Close menus on outside click
        document.addEventListener('click', (e) => {
            if (!this.slashMenu.contains(e.target)) {
                this.hideSlashMenu();
            }
            if (!this.formatToolbar.contains(e.target) && !window.getSelection().toString()) {
                this.hideFormatToolbar();
            }
        });

        // Drag and drop
        this.container.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.container.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.container.addEventListener('drop', (e) => this.handleDrop(e));
        this.container.addEventListener('dragend', (e) => this.handleDragEnd(e));
        
        // Create persistent drop indicator line
        this.dropIndicator = document.createElement('div');
        this.dropIndicator.className = 'drop-indicator';
        document.body.appendChild(this.dropIndicator);
    },

    populateSlashMenu() {
        const items = document.getElementById('slash-menu-items');
        if (!items) return;
        
        const blockTypes = getBlockTypesList();
        items.innerHTML = blockTypes.map((type, index) => `
            <div class="slash-menu-item" data-type="${type.id}" data-index="${index}">
                <div class="item-icon">${Icons.get(type.emoji, 20)}</div>
                <div class="item-info">
                    <div class="item-name">${type.name}</div>
                    <div class="item-desc">${type.description}</div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        items.querySelectorAll('.slash-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                this.insertBlockType(item.dataset.type);
                this.hideSlashMenu();
            });
        });

        this.slashFilteredItems = Array.from(items.querySelectorAll('.slash-menu-item'));
    },

    handleGlobalKeydown(e) {
        // Slash menu navigation
        if (this.slashMenuVisible) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateSlashMenu(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateSlashMenu(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const activeItem = this.slashFilteredItems[this.slashMenuIndex];
                if (activeItem) {
                    this.insertBlockType(activeItem.dataset.type);
                    this.hideSlashMenu();
                }
            } else if (e.key === 'Escape') {
                this.hideSlashMenu();
            }
        }
    },

    handleKeydown(e) {
        const target = e.target;
        if (!target.classList.contains('block-content')) return;
        
        const block = target.closest('.block');
        
        // Enter key - create new block
        if (e.key === 'Enter' && !e.shiftKey) {
            // Don't handle if slash menu is open
            if (this.slashMenuVisible) return;
            
            e.preventDefault();
            this.createNewBlockAfter(block);
        }
        
        // Backspace on empty block - delete it
        if (e.key === 'Backspace' && target.textContent === '') {
            const prevBlock = block.previousElementSibling;
            if (prevBlock) {
                e.preventDefault();
                block.remove();
                const prevContent = prevBlock.querySelector('.block-content');
                if (prevContent) {
                    prevContent.focus();
                    // Move cursor to end
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(prevContent);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                this.scheduleSave();
            }
            this.ensureTrailingBlock();
        }
        
        // Arrow up at start - move to previous block
        if (e.key === 'ArrowUp') {
            const sel = window.getSelection();
            if (sel.anchorOffset === 0) {
                const prevBlock = block.previousElementSibling;
                if (prevBlock) {
                    e.preventDefault();
                    const prevContent = prevBlock.querySelector('.block-content');
                    if (prevContent) {
                        prevContent.focus();
                    }
                }
            }
        }
        
        // Arrow down at end - move to next block
        if (e.key === 'ArrowDown') {
            const sel = window.getSelection();
            if (sel.anchorOffset === target.textContent.length) {
                const nextBlock = block.nextElementSibling;
                if (nextBlock) {
                    e.preventDefault();
                    const nextContent = nextBlock.querySelector('.block-content');
                    if (nextContent) {
                        nextContent.focus();
                    }
                }
            }
        }
        
        // Tab - indent/outdent for lists
        if (e.key === 'Tab') {
            const type = block.getAttribute('data-type');
            if (['bullet', 'numbered', 'todo'].includes(type)) {
                e.preventDefault();
                const currentIndent = parseInt(block.dataset.indent || '0', 10);
                if (e.shiftKey) {
                    // Outdent
                    const newIndent = Math.max(0, currentIndent - 1);
                    block.dataset.indent = newIndent;
                    block.style.marginLeft = (newIndent * INDENT_PX) + 'px';
                } else {
                    // Indent
                    const newIndent = Math.min(MAX_INDENT, currentIndent + 1);
                    block.dataset.indent = newIndent;
                    block.style.marginLeft = (newIndent * INDENT_PX) + 'px';
                }
                this.scheduleSave();
            }
        }
    },

    handleInput(e) {
        const target = e.target;
        if (!target.classList.contains('block-content')) return;
        
        const text = target.textContent;
        const block = target.closest('.block');
        
        // Check for slash command
        if (text === '/') {
            this.showSlashMenu(target);
        } else if (text.startsWith('/')) {
            this.filterSlashMenu(text.substring(1));
        } else {
            this.hideSlashMenu();
        }
        
        // Auto-convert markdown shortcuts
        this.checkMarkdownShortcuts(target, block);
        
        // Update numbered lists
        updateNumberedLists(this.container);
        
        // Schedule save
        this.scheduleSave();
    },

    handleClick(e) {
        const target = e.target;
        
        // Focus empty editor
        if (target === this.container && this.container.children.length === 0) {
            this.addEmptyBlock();
        }
    },

    handleSelection() {
        const selection = window.getSelection();
        if (selection.toString().trim()) {
            this.showFormatToolbar(selection);
        } else {
            this.hideFormatToolbar();
        }
    },

    // Slash menu
    showSlashMenu(target) {
        const rect = target.getBoundingClientRect();
        this.slashMenu.style.display = 'block';
        this.slashMenu.style.left = rect.left + 'px';
        this.slashMenu.style.top = (rect.bottom + 4) + 'px';
        
        // Keep menu in viewport
        const menuRect = this.slashMenu.getBoundingClientRect();
        if (menuRect.bottom > window.innerHeight) {
            this.slashMenu.style.top = (rect.top - menuRect.height - 4) + 'px';
        }
        if (menuRect.right > window.innerWidth) {
            this.slashMenu.style.left = (window.innerWidth - menuRect.width - 8) + 'px';
        }
        this.slashMenuVisible = true;
        this.slashMenuIndex = 0;
        this.currentBlock = target.closest('.block');
        this.updateSlashMenuActive();
        
        // Reset filter
        this.filterSlashMenu('');
    },

    hideSlashMenu() {
        this.slashMenu.style.display = 'none';
        this.slashMenuVisible = false;
    },

    filterSlashMenu(query) {
        const items = document.getElementById('slash-menu-items');
        const allItems = items.querySelectorAll('.slash-menu-item');
        
        this.slashFilteredItems = [];
        
        allItems.forEach(item => {
            const name = item.querySelector('.item-name').textContent.toLowerCase();
            const matches = name.includes(query.toLowerCase());
            item.style.display = matches ? 'flex' : 'none';
            if (matches) {
                this.slashFilteredItems.push(item);
            }
        });
        
        this.slashMenuIndex = 0;
        this.updateSlashMenuActive();
    },

    navigateSlashMenu(direction) {
        this.slashMenuIndex += direction;
        if (this.slashMenuIndex < 0) this.slashMenuIndex = this.slashFilteredItems.length - 1;
        if (this.slashMenuIndex >= this.slashFilteredItems.length) this.slashMenuIndex = 0;
        this.updateSlashMenuActive();
    },

    updateSlashMenuActive() {
        this.slashFilteredItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.slashMenuIndex);
        });
        
        // Scroll active item into view
        const activeItem = this.slashFilteredItems[this.slashMenuIndex];
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'nearest' });
        }
    },

    insertBlockType(typeId) {
        if (!this.currentBlock) return;
        
        // Clear the slash command text
        const content = this.currentBlock.querySelector('.block-content');
        if (content && content.textContent.startsWith('/')) {
            content.textContent = '';
        }
        
        // Convert the block
        const newBlock = convertBlockType(this.currentBlock, typeId);
        this.currentBlock = null;
        
        this.scheduleSave();
    },

    // Format toolbar
    showFormatToolbar(selection) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        this.formatToolbar.style.display = 'flex';
        this.formatToolbar.style.left = (rect.left + rect.width / 2 - 100) + 'px';
        this.formatToolbar.style.top = (rect.top - 40) + 'px';
    },

    hideFormatToolbar() {
        this.formatToolbar.style.display = 'none';
    },

    // Block operations
    createNewBlockAfter(afterBlock) {
        const newBlock = createBlockElement('paragraph');
        
        if (afterBlock && afterBlock.nextSibling) {
            this.container.insertBefore(newBlock, afterBlock.nextSibling);
        } else {
            this.container.appendChild(newBlock);
        }
        
        // Focus new block
        const content = newBlock.querySelector('.block-content');
        if (content) {
            content.focus();
        }
        
        updateNumberedLists(this.container);
        this.scheduleSave();
        
        return newBlock;
    },

    addEmptyBlock() {
        const block = createBlockElement('paragraph');
        this.container.appendChild(block);
        block.querySelector('.block-content')?.focus();
        return block;
    },

    ensureTrailingBlock() {
        const blocks = this.container.querySelectorAll('.block');
        if (blocks.length === 0) {
            this.addEmptyBlock();
            return;
        }
        const last = blocks[blocks.length - 1];
        const content = last.querySelector('.block-content');
        // If the last block has content or isn't a paragraph, add an empty one
        if (last.dataset.type !== 'paragraph' || (content && content.textContent.trim() !== '')) {
            const block = createBlockElement('paragraph');
            this.container.appendChild(block);
        }
    },

    // Markdown shortcuts
    checkMarkdownShortcuts(target, block) {
        const text = target.textContent;
        
        const shortcuts = [
            { pattern: /^# $/, type: 'heading1' },
            { pattern: /^## $/, type: 'heading2' },
            { pattern: /^### $/, type: 'heading3' },
            { pattern: /^- $/, type: 'bulletList' },
            { pattern: /^\* $/, type: 'bulletList' },
            { pattern: /^1\. $/, type: 'numberedList' },
            { pattern: /^\[\] $/, type: 'todo' },
            { pattern: /^> $/, type: 'quote' },
            { pattern: /^```$/, type: 'code' },
            { pattern: /^---$/, type: 'divider' },
            { pattern: /^!!! $/, type: 'callout' },
            { pattern: /^>> $/, type: 'toggle' },
        ];
        
        for (const shortcut of shortcuts) {
            if (shortcut.pattern.test(text)) {
                target.textContent = '';
                convertBlockType(block, shortcut.type);
                break;
            }
        }
    },

    // Drag and drop
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Find the nearest non-dragging block
        const allBlocks = [...this.container.querySelectorAll('.block:not(.dragging)')];
        if (!allBlocks.length) {
            this.hideDropIndicator();
            return;
        }
        
        // Find closest block to cursor
        let closest = null;
        let closestDist = Infinity;
        let insertBefore = true;
        
        for (const b of allBlocks) {
            const rect = b.getBoundingClientRect();
            const mid = rect.top + rect.height / 2;
            const dist = Math.abs(e.clientY - mid);
            if (dist < closestDist) {
                closestDist = dist;
                closest = b;
                insertBefore = e.clientY < mid;
            }
        }
        
        if (!closest) {
            this.hideDropIndicator();
            return;
        }
        
        const rect = closest.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        const y = insertBefore ? rect.top : rect.bottom;
        
        this.dropIndicator.style.display = 'block';
        this.dropIndicator.style.top = (y - 1) + 'px';
        this.dropIndicator.style.left = containerRect.left + 'px';
        this.dropIndicator.style.width = containerRect.width + 'px';
        this.dropIndicator.dataset.target = closest.dataset.id;
        this.dropIndicator.dataset.position = insertBefore ? 'before' : 'after';
    },

    handleDragLeave(e) {
        // Only hide if leaving the container entirely
        if (!this.container.contains(e.relatedTarget)) {
            this.hideDropIndicator();
        }
    },

    handleDrop(e) {
        e.preventDefault();
        const targetId = this.dropIndicator.dataset.target;
        const position = this.dropIndicator.dataset.position;
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedBlock = this.container.querySelector(`[data-id="${draggedId}"]`);
        const targetBlock = targetId ? this.container.querySelector(`[data-id="${targetId}"]`) : null;
        
        if (draggedBlock && targetBlock && draggedBlock !== targetBlock) {
            if (position === 'before') {
                targetBlock.parentNode.insertBefore(draggedBlock, targetBlock);
            } else {
                targetBlock.parentNode.insertBefore(draggedBlock, targetBlock.nextSibling);
            }
            
            updateNumberedLists(this.container);
            this.scheduleSave();
        }
        
        this.cleanupDrag();
    },

    handleDragEnd(e) {
        this.cleanupDrag();
    },

    hideDropIndicator() {
        this.dropIndicator.style.display = 'none';
        delete this.dropIndicator.dataset.target;
        delete this.dropIndicator.dataset.position;
    },

    cleanupDrag() {
        this.hideDropIndicator();
        if (this.draggedBlock) {
            this.draggedBlock.classList.remove('dragging');
            this.draggedBlock = null;
        }
    },

    // Save functionality
    scheduleSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            if (typeof saveCurrentPage === 'function') {
                saveCurrentPage();
            }
        }, SAVE_DELAY_MS);
    },

    // Load content
    loadContent(blocks) {
        this.container.innerHTML = '';
        
        if (!blocks || blocks.length === 0) {
            this.addEmptyBlock();
            return;
        }
        
        const fragment = deserializeBlocks(blocks);
        this.container.appendChild(fragment);
        updateNumberedLists(this.container);
        this.ensureTrailingBlock();
    },

    // Get content
    getContent() {
        return serializeBlocks(this.container);
    },

    // Clear editor
    clear() {
        this.container.innerHTML = '';
        this.addEmptyBlock();
    }
};
