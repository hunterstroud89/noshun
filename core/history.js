/**
 * History Module
 * Undo/Redo functionality
 */

const History = {
    undoStack: [],
    redoStack: [],
    maxHistory: 50,
    isApplying: false,

    init() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + Z = Undo
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            }
            
            // Cmd/Ctrl + Shift + Z = Redo
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                this.redo();
            }
            
            // Cmd/Ctrl + Y = Redo (alternative)
            if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
        });
    },

    // Push state to history
    push(state) {
        if (this.isApplying) return;
        
        // Clone the state
        const snapshot = JSON.stringify(state);
        
        // Don't push if same as last state
        if (this.undoStack.length > 0 && 
            this.undoStack[this.undoStack.length - 1] === snapshot) {
            return;
        }
        
        this.undoStack.push(snapshot);
        
        // Limit stack size
        if (this.undoStack.length > this.maxHistory) {
            this.undoStack.shift();
        }
        
        // Clear redo stack on new action
        this.redoStack = [];
    },

    // Undo last action
    undo() {
        if (this.undoStack.length <= 1) {
            this.showToast('Nothing to undo');
            return;
        }
        
        // Move current state to redo
        const current = this.undoStack.pop();
        this.redoStack.push(current);
        
        // Apply previous state
        const previous = this.undoStack[this.undoStack.length - 1];
        this.applyState(JSON.parse(previous));
        
        this.showToast('Undo');
    },

    // Redo last undone action
    redo() {
        if (this.redoStack.length === 0) {
            this.showToast('Nothing to redo');
            return;
        }
        
        const state = this.redoStack.pop();
        this.undoStack.push(state);
        this.applyState(JSON.parse(state));
        
        this.showToast('Redo');
    },

    // Apply a state
    applyState(state) {
        this.isApplying = true;
        
        if (App.currentPage) {
            App.currentPage.content = state;
            Editor.loadContent(state);
        }
        
        setTimeout(() => {
            this.isApplying = false;
        }, 100);
    },

    // Show undo/redo feedback
    showToast(action) {
        App.showToast(action);
    },

    // Clear history (when switching pages)
    clear() {
        this.undoStack = [];
        this.redoStack = [];
    },

    // Get current state for saving
    getCurrentState() {
        if (this.undoStack.length > 0) {
            return JSON.parse(this.undoStack[this.undoStack.length - 1]);
        }
        return null;
    }
};
