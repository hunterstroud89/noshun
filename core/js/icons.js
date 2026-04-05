/**
 * Icons Module — SVG icon pack + native emoji library
 * UI icons are inline SVGs, emojis are native Unicode characters.
 * Use "emoji:😀" for emoji icons, plain name for UI icons.
 */

const Icons = {
    // Render an icon by name. Returns HTML string.
    // For "emoji:X" → native emoji character in <span>
    // For plain name → inline SVG
    // For raw emoji character → native emoji in <span>
    get(name, size = 20) {
        if (!name) return this._icons['page'](size);
        if (name.startsWith('emoji:')) {
            const char = name.substring(6);
            return `<span class="icon-emoji" style="font-size:${size}px;width:${size}px;height:${size}px">${char}</span>`;
        }
        const fn = this._icons[name];
        if (fn) return fn(size);
        // Raw emoji character (not a known icon name)
        return `<span class="icon-emoji" style="font-size:${size}px;width:${size}px;height:${size}px">${name}</span>`;
    },

    // All available UI icon names
    list() {
        return Object.keys(this._icons);
    },

    // All available emoji names
    // All available emoji names (memoized)
    _emojiListCache: null,
    emojiList() {
        if (!this._emojiListCache) {
            this._emojiListCache = Object.values(this.emojiCategories).flat();
        }
        return this._emojiListCache;
    },

    // UI icon categories for the picker
    categories: {
        'Documents': ['page', 'note', 'notebook', 'clipboard', 'folder', 'folder-open', 'archive', 'bookmark', 'tag', 'pin'],
        'Actions': ['plus', 'search', 'settings', 'trash', 'edit', 'link', 'share', 'download', 'upload', 'sync'],
        'Media': ['image', 'camera', 'film', 'music', 'mic', 'speaker', 'play', 'pause', 'headphones', 'palette'],
        'Objects': ['lightbulb', 'key', 'lock', 'unlock', 'hammer', 'wrench', 'magnet', 'battery', 'plug', 'flask'],
        'Shapes': ['star', 'heart', 'diamond', 'circle', 'square', 'triangle', 'hexagon', 'octagon', 'shield', 'flag'],
        'Nature': ['sun', 'moon', 'cloud', 'rain', 'snow', 'leaf', 'tree', 'flower', 'mountain', 'wave'],
        'Symbols': ['check', 'x-mark', 'alert', 'info', 'question', 'fire', 'bolt', 'atom', 'target', 'infinity'],
        'People': ['user', 'users', 'smile', 'thumbs-up', 'brain', 'eye', 'hand', 'chat', 'mail', 'phone'],
        'Travel': ['home', 'building', 'globe', 'map', 'compass', 'car', 'plane', 'rocket', 'ship', 'train'],
        'Food': ['coffee', 'pizza', 'apple', 'cherry', 'cake', 'cookie', 'ice-cream', 'bread', 'wine', 'candy'],
    },

    // Native emoji categories (Unicode characters)
    emojiCategories: {
        'Smileys': [
            '😀','😂','🤣','😊','😉','😍','🤩','😘','😋','🤔',
            '🤫','😎','🤓','🥳','🤯','🙂','🙃','🥰','🥱','😢',
            '😡','😱','👻','👽','🤖','🤡','💀','💩','💯','😈'
        ],
        'Hands & People': [
            '👋','👍','👎','👏','🙌','🙏','💪','✌️','🤘','🤟',
            '🤝','✊','🖖','🤞','🤙','✍️','👀','🧠','👶','👦',
            '👧','👨','👩','👴','👵','🧑‍💻','💁','🙋','🤷','🤦'
        ],
        'Hearts & Symbols': [
            '❤️','🧡','💛','💚','💙','💜','🖤','🤍','💘','💖',
            '💕','💋','🔥','✨','⭐','🌟','💥','💫','💢','💦',
            '🎯','❗','❓','✅','❌','♾️','🔴','🟡','🟢','🔵'
        ],
        'Animals': [
            '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🦁',
            '🐮','🐷','🐸','🐵','🐧','🐦','🦅','🦋','🦄','🐢',
            '🐍','🐠','🐳','🦈','🐝','🐞','🦉','🐺','🦇','🐙'
        ],
        'Nature': [
            '🌻','🌹','🌷','🌸','🌺','🌲','🌳','🌵','🍃','🍀',
            '🍄','🌈','☀️','🌙','☁️','⛈️','❄️','🌊','🌍','🌎',
            '🌏','🏔️','🌋','🏝️','🌾','🌿','☘️','💐','🌼','🪻'
        ],
        'Food & Drink': [
            '🍎','🍊','🍋','🍌','🍉','🍇','🍓','🍒','🍑','🥑',
            '🍕','🍔','🌮','🍣','🍰','🍩','🍪','🍦','☕','🍷',
            '🍺','🍵','🎂','🍫','🍭','🥐','🧁','🥤','🍿','🥝'
        ],
        'Objects': [
            '📖','📚','📓','📝','📕','📗','📘','📙','💡','🔍',
            '🔑','🔒','🔔','📢','📦','📅','📋','📌','📎','🔧',
            '⚙️','🔗','📱','💻','📷','🎨','🖊️','✂️','🗑️','📧'
        ],
        'Travel': [
            '🏠','🏢','🏫','🌎','🌍','🌏','🚀','✈️','🚗','🚂',
            '🚢','🚲','⛽','🏖️','🏔️','🗼','🗽','🏰','🎡','🎢'
        ],
        'Activities': [
            '🏆','🥇','⚽','🏀','🎲','🎮','🧩','🎸','🎵','🎤',
            '🎬','🎟️','🎳','♟️','🎭','🏈','🎯','🎪','🎨','🏓'
        ],
        'Flags & More': [
            '🚩','🏁','🏳️','♠️','♥️','♦️','♣️','♻️','⚛️','☮️',
            '🔱','⚜️','🔰','💠','🔶','🔷','🔸','🔹','▪️','▫️'
        ]
    },

    // The icon definitions — each returns an SVG string
    _icons: {
        // === Documents ===
        'page': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
        'note': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
        'notebook': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#9B6DD7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
        'clipboard': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
        'folder': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#F5A623" fill-opacity="0.2" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
        'folder-open': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#F5A623" fill-opacity="0.15" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1"/><path d="M20 13H9l-2 8h11a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"/></svg>`,
        'archive': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#787774" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
        'bookmark': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#EB5757" fill-opacity="0.2" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
        'tag': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4FACFE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
        'pin': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4.5L18.5 8 14 14.5 12 22 2 12l7.5-2L16 5.5"/><line x1="2" y1="22" x2="12" y2="12"/></svg>`,

        // === Actions ===
        'plus': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
        'search': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
        'settings': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#787774" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z"/></svg>`,
        'trash': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        'edit': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
        'link': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
        'share': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#9B6DD7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
        'download': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        'upload': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4FACFE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
        'sync': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,

        // === Media ===
        'image': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
        'camera': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#9B6DD7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
        'film': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>`,
        'music': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
        'mic': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
        'speaker': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
        'play': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#4DAB9A" fill-opacity="0.2" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
        'pause': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#787774" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
        'headphones': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#9B6DD7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
        'palette': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#E255A1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="0.5" fill="#EB5757" stroke="#EB5757"/><circle cx="17.5" cy="10.5" r="0.5" fill="#F5A623" stroke="#F5A623"/><circle cx="8.5" cy="7.5" r="0.5" fill="#4DAB9A" stroke="#4DAB9A"/><circle cx="6.5" cy="12.5" r="0.5" fill="#5C9CE6" stroke="#5C9CE6"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>`,

        // === Objects ===
        'lightbulb': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#FFDC49" fill-opacity="0.2" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>`,
        'key': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
        'lock': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#787774" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
        'unlock': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
        'hammer': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#787774" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V6.5a.5.5 0 0 0-.5-.5H16.5c-.8 0-1.56-.32-2.12-.88l-.75-.75a4.95 4.95 0 0 0-3.54-1.46A4.98 4.98 0 0 0 6 6.5V8"/></svg>`,
        'wrench': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
        'magnet': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15V9a6 6 0 0 1 12 0v6"/><path d="M6 11h4"/><path d="M14 11h4"/><line x1="2" y1="19" x2="8" y2="19"/><line x1="16" y1="19" x2="22" y2="19"/><line x1="2" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="22" y2="15"/></svg>`,
        'battery': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#4DAB9A" fill-opacity="0.2" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>`,
        'plug': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/></svg>`,
        'flask': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#9B6DD7" fill-opacity="0.15" stroke="#9B6DD7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v5.586c0 .265.105.52.293.707L19.586 13.586a2 2 0 0 1 .414 2.162l-.121.252A7.5 7.5 0 0 1 13.236 20H10.764a7.5 7.5 0 0 1-6.643-4l-.121-.252a2 2 0 0 1 .414-2.162L8.707 9.293A1 1 0 0 0 9 8.586V3z"/><line x1="8" y1="3" x2="16" y2="3"/></svg>`,

        // === Shapes ===
        'star': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#FFDC49" fill-opacity="0.3" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        'star-filled': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        'heart': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#EB5757" fill-opacity="0.2" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        'diamond': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#4FACFE" fill-opacity="0.15" stroke="#4FACFE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.93" y="4.93" width="14.14" height="14.14" rx="2" transform="rotate(45 12 12)"/></svg>`,
        'circle': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#4DAB9A" fill-opacity="0.15" stroke="#4DAB9A" stroke-width="1.8"><circle cx="12" cy="12" r="10"/></svg>`,
        'square': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#F5A623" fill-opacity="0.15" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>`,
        'triangle': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#EB5757" fill-opacity="0.15" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`,
        'hexagon': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#9B6DD7" fill-opacity="0.15" stroke="#9B6DD7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16.2V7.8a2 2 0 0 0-1-1.73l-7-4.04a2 2 0 0 0-2 0l-7 4.04A2 2 0 0 0 3 7.8v8.4a2 2 0 0 0 1 1.73l7 4.04a2 2 0 0 0 2 0l7-4.04A2 2 0 0 0 21 16.2z"/></svg>`,
        'octagon': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#F5A623" fill-opacity="0.15" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/></svg>`,
        'shield': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#5C9CE6" fill-opacity="0.15" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        'flag': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#EB5757" fill-opacity="0.2" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,

        // === Nature ===
        'sun': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#FFDC49" fill-opacity="0.2" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
        'moon': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#9B6DD7" fill-opacity="0.15" stroke="#9B6DD7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
        'cloud': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#5C9CE6" fill-opacity="0.15" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
        'rain': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`,
        'snow': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4FACFE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/><line x1="16" y1="16" x2="16.01" y2="16"/><line x1="16" y1="20" x2="16.01" y2="20"/></svg>`,
        'leaf': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#4DAB9A" fill-opacity="0.15" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
        'tree': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#4DAB9A" fill-opacity="0.15" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"/><path d="M17 14H7l5-10 5 10z"/><path d="M15.5 8H8.5L12 2l3.5 6z"/></svg>`,
        'flower': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#E255A1" fill-opacity="0.15" stroke="#E255A1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
        'mountain': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#787774" fill-opacity="0.15" stroke="#787774" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3l4 8 5-5 5 15H2z"/></svg>`,
        'wave': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2-2.67 4-4 6-4s4 2.67 6 4 4 4 6 4"/><path d="M2 6c2-2.67 4-4 6-4s4 2.67 6 4 4 4 6 4"/><path d="M2 18c2-2.67 4-4 6-4s4 2.67 6 4 4 4 6 4"/></svg>`,

        // === Symbols ===
        'check': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
        'x-mark': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#EB5757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        'alert': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#FFDC49" fill-opacity="0.2" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        'info': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#5C9CE6" fill-opacity="0.15" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        'question': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#9B6DD7" fill-opacity="0.15" stroke="#9B6DD7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        'fire': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#EB5757" fill-opacity="0.2" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4.97 0 8-3.58 8-8 0-7-6.16-10.8-8-14-1.84 3.2-8 7-8 14 0 4.42 3.03 8 8 8z"/></svg>`,
        'bolt': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#FFDC49" fill-opacity="0.3" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        'atom': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.5" fill="#5C9CE6"/><ellipse cx="12" cy="12" rx="10" ry="4.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/></svg>`,
        'target': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
        'infinity': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#9B6DD7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.267-8-5.096 0-5.096 8 0 8 5.134 0 7.172-8 12.267-8z"/></svg>`,

        // === People ===
        'user': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        'users': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        'smile': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#FFDC49" fill-opacity="0.2" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
        'thumbs-up': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#5C9CE6" fill-opacity="0.15" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
        'brain': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#E255A1" fill-opacity="0.1" stroke="#E255A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2a3.5 3.5 0 0 0-3.43 2.82A3.5 3.5 0 0 0 3 8.25a3.5 3.5 0 0 0 .7 2.1A3.5 3.5 0 0 0 5 14.5a3.5 3.5 0 0 0 2 3.17V21h2.5"/><path d="M14.5 2a3.5 3.5 0 0 1 3.43 2.82A3.5 3.5 0 0 1 21 8.25a3.5 3.5 0 0 1-.7 2.1A3.5 3.5 0 0 1 19 14.5a3.5 3.5 0 0 1-2 3.17V21h-2.5"/><path d="M12 2v19"/></svg>`,
        'eye': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
        'hand': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#F5A623" fill-opacity="0.15" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v1M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-2.83 0-5.27-1.14-6.6-3.42L4 16"/></svg>`,
        'chat': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#4DAB9A" fill-opacity="0.15" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        'mail': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#5C9CE6" fill-opacity="0.1" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>`,
        'phone': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,

        // === Travel ===
        'home': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#5C9CE6" fill-opacity="0.1" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        'building': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#787774" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9.01" y2="6"/><line x1="15" y1="6" x2="15.01" y2="6"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/><line x1="9" y1="14" x2="9.01" y2="14"/><line x1="15" y1="14" x2="15.01" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`,
        'globe': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
        'map': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4FACFE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
        'compass': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#EB5757" fill-opacity="0.2"/></svg>`,
        'car': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2l3-3h8l3 3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM19 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>`,
        'plane': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4FACFE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
        'rocket': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#EB5757" fill-opacity="0.1" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
        'ship': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h.01M7 20v-4h10v4M12 16V4"/><path d="M4.93 15l.59-.59A2 2 0 0 1 6.93 14H17.07a2 2 0 0 1 1.41.59l.59.59"/><path d="M2 21c.7-.5 1.5-.8 2.5-.8 2 0 3 1 5 1s3-1 5-1 3 1 5 1c1 0 1.8-.3 2.5-.8"/></svg>`,
        'train': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M16 19l2 3"/><circle cx="9" cy="15" r="1"/><circle cx="15" cy="15" r="1"/></svg>`,

        // === Food ===
        'coffee': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#F5A623" fill-opacity="0.1" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
        'pizza': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#F5A623" fill-opacity="0.15" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 19.5c-.5.8.2 1.8 1.1 1.5l8.9-3 8.9 3c.9.3 1.6-.7 1.1-1.5L12 2z"/><circle cx="10" cy="12" r="1" fill="#EB5757" stroke="#EB5757"/><circle cx="14" cy="15" r="1" fill="#EB5757" stroke="#EB5757"/></svg>`,
        'apple': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#EB5757" fill-opacity="0.15" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c-2-3-7-2-7 3 0 6 7 13 7 13s7-7 7-13c0-5-5-6-7-3z"/><path d="M12 5c0-2 1-4 3-4" stroke="#4DAB9A"/></svg>`,
        'cherry': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#EB5757" fill-opacity="0.2" stroke="#EB5757" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="17" r="4"/><circle cx="16" cy="17" r="4"/><path d="M8 13C8 7 12 4 16 2" stroke="#4DAB9A"/><path d="M16 13c0-6-4-9-8-11" stroke="#4DAB9A"/></svg>`,
        'cake': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#E255A1" fill-opacity="0.1" stroke="#E255A1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>`,
        'cookie': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#F5A623" fill-opacity="0.2" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="8" cy="9" r="0.5" fill="#7C4B24" stroke="#7C4B24"/><circle cx="14" cy="8" r="0.5" fill="#7C4B24" stroke="#7C4B24"/><circle cx="10" cy="14" r="0.5" fill="#7C4B24" stroke="#7C4B24"/><circle cx="15" cy="13" r="0.5" fill="#7C4B24" stroke="#7C4B24"/><circle cx="12" cy="17" r="0.5" fill="#7C4B24" stroke="#7C4B24"/></svg>`,
        'ice-cream': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#E255A1" fill-opacity="0.15" stroke="#E255A1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22l-4-10h8z" fill="#F5A623" fill-opacity="0.15" stroke="#F5A623"/><circle cx="10" cy="10" r="4"/><circle cx="14" cy="10" r="4"/></svg>`,
        'bread': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#F5A623" fill-opacity="0.2" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10c0-4 2-7 7-7s7 3 7 7v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10z"/><line x1="5" y1="16" x2="19" y2="16"/></svg>`,
        'wine': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#9B6DD7" fill-opacity="0.15" stroke="#9B6DD7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l-1 7c0 3-2 5-5 5s-5-2-5-5l-1-7z" fill="#9B6DD7" fill-opacity="0.1"/><line x1="12" y1="14" x2="12" y2="20"/><line x1="8" y1="22" x2="16" y2="22"/><line x1="5" y1="7" x2="19" y2="7"/></svg>`,
        'candy': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#E255A1" fill-opacity="0.15" stroke="#E255A1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M7.5 7.5L5 5M16.5 16.5L19 19"/><path d="M7.5 16.5L5 19M16.5 7.5L19 5"/></svg>`,

        // Misc UI icons used in interface
        'highlight': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#FFDC49" fill-opacity="0.3" stroke="#F5A623" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
        'text-color': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M9.4 4L4 16h2l1.3-3h5.4L14 16h2L10.6 4H9.4z" fill="#EB5757" fill-opacity="0.15"/></svg>`,
        'clock': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#787774" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,

        // Block type icons (for slash menu)
        'heading1': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8M4 4v16M12 4v16M20 8l-4 4v8"/></svg>`,
        'heading2': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8M4 4v16M12 4v16"/><path d="M16 8a2 2 0 1 1 4 0c0 1.5-4 3-4 5h4"/></svg>`,
        'heading3': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8M4 4v16M12 4v16"/><path d="M16 8h4l-2 4 2 0a2 2 0 1 1-4 0"/></svg>`,
        'bullet': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#787774" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="5" cy="6" r="1.5" fill="#5C9CE6"/><circle cx="5" cy="12" r="1.5" fill="#5C9CE6"/><circle cx="5" cy="18" r="1.5" fill="#5C9CE6"/></svg>`,
        'numbered': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#787774" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="3" y="8" font-size="7" fill="#9B6DD7" stroke="none" font-family="system-ui">1</text><text x="3" y="14" font-size="7" fill="#9B6DD7" stroke="none" font-family="system-ui">2</text><text x="3" y="20" font-size="7" fill="#9B6DD7" stroke="none" font-family="system-ui">3</text></svg>`,
        'code': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4DAB9A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
        'table': (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#5C9CE6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
    }
};
