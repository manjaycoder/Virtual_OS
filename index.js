document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const desktop = document.querySelector('.desktop');
    const startButton = document.querySelector('.start-button');
    const startMenu = document.querySelector('.start-menu');
    const clockElement = document.querySelector('.clock');
    const dateElement = document.querySelector('.date');
    const windowsContainer = document.querySelector('.windows-container');
    const taskbarIcons = document.querySelector('.taskbar-icons');
    const appItems = document.querySelectorAll('.app-item');
    const desktopIcons = document.querySelectorAll('.icon');
    const contextMenu = document.querySelector('.context-menu');
    const notificationCenter = document.querySelector('.notification-center');
    const notificationList = document.querySelector('.notification-list');
    const notificationIcon = document.querySelector('.notification-icon');
    const clearAllBtn = document.querySelector('.clear-all');
    
    // Virtual File System
    const fileSystem = {
        root: {
            name: 'This PC',
            type: 'folder',
            children: {
                documents: {
                    name: 'Documents',
                    type: 'folder',
                    children: {
                        file1: {
                            name: 'Document 1.txt',
                            type: 'file',
                            content: 'This is a sample document.'
                        },
                        file2: {
                            name: 'Notes.txt',
                            type: 'file',
                            content: 'Important notes go here.'
                        }
                    }
                },
                pictures: {
                    name: 'Pictures',
                    type: 'folder',
                    children: {
                        wallpaper: {
                            name: 'Wallpaper.jpg',
                            type: 'image',
                            url: 'https://wallpaperaccess.com/full/1567674.jpg'
                        },
                        vacation: {
                            name: 'Vacation.png',
                            type: 'image',
                            url: 'https://wallpaperaccess.com/full/1567675.jpg'
                        }
                    }
                },
                music: {
                    name: 'Music',
                    type: 'folder',
                    children: {
                        song1: {
                            name: 'Sample Song.mp3',
                            type: 'audio',
                            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                        }
                    }
                }
            }
        },
        currentPath: ['root']
    };
    
    // Wallpaper options
    const wallpapers = [
        { name: 'Blue', url: './files/Wallspaper/1.jpg' },
        { name: 'Blue1', url: './files/Wallspaper/2.jpg' },
        { name: 'Blue2', url: './files/Wallspaper/3.jpg' },
        { name: 'Blue3', url: './files/Wallspaper/4.jpg' },
        { name: 'Blue4', url: './files/Wallspaper/5.jpg' },
        { name: 'Blue5', url: './files/Wallspaper/6.jpg' },
        { name: 'Blue6', url: './files/Wallspaper/7.jpg' },
        { name: 'Blue7', url: './files/Wallspaper/8.jpg' },
        { name: 'Blue8', url: './files/Wallspaper/9.jpg' },
        { name: 'Blue9', url: './files/Wallspaper/10.jpg' },
        { name: 'Blue10', url: './files/Wallspaper/11.jpg' },
        { name: 'Blue11', url: './files/Wallspaper/12.jpg' },
        { name: 'Blue12', url: './files/Wallspaper/13.jpg' },
        
    ];
    
    // Notifications
    let notifications = [
        { id: 1, title: 'Welcome', message: 'Welcome to WebOS!', time: new Date() },
        { id: 2, title: 'Tip', message: 'Right-click on desktop for context menu', time: new Date() }
    ];
    
    // Update clock
    function updateClock() {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString();
        dateElement.textContent = now.toLocaleDateString();
    }
    
    setInterval(updateClock, 1000);
    updateClock();
    
    // Start menu toggle
    startButton.addEventListener('click', function(e) {
        e.stopPropagation();
        startMenu.classList.toggle('active');
        hideContextMenu();
        hideNotificationCenter();
    });
    
    // Close start menu when clicking elsewhere
    document.addEventListener('click', function() {
        startMenu.classList.remove('active');
    });
    
    // Prevent start menu from closing when clicking inside it
    startMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // App templates
    const apps = {

        explorer: {
            title: 'File Explorer',
            icon: 'https://cdn-icons-png.flaticon.com/512/732/732220.png',
            createContent: function() {
                return `
                    <div class="explorer-container">
                        <div class="explorer-nav">
                            <button class="back">← Back</button>
                            <button class="forward">Forward →</button>
                            <button class="up">↑ Up</button>
                            <div class="explorer-path">${getCurrentPath()}</div>
                        </div>
                        <div class="explorer-content">
                            ${renderExplorerContent()}
                        </div>
                    </div>
                `;
            },
            init: function(windowElement) {
                const backBtn = windowElement.querySelector('.back');
                const forwardBtn = windowElement.querySelector('.forward');
                const upBtn = windowElement.querySelector('.up');
                const contentArea = windowElement.querySelector('.explorer-content');
                
                backBtn.addEventListener('click', () => {
                    if (fileSystem.currentPath.length > 1) {
                        fileSystem.currentPath.pop();
                        contentArea.innerHTML = renderExplorerContent();
                        windowElement.querySelector('.explorer-path').textContent = getCurrentPath();
                    }
                });
                
                upBtn.addEventListener('click', () => {
                    if (fileSystem.currentPath.length > 1) {
                        fileSystem.currentPath.pop();
                        contentArea.innerHTML = renderExplorerContent();
                        windowElement.querySelector('.explorer-path').textContent = getCurrentPath();
                    }
                });
                
                // Forward button would require maintaining a navigation history
                forwardBtn.addEventListener('click', () => {
                    showNotification('Explorer', 'Forward navigation not implemented yet');
                });
                
                // Handle item clicks
                contentArea.addEventListener('click', (e) => {
                    const item = e.target.closest('.explorer-item');
                    if (item) {
                        const itemName = item.dataset.name;
                        const currentLocation = getCurrentLocation();
                        
                        if (currentLocation.children[itemName].type === 'folder') {
                            fileSystem.currentPath.push(itemName);
                            contentArea.innerHTML = renderExplorerContent();
                            windowElement.querySelector('.explorer-path').textContent = getCurrentPath();
                        } else {
                            showNotification('Explorer', `Opening ${itemName}`);
                            // In a real implementation, you would open the file with the appropriate app
                        }
                    }
                });
            }
        },
        notepad: {
            title: 'Notepad',
            icon: 'https://cdn-icons-png.flaticon.com/512/837/837548.png',
            content: '<textarea style="width:100%;height:100%;border:none;resize:none;padding:10px;font-family:monospace;"></textarea>'
        },
          
        calculator: {
            title: 'Calculator',
            icon: 'https://cdn-icons-png.flaticon.com/512/210/210426.png',
            content: `
                <div class="calculator">
                    <input type="text" class="calculator-display" readonly>
                    <div class="calculator-buttons">
                        <button>C</button>
                        <button>+/-</button>
                        <button>%</button>
                        <button>/</button>
                        <button>7</button>
                        <button>8</button>
                        <button>9</button>
                        <button>*</button>
                        <button>4</button>
                        <button>5</button>
                        <button>6</button>
                        <button>-</button>
                        <button>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>+</button>
                        <button class="span-2">0</button>
                        <button>.</button>
                        <button>=</button>
                    </div>
                </div>
            `,
            init: function(windowElement) {
                const display = windowElement.querySelector('.calculator-display');
                const buttons = windowElement.querySelectorAll('.calculator-buttons button');
                
                let currentInput = '0';
                let previousInput = '';
                let operation = null;
                let resetInput = false;
                
                function updateDisplay() {
                    display.value = currentInput;
                }
                
                buttons.forEach(button => {
                    button.addEventListener('click', () => {
                        const value = button.textContent;
                        
                        if (value >= '0' && value <= '9') {
                            if (currentInput === '0' || resetInput) {
                                currentInput = value;
                                resetInput = false;
                            } else {
                                currentInput += value;
                            }
                        } else if (value === '.') {
                            if (!currentInput.includes('.')) {
                                currentInput += '.';
                            }
                        } else if (value === 'C') {
                            currentInput = '0';
                            previousInput = '';
                            operation = null;
                        } else if (value === '+/-') {
                            currentInput = (parseFloat(currentInput) * -1).toString();
                        } else if (value === '%') {
                            currentInput = (parseFloat(currentInput) / 100).toString();
                        } else if (['+', '-', '*', '/'].includes(value)) {
                            if (operation !== null) calculate();
                            previousInput = currentInput;
                            operation = value;
                            resetInput = true;
                        } else if (value === '=') {
                            calculate();
                        }
                        
                        updateDisplay();
                    });
                });
                
                function calculate() {
                    let result;
                    const prev = parseFloat(previousInput);
                    const current = parseFloat(currentInput);
                    
                    if (isNaN(prev) || isNaN(current)) return;
                    
                    switch (operation) {
                        case '+':
                            result = prev + current;
                            break;
                        case '-':
                            result = prev - current;
                            break;
                        case '*':
                            result = prev * current;
                            break;
                        case '/':
                            result = prev / current;
                            break;
                        default:
                            return;
                    }
                    
                    currentInput = result.toString();
                    operation = null;
                    resetInput = true;
                }
                
                updateDisplay();
            }
        },
        paint: {
            title: 'Paint',
            icon: 'https://cdn-icons-png.flaticon.com/512/2819/2819194.png',
            content: `
                <div class="canvas-container">
                    <div class="canvas-tools">
                        <button class="tool-pencil active" data-tool="pencil">✏️ Pencil</button>
                        <button class="tool-brush" data-tool="brush">🖌️ Brush</button>
                        <button class="tool-eraser" data-tool="eraser">🧽 Eraser</button>
                        <div class="color-picker">
                            <span>Color:</span>
                            <input type="color" value="#000000">
                        </div>
                        <button class="clear-canvas">Clear</button>
                    </div>
                    <div class="canvas-wrapper">
                        <canvas id="paintCanvas"></canvas>
                    </div>
                </div>
            `,
            init: function(windowElement) {
                const canvas = windowElement.querySelector('#paintCanvas');
                const ctx = canvas.getContext('2d');
                const toolButtons = windowElement.querySelectorAll('[data-tool]');
                const colorPicker = windowElement.querySelector('input[type="color"]');
                const clearButton = windowElement.querySelector('.clear-canvas');
                
                // Set canvas size
                function resizeCanvas() {
                    const container = windowElement.querySelector('.canvas-wrapper');
                    canvas.width = container.clientWidth;
                    canvas.height = container.clientHeight;
                    
                    // Redraw content if needed
                    if (!canvas.isEmpty) {
                        // In a real app, you would redraw the saved drawing
                    }
                }
                
                // Initial resize
                resizeCanvas();
                
                // Handle window resize
                new ResizeObserver(resizeCanvas).observe(windowElement.querySelector('.canvas-wrapper'));
                
                // Drawing variables
                let isDrawing = false;
                let currentTool = 'pencil';
                let currentColor = '#000000';
                let lineWidth = 2;
                
                // Set active tool
                function setActiveTool(tool) {
                    currentTool = tool;
                    toolButtons.forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.tool === tool);
                    });
                    
                    switch (tool) {
                        case 'pencil':
                            lineWidth = 2;
                            break;
                        case 'brush':
                            lineWidth = 5;
                            break;
                        case 'eraser':
                            lineWidth = 10;
                            currentColor = '#ffffff';
                            break;
                    }
                }
                
                // Tool button events
                toolButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        setActiveTool(button.dataset.tool);
                    });
                });
                
                // Color picker event
                colorPicker.addEventListener('input', (e) => {
                    currentColor = e.target.value;
                });
                
                // Clear canvas
                clearButton.addEventListener('click', () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                });
                
                // Drawing events
                canvas.addEventListener('mousedown', startDrawing);
                canvas.addEventListener('mousemove', draw);
                canvas.addEventListener('mouseup', stopDrawing);
                canvas.addEventListener('mouseout', stopDrawing);
                
                function startDrawing(e) {
                    isDrawing = true;
                    draw(e);
                }
                
                function draw(e) {
                    if (!isDrawing) return;
                    
                    ctx.lineWidth = lineWidth;
                    ctx.lineCap = 'round';
                    ctx.strokeStyle = currentColor;
                    
                    // Get mouse position
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    if (ctx.lastX === undefined) {
                        ctx.lastX = x;
                        ctx.lastY = y;
                    }
                    
                    ctx.beginPath();
                    ctx.moveTo(ctx.lastX, ctx.lastY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    
                    ctx.lastX = x;
                    ctx.lastY = y;
                }
                
                function stopDrawing() {
                    isDrawing = false;
                    ctx.lastX = undefined;
                    ctx.lastY = undefined;
                }
                
                // Mark canvas as not empty when drawing starts
                canvas.isEmpty = true;
                canvas.addEventListener('mousedown', () => {
                    canvas.isEmpty = false;
                });
            }
        },
        browser: {
            title: 'Web Browser',
            icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
            content: `
                <div class="browser-container">
                    <div class="browser-nav">
                        <button class="browser-back">←</button>
                        <button class="browser-forward">→</button>
                        <button class="browser-refresh">↻</button>
                        <input type="text" class="browser-url" value="https://www.example.com">
                        <button class="browser-go">Go</button>
                    </div>
                    <iframe class="browser-content" src="https://www.example.com"></iframe>
                </div>
            `,
            init: function(windowElement) {
                const backBtn = windowElement.querySelector('.browser-back');
                const forwardBtn = windowElement.querySelector('.browser-forward');
                const refreshBtn = windowElement.querySelector('.browser-refresh');
                const urlInput = windowElement.querySelector('.browser-url');
                const goBtn = windowElement.querySelector('.browser-go');
                const iframe = windowElement.querySelector('.browser-content');
                
                // Navigation functions
                function goToUrl(url) {
                    try {
                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            url = 'https://' + url;
                        }
                        iframe.src = url;
                        urlInput.value = url;
                    } catch (e) {
                        showNotification('Browser', 'Invalid URL');
                    }
                }
                
                // Event listeners
                goBtn.addEventListener('click', () => goToUrl(urlInput.value));
                urlInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') goToUrl(urlInput.value);
                });
                
                backBtn.addEventListener('click', () => {
                    showNotification('Browser', 'Back button clicked');
                    // In a real implementation, you would use iframe.contentWindow.history.back()
                });
                
                forwardBtn.addEventListener('click', () => {
                    showNotification('Browser', 'Forward button clicked');
                    // In a real implementation, you would use iframe.contentWindow.history.forward()
                });
                
                refreshBtn.addEventListener('click', () => {
                    iframe.src = iframe.src;
                });
                
                // Update URL when iframe navigates
                iframe.addEventListener('load', () => {
                    try {
                        // For same-origin iframes, we can get the URL
                        urlInput.value = iframe.contentWindow.location.href;
                    } catch (e) {
                        // Cross-origin iframe - can't access location
                    }
                });
            }
        },
        media: {
            title: 'Media Player',
            icon: 'https://cdn-icons-png.flaticon.com/512/3106/3106921.png',
            content: `
                <div class="media-container">
                    <div class="media-display">
                        <p>Media Player</p>
                    </div>
                    <div class="media-controls">
                        <button class="media-play">▶️</button>
                        <button class="media-pause">⏸️</button>
                        <button class="media-stop">⏹️</button>
                    </div>
                </div>
            `,
            init: function(windowElement) {
                const playBtn = windowElement.querySelector('.media-play');
                const pauseBtn = windowElement.querySelector('.media-pause');
                const stopBtn = windowElement.querySelector('.media-stop');
                const display = windowElement.querySelector('.media-display');
                
                let audio = null;
                
                playBtn.addEventListener('click', () => {
                    if (!audio) {
                        audio = new Audio("https://soundcloud.com/eminemofficial/mockingbird?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing");
                        audio.play();
                        display.innerHTML = '<p>Now playing: Sample Song</p>';
                    } else {
                        audio.play();
                    }
                });
                
                pauseBtn.addEventListener('click', () => {
                    if (audio) {
                        audio.pause();
                    }
                });
                
                stopBtn.addEventListener('click', () => {
                    if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                        display.innerHTML = '<p>Media Player</p>';
                    }
                });
            }
        },
        settings: {
            title: 'Settings',
            icon: 'https://cdn-icons-png.flaticon.com/512/2092/2092653.png',
            content: `
                <div class="settings-container">
                    <div class="settings-sidebar">
                        <div class="settings-sidebar-item active" data-tab="personalization">Personalization</div>
                        <div class="settings-sidebar-item" data-tab="system">System</div>
                        <div class="settings-sidebar-item" data-tab="about">About</div>
                    </div>
                    <div class="settings-content">
                        <div class="settings-tab active" data-tab="personalization">
                            <h2>Personalization</h2>
                            <h3>Wallpaper</h3>
                            <div class="wallpaper-grid">
                                ${wallpapers.map((wp, i) => `
                                    <div class="wallpaper-item ${i === 0 ? 'selected' : ''}" 
                                         data-url="${wp.url}" 
                                         style="background-image: url('${wp.url}')"
                                         title="${wp.name}">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="settings-tab" data-tab="system">
                            <h2>System Settings</h2>
                            <p>System settings would go here</p>
                        </div>
                        <div class="settings-tab" data-tab="about">
                            <h2>About WebOS</h2>
                            <p>This is a web-based operating system demo built with HTML, CSS, and JavaScript.</p>
                            <p>Version 1.0</p>
                        </div>
                    </div>
                </div>
            `,
            init: function(windowElement) {
                const sidebarItems = windowElement.querySelectorAll('.settings-sidebar-item');
                const tabs = windowElement.querySelectorAll('.settings-tab');
                const wallpaperItems = windowElement.querySelectorAll('.wallpaper-item');
                
                // Tab switching
                sidebarItems.forEach(item => {
                    item.addEventListener('click', () => {
                        const tabName = item.dataset.tab;
                        
                        // Update sidebar
                        sidebarItems.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                        
                        // Update tabs
                        tabs.forEach(tab => tab.classList.remove('active'));
                        windowElement.querySelector(`.settings-tab[data-tab="${tabName}"]`).classList.add('active');
                    });
                });
                
                // Wallpaper selection
                wallpaperItems.forEach(item => {
                    item.addEventListener('click', () => {
                        wallpaperItems.forEach(i => i.classList.remove('selected'));
                        item.classList.add('selected');
                        
                        const newWallpaper = item.dataset.url;
                        document.body.style.backgroundImage = `url('${newWallpaper}')`;
                        showNotification('Settings', 'Wallpaper changed');
                    });
                });
            }
        }
    };
    
    // Helper functions for file explorer
    function getCurrentLocation() {
        let location = fileSystem.root;
        for (const path of fileSystem.currentPath.slice(1)) {
            location = location.children[path];
        }
        return location;
    }
    
    function getCurrentPath() {
        return fileSystem.currentPath.map(p => {
            if (p === 'root') return 'This PC';
            return fileSystem.root.children[p]?.name || p;
        }).join(' > ');
    }
    
    function renderExplorerContent() {
        const location = getCurrentLocation();
        if (!location.children) return '';
        
        return Object.entries(location.children).map(([key, item]) => {
            let icon;
            switch (item.type) {
                case 'folder':
                    icon = 'https://cdn-icons-png.flaticon.com/512/732/732220.png';
                    break;
                case 'image':
                    icon = 'https://cdn-icons-png.flaticon.com/512/2965/2965300.png';
                    break;
                case 'audio':
                    icon = 'https://cdn-icons-png.flaticon.com/512/3106/3106921.png';
                    break;
                default:
                    icon = 'https://cdn-icons-png.flaticon.com/512/2965/2965278.png';
            }
            
            return `
                <div class="explorer-item" data-name="${key}">
                    <img src="${icon}" alt="${item.type}">
                    <span>${item.name}</span>
                </div>
            `;
        }).join('');
    }
    
    // Create window function
    function createWindow(appId) {
        const app = apps[appId];
        if (!app) return;
        
        // Check if window already exists
        const existingWindow = document.querySelector(`.window[data-app="${appId}"]`);
        if (existingWindow) {
            existingWindow.style.display = 'flex';
            bringToFront(existingWindow);
            return;
        }
        
        const windowElement = document.createElement('div');
        windowElement.className = 'window';
        windowElement.dataset.app = appId;
        
        // Set content based on whether the app has a createContent function
        const content = app.createContent ? app.createContent() : app.content;
        
        windowElement.innerHTML = `
            <div class="window-header">
                <div class="window-title">${app.title}</div>
                <div class="window-controls">
                    <button class="minimize">_</button>
                    <button class="maximize">□</button>
                    <button class="close">X</button>
                </div>
            </div>
            <div class="window-content">${content}</div>
        `;
        
        windowsContainer.appendChild(windowElement);
        
        // Position window randomly but within viewport
        const maxLeft = window.innerWidth - 500;
        const maxTop = window.innerHeight - 440; // 400 height + 40 taskbar
        windowElement.style.left = `${Math.min(Math.max(0, Math.random() * maxLeft), maxLeft)}px`;
        windowElement.style.top = `${Math.min(Math.max(0, Math.random() * maxTop), maxTop)}px`;
        
        // Make window draggable
        makeDraggable(windowElement);
        
        // Window controls
        const minimizeBtn = windowElement.querySelector('.minimize');
        const maximizeBtn = windowElement.querySelector('.maximize');
        const closeBtn = windowElement.querySelector('.close');
        
        minimizeBtn.addEventListener('click', () => {
            windowElement.style.display = 'none';
        });
        
        maximizeBtn.addEventListener('click', () => {
            if (windowElement.style.width === '100%') {
                windowElement.style.width = '500px';
                windowElement.style.height = '400px';
                windowElement.style.top = '';
                windowElement.style.left = '';
            } else {
                windowElement.style.width = '100%';
                windowElement.style.height = 'calc(100% - 40px)';
                windowElement.style.top = '0';
                windowElement.style.left = '0';
            }
        });
        
        closeBtn.addEventListener('click', () => {
            windowsContainer.removeChild(windowElement);
            const taskbarIcon = document.querySelector(`.taskbar-icon[data-app="${appId}"]`);
            if (taskbarIcon) {
                taskbarIcons.removeChild(taskbarIcon);
            }
        });
        
        // Add to taskbar
        const taskbarIcon = document.createElement('div');
        taskbarIcon.className = 'taskbar-icon';
        taskbarIcon.dataset.app = appId;
        taskbarIcon.innerHTML = `<img src="${app.icon}" alt="${app.title}" width="10">`;
        taskbarIcon.addEventListener('click', () => {
            if (windowElement.style.display === 'none') {
                windowElement.style.display = 'flex';
                bringToFront(windowElement);
            } else {
                windowElement.style.display = 'none';
            }
        });
        taskbarIcons.appendChild(taskbarIcon);
        
        // Bring window to front when clicked
        windowElement.addEventListener('mousedown', () => {
            bringToFront(windowElement);
        });
        
        // Initialize app-specific functionality
        if (app.init) {
            app.init(windowElement);
        }
    }
    
    // Make elements draggable with snapping
    function makeDraggable(element) {
        const header = element.querySelector('.window-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let snapGuide = null;
        
        header.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Bring to front when dragging
            bringToFront(element);
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            
            // Create snap guide
            snapGuide = document.createElement('div');
            snapGuide.className = 'snap-guide';
            document.body.appendChild(snapGuide);
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Calculate new position
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            
            // Check for snapping
            let snapPosition = checkSnapPosition(newLeft, newTop, element.offsetWidth, element.offsetHeight);
            
            if (snapPosition) {
                // Show snap guide
                snapGuide.style.display = 'block';
                snapGuide.className = `snap-guide ${snapPosition}`;
                
                // Adjust position based on snap
                switch (snapPosition) {
                    case 'left':
                        newLeft = 0;
                        element.style.width = '50%';
                        element.style.height = '100%';
                        break;
                    case 'right':
                        newLeft = window.innerWidth / 2;
                        element.style.width = '50%';
                        element.style.height = '100%';
                        break;
                    case 'top':
                        newTop = 0;
                        element.style.width = '100%';
                        element.style.height = '50%';
                        break;
                    case 'bottom':
                        newTop = window.innerHeight / 2;
                        element.style.width = '100%';
                        element.style.height = '50%';
                        break;
                    case 'full':
                        newTop = 0;
                        newLeft = 0;
                        element.style.width = '100%';
                        element.style.height = '100%';
                        break;
                }
            } else {
                // Hide snap guide if not snapping
                snapGuide.style.display = 'none';
                
                // Restore original size if not snapping
                if (element.style.width === '50%' || element.style.width === '100%') {
                    element.style.width = '500px';
                    element.style.height = '400px';
                }
            }
            
            // Set the element's new position
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }
        
        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
            
            // Remove snap guide
            if (snapGuide && snapGuide.parentNode) {
                snapGuide.parentNode.removeChild(snapGuide);
            }
        }
    }
    
    // Check if window should snap to edges
    function checkSnapPosition(left, top, width, height) {
        const snapThreshold = 20;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Check left edge
        if (Math.abs(left) < snapThreshold) {
            return 'left';
        }
        
        // Check right edge
        if (Math.abs(left + width - windowWidth) < snapThreshold) {
            return 'right';
        }
        
        // Check top edge
        if (Math.abs(top) < snapThreshold) {
            return 'top';
        }
        
        // Check bottom edge
        if (Math.abs(top + height - windowHeight) < snapThreshold) {
            return 'bottom';
        }
        
        // Check top-left corner (for full screen)
        if (Math.abs(left) < snapThreshold && Math.abs(top) < snapThreshold) {
            return 'full';
        }
        
        return null;
    }
    
    // Bring window to front
    function bringToFront(element) {
        const windows = document.querySelectorAll('.window');
        let highestZ = 0;
        
        windows.forEach(window => {
            const z = parseInt(window.style.zIndex || '0');
            if (z > highestZ) highestZ = z;
        });
        
        element.style.zIndex = highestZ + 1;
    }
    
    // Desktop icons drag and drop
    desktopIcons.forEach(icon => {
        icon.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.app);
            this.style.opacity = '0.5';
        });
        
        icon.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
    });
    
    desktop.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    desktop.addEventListener('drop', function(e) {
        e.preventDefault();
        const appId = e.dataTransfer.getData('text/plain');
        if (appId) {
            const icon = document.querySelector(`.icon[data-app="${appId}"]`);
            if (icon) {
                icon.style.left = (e.clientX - 40) + 'px';
                icon.style.top = (e.clientY - 40) + 'px';
            }
        }
    });
    
    // Open apps from start menu
    appItems.forEach(item => {
        item.addEventListener('click', function() {
            const appId = this.dataset.app;
            createWindow(appId);
            startMenu.classList.remove('active');
        });
    });
    
    // Open apps from desktop icons (double click)
    desktopIcons.forEach(icon => {
        icon.addEventListener('dblclick', function() {
            const appId = this.dataset.app;
            createWindow(appId);
        });
    });
    
    // Context menu
    function showContextMenu(x, y) {
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        bringToFront(contextMenu);
    }
    
    function hideContextMenu() {
        contextMenu.style.display = 'none';
    }
    
    desktop.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY);
    });
    
    document.addEventListener('click', function() {
        hideContextMenu();
    });
    
    contextMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Context menu actions
    document.querySelectorAll('.context-item').forEach(item => {
        item.addEventListener('click', function() {
            const action = this.dataset.action;
            switch (action) {
                case 'refresh':
                    showNotification('System', 'Desktop refreshed');
                    break;
                case 'new-folder':
                    showNotification('System', 'New folder created');
                    break;
                case 'settings':
                    createWindow('settings');
                    break;
                case 'about':
                    createWindow('settings');
                    // Switch to about tab
                    setTimeout(() => {
                        document.querySelector('.settings-sidebar-item[data-tab="about"]').click();
                    }, 100);
                    break;
            }
            hideContextMenu();
        });
    });
    
    // Notification system
    function showNotification(title, message) {
        const id = Date.now();
        const notification = {
            id,
            title,
            message,
            time: new Date()
        };
        
        notifications.unshift(notification);
        updateNotificationCenter();
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notifications = notifications.filter(n => n.id !== id);
            updateNotificationCenter();
        }, 5000);
    }
    
    function updateNotificationCenter() {
        notificationList.innerHTML = notifications.map(notification => `
            <div class="notification">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time.toLocaleTimeString()}</div>
            </div>
        `).join('');
    }
    
    notificationIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationCenter.style.display = notificationCenter.style.display === 'flex' ? 'none' : 'flex';
        startMenu.classList.remove('active');
        hideContextMenu();
    });
    
    clearAllBtn.addEventListener('click', function() {
        notifications = [];
        updateNotificationCenter();
    });
    
    document.addEventListener('click', function() {
        notificationCenter.style.display = 'none';
    });
    
    notificationCenter.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Initialize notification center
    updateNotificationCenter();
    
    // Show welcome notification after a delay
    setTimeout(() => {
        showNotification('Welcome', 'Right-click on desktop for more options');
    }, 1000);
});