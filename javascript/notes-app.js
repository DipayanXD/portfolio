
// notes-app.js - Advanced Control Panel Logic
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // --- State & Elements ---
    const toolbar = document.querySelector('.note-glass-toolbar');
    const editor = document.getElementById('note-editor-content');

    // --- Popover System ---
    const createPopover = (triggerBtn, contentHtml) => {
        // Close existing popovers
        document.querySelectorAll('.note-popover').forEach(p => p.remove());

        const popover = document.createElement('div');
        popover.className = 'note-popover open';
        popover.innerHTML = contentHtml;

        // Position logic
        const rect = triggerBtn.getBoundingClientRect();
        // Since toolbar is absolute/fixed relative to window (in .note), and popover is absolute
        // We probably need to append to toolbar or body. Appending to body is safer for z-index
        document.body.appendChild(popover);

        popover.style.top = `${rect.bottom + 8}px`;
        popover.style.left = `${rect.left}px`;

        // Close on click outside
        const closeHandler = (e) => {
            if (!popover.contains(e.target) && !triggerBtn.contains(e.target)) {
                popover.remove();
                document.removeEventListener('mousedown', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('mousedown', closeHandler), 0);
        return popover;
    };

    // --- Text Formatting Logic ---
    const formatBtn = document.getElementById('btn-text-format');
    if (formatBtn) {
        formatBtn.addEventListener('click', () => {
            const html = `
                <div class="note-popover-item" onclick="document.execCommand('bold', false, null)">
                    <i data-lucide="bold" style="width:14px; margin-right:8px;"></i> Bold
                </div>
                <div class="note-popover-item" onclick="document.execCommand('italic', false, null)">
                    <i data-lucide="italic" style="width:14px; margin-right:8px;"></i> Italic
                </div>
                <div class="note-popover-item" onclick="document.execCommand('underline', false, null)">
                    <i data-lucide="underline" style="width:14px; margin-right:8px;"></i> Underline
                </div>
                <div class="note-divider"></div>
                <div class="note-popover-item" onclick="document.execCommand('formatBlock', false, '<h2>')">
                    <span style="font-weight:700; font-size:16px;">Aa</span> &nbsp; Heading
                </div>
                <div class="note-popover-item" onclick="document.execCommand('formatBlock', false, '<div>')">
                   <span style="font-size:12px;">Aa</span> &nbsp; Body
                </div>
            `;
            const p = createPopover(formatBtn, html);
            if (window.lucide) window.lucide.createIcons({ root: p });
        });
    }

    // --- Checklist Logic ---
    const checklistBtn = document.getElementById('btn-checklist');
    if (checklistBtn) {
        checklistBtn.addEventListener('click', () => {
            const id = Date.now();
            const checkbox = `<div style="display:flex; align-items:center; margin: 4px 0;">
                <input type="checkbox" id="ck-${id}" style="margin-right:8px;"> 
                <span contenteditable="true">List Item</span>
            </div>`;
            document.execCommand('insertHTML', false, checkbox);
        });
    }

    // --- Table Logic ---
    const tableBtn = document.getElementById('btn-table');
    if (tableBtn) {
        tableBtn.addEventListener('click', () => {
            const table = `
             <table style="width:100%; border-collapse: collapse; margin: 10px 0; border: 1px solid rgba(255,255,255,0.2);">
                <tr>
                    <td style="border: 1px solid rgba(255,255,255,0.2); padding: 8px;">Cell 1</td>
                    <td style="border: 1px solid rgba(255,255,255,0.2); padding: 8px;">Cell 2</td>
                </tr>
                <tr>
                    <td style="border: 1px solid rgba(255,255,255,0.2); padding: 8px;">Cell 3</td>
                    <td style="border: 1px solid rgba(255,255,255,0.2); padding: 8px;">Cell 4</td>
                </tr>
             </table>
             <br>`;
            document.execCommand('insertHTML', false, table);
        });
    }

    // --- Audio Recording Simulation ---
    const audioBtn = document.getElementById('btn-audio');
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            if (audioBtn.classList.contains('recording')) {
                audioBtn.classList.remove('recording');
                audioBtn.style.color = 'inherit';
                // Insert "Audio File"
                const audioStub = `
                 <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; margin: 10px 0;">
                    <div style="width: 30px; height: 30px; background: #DAA520; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </div>
                    <div>
                        <div style="font-size: 12px; font-weight: 600;">Voice Note 1</div>
                        <div style="font-size: 10px; opacity: 0.7;">00:15</div>
                    </div>
                 </div><br>
                 `;
                document.execCommand('insertHTML', false, audioStub);
            } else {
                audioBtn.classList.add('recording');
                audioBtn.style.color = '#ff5f56'; // Red for recording
                // Maybe show a waveform popover?
                const html = `
                    <div class="audio-wave-container">
                        <div class="audio-bar" style="animation-duration: 0.5s"></div>
                        <div class="audio-bar" style="animation-duration: 0.7s"></div>
                        <div class="audio-bar" style="animation-duration: 0.4s"></div>
                        <div class="audio-bar" style="animation-duration: 0.9s"></div>
                        <div class="audio-bar" style="animation-duration: 0.6s"></div>
                    </div>
                    <div style="text-align:center; font-size:10px; margin-top:4px; color:#ff5f56;">Recording...</div>
                 `;
                createPopover(audioBtn, html);
            }
        });
    }

    // --- Toggle Sidebar (Layout) ---
    const sidebarToggle = document.getElementById('btn-sidebar-toggle');
    const sidebar = document.querySelector('.note-sidebar');
    const listPane = document.querySelector('.note-list-pane');

    if (sidebarToggle && sidebar && listPane) { // Include listPane to check layout
        sidebarToggle.addEventListener('click', () => {
            if (sidebar.style.display === 'none') {
                sidebar.style.display = 'flex';
                sidebarToggle.classList.add('active'); // Actually typically toggles OFF state
            } else {
                sidebar.style.display = 'none';
                sidebarToggle.classList.remove('active');
            }
        });
    }

    // --- View Toggle ---
    const listBtn = document.getElementById('btn-view-list');
    const gridBtn = document.getElementById('btn-view-grid');

    const setView = (view) => {
        if (listBtn && gridBtn) {
            if (view === 'list') {
                listBtn.classList.add('active');
                listBtn.style.color = '#fff';
                gridBtn.classList.remove('active');
                gridBtn.style.color = 'inherit';
            } else {
                gridBtn.classList.add('active');
                gridBtn.style.color = '#fff';
                listBtn.classList.remove('active');
                listBtn.style.color = 'inherit';
            }
        }
    };

    if (listBtn && gridBtn) {
        // Init default
        setView('list');

        listBtn.addEventListener('click', () => setView('list'));
        gridBtn.addEventListener('click', () => setView('grid'));
    }

    // --- Search Toggle ---
    const searchBtn = document.getElementById('btn-search-notes');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchBtn.classList.toggle('active');
            // Focus search input if implemented
            // For now, toggle a visual state
        });
    }

    // --- Lock Note ---
    const lockBtn = document.getElementById('btn-lock');
    if (lockBtn) {
        lockBtn.addEventListener('click', () => {
            lockBtn.classList.toggle('active');
            const isLocked = lockBtn.classList.contains('active');
            if (isLocked) {
                editor.style.filter = "blur(5px)";
                editor.setAttribute('contenteditable', 'false');
                lockBtn.querySelector('i').setAttribute('data-lucide', 'lock');
            } else {
                editor.style.filter = "none";
                editor.setAttribute('contenteditable', 'true');
                lockBtn.querySelector('i').setAttribute('data-lucide', 'unlock');
            }
            if (window.lucide) window.lucide.createIcons({ root: lockBtn });
        });
    }

    // --- Share Popover ---
    const shareBtn = document.getElementById('btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const html = `
                <div class="note-popover-item">
                    <i data-lucide="mail" style="width:14px; margin-right:8px;"></i> Email
                </div>
                <div class="note-popover-item">
                    <i data-lucide="message-circle" style="width:14px; margin-right:8px;"></i> Message
                </div>
                <div class="note-divider"></div>
                <div class="note-popover-item">
                    <i data-lucide="link" style="width:14px; margin-right:8px;"></i> Copy Link
                </div>
            `;
            const p = createPopover(shareBtn, html);
            if (window.lucide) window.lucide.createIcons({ root: p });
        });
    }

});
