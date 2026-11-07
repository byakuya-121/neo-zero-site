// ----------------------------------------------------
// 0. SCROLL REVEAL OBSERVER ANIMATION
// ----------------------------------------------------
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.08
});

revealElements.forEach(el => revealObserver.observe(el));

// ----------------------------------------------------
// 1. FLOATING TECH TAGS PARALLAX EFFECT
// ----------------------------------------------------
const floatTags = document.querySelectorAll('.float-tag');
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

// モバイルで過剰に動かないよう調整
const isMobile = window.innerWidth < 768;

if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    function animateParallax() {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        floatTags.forEach(tag => {
            const speed = parseFloat(tag.getAttribute('data-speed')) || 1.5;
            const offsetX = targetX * speed * 20;
            const offsetY = targetY * speed * 20;
            tag.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
        });

        requestAnimationFrame(animateParallax);
    }
    animateParallax();
}

// ----------------------------------------------------
// 2. DIGITAL RAIN (MATRIX CANVAS ANIMATION)
// ----------------------------------------------------
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノ';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = [];

function initDrops() {
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
}
initDrops();
window.addEventListener('resize', initDrops);

let isMatrixActive = true;

function drawMatrix() {
    if (!isMatrixActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawMatrix);
        return;
    }

    ctx.fillStyle = 'rgba(5, 8, 17, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillStyle = Math.random() > 0.9 ? '#00e5ff' : '#00ff88';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }

    requestAnimationFrame(drawMatrix);
}
drawMatrix();

document.getElementById('matrixToggle').addEventListener('click', () => {
    isMatrixActive = !isMatrixActive;
    playBeep(440, 0.05);
    showToast(isMatrixActive ? 'Matrix Rain Activated.' : 'Matrix Rain Deactivated.', 'info');
});

// ----------------------------------------------------
// 3. WEB AUDIO API SYNTHESIZER
// ----------------------------------------------------
let audioCtx = null;
let isSoundEnabled = false;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playBeep(freq = 600, duration = 0.05, type = 'sine') {
    if (!isSoundEnabled) return;
    initAudio();
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

const soundToggleBtn = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');

soundToggleBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
        initAudio();
        soundIcon.className = 'fa-solid fa-volume-high text-cyber-green';
        playBeep(880, 0.1);
        showToast('Audio Feedback Enabled', 'success');
    } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        showToast('Audio Feedback Muted', 'info');
    }
});

// ----------------------------------------------------
// 4. CUSTOM TOAST NOTIFICATION SYSTEM
// ----------------------------------------------------
function showToast(message, type = 'info') {
    playBeep(type === 'error' ? 300 : 880, 0.08);

    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');

    let borderColor = 'border-cyber-cyan';
    let textColor = 'text-cyber-cyan';
    let icon = 'fa-circle-info';

    if (type === 'success') {
        borderColor = 'border-cyber-green';
        textColor = 'text-cyber-green';
        icon = 'fa-circle-check';
    } else if (type === 'error') {
        borderColor = 'border-cyber-magenta';
        textColor = 'text-cyber-magenta';
        icon = 'fa-triangle-exclamation';
    }

    toast.className = `px-3.5 py-2.5 rounded bg-cyber-panel border ${borderColor} text-white flex items-center space-x-2.5 shadow-2xl pointer-events-auto transition-all duration-300 opacity-0 transform translate-y-2`;
    toast.innerHTML = `<i class="fa-solid ${icon} ${textColor}"></i> <span>${escapeHTML(message)}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-2');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ----------------------------------------------------
// 5. TYPING EFFECT IN HERO
// ----------------------------------------------------
const typingPhrases = [
    "INITIALIZING SECURE HANDSHAKE...",
    "PARALLAX TECH TAGS: FLOATING...",
    "REVERSING BINARY TARGET...",
    "WHITEHAT ETHICS: VERIFIED.",
    "WELCOME TO NEO_ZERO NODE."
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingEffect');

function typeLoop() {
    const currentPhrase = typingPhrases[phraseIdx];
    if (isDeleting) {
        typingEl.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
    } else {
        typingEl.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
    }

    let typeSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIdx === currentPhrase.length) {
        typeSpeed = 2200;
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % typingPhrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeLoop, typeSpeed);
}
typeLoop();

// ----------------------------------------------------
// 6. INTERACTIVE TERMINAL LOGIC
// ----------------------------------------------------
const terminalScreen = document.getElementById('terminalScreen');
const terminalInput = document.getElementById('terminalInput');

const commands = {
    'help': 'Available commands: <span class="text-cyber-green">about</span>, <span class="text-cyber-green">skills</span>, <span class="text-cyber-green">ethics</span>, <span class="text-cyber-green">projects</span>, <span class="text-cyber-green">matrix</span>, <span class="text-cyber-green">theme [color]</span>, <span class="text-cyber-green">join</span>, <span class="text-cyber-green">clear</span>, <span class="text-cyber-green">whoami</span>, <span class="text-cyber-green">easteregg</span>',
    'about': 'NEO_ZERO is a hacker &amp; tech collective operating in LINE OpenChat under Shie Hassaikai lineage.',
    'skills': 'Tech Stack: Python, Rust, C++, Go, Docker, Assembly, Three.js, PyTorch, Ghidra, Linux eBPF.',
    'ethics': 'Code of Conduct: 1. White-Hat Only  2. Knowledge Sharing  3. Mutual Respect  4. Privacy First.',
    'projects': 'Active Ops: Project ShadowVault (Rust ZKP Storage), ZeroCTF Framework (Learning Platform).',
    'matrix': 'Toggled Matrix background animation.',
    'whoami': 'guest@neo-zero-node-01 [Role: Visitor / Security Analyst]',
    'easteregg': '⚡ ACCESS GRANTED: "The quieter you become, the more you are able to hear." — Hack The Planet!',
    'sudo': 'Permission denied: User is not in the sudoers file. This incident will be reported.'
};

terminalInput.addEventListener('keydown', (e) => {
    playBeep(650 + Math.random() * 200, 0.02);

    if (e.key === 'Enter') {
        const rawInput = terminalInput.value.trim();
        const cmd = rawInput.toLowerCase();
        
        const inputLine = document.createElement('div');
        inputLine.innerHTML = `<span class="text-cyber-green">guest@neo-zero</span><span class="text-cyber-cyan">:~$</span> ${escapeHTML(rawInput)}`;
        terminalScreen.appendChild(inputLine);

        const outputLine = document.createElement('div');
        outputLine.className = 'text-gray-300 ml-2 mb-2';

        if (cmd === 'clear') {
            terminalScreen.innerHTML = '';
        } else if (cmd.startsWith('theme ')) {
            const themeColor = cmd.split(' ')[1];
            if (['cyan', 'green', 'magenta', 'amber'].includes(themeColor)) {
                const colorMap = { cyan: '#00e5ff', green: '#00ff88', magenta: '#ff0055', amber: '#ffaa00' };
                document.documentElement.style.setProperty('--theme-accent', colorMap[themeColor]);
                document.documentElement.style.setProperty('--theme-accent-glow', colorMap[themeColor] + '40');
                outputLine.innerHTML = `Accent color changed to <span style="color:${colorMap[themeColor]}">${themeColor.toUpperCase()}</span>.`;
                showToast(`Theme switched to ${themeColor.toUpperCase()}`, 'success');
            } else {
                outputLine.innerHTML = 'Usage: theme [cyan | green | magenta | amber]';
            }
            terminalScreen.appendChild(outputLine);
        } else if (cmd === 'matrix') {
            isMatrixActive = !isMatrixActive;
            outputLine.innerHTML = commands['matrix'];
            terminalScreen.appendChild(outputLine);
        } else if (cmd === 'join') {
            openJoinModal();
            outputLine.innerHTML = 'Opening join modal window...';
            terminalScreen.appendChild(outputLine);
        } else if (commands[cmd]) {
            outputLine.innerHTML = commands[cmd];
            terminalScreen.appendChild(outputLine);
        } else if (cmd !== '') {
            outputLine.innerHTML = `<span class="text-cyber-magenta">Command not found: '${escapeHTML(cmd)}'. Type 'help' for options.</span>`;
            terminalScreen.appendChild(outputLine);
        }

        terminalInput.value = '';
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }
});

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// ----------------------------------------------------
// 7. JOIN / CONTACT MODAL HANDLERS
// ----------------------------------------------------
function openJoinModal() {
    playBeep(700, 0.06);
    document.getElementById('joinModal').classList.remove('hidden');
}

function closeJoinModal() {
    playBeep(400, 0.04);
    document.getElementById('joinModal').classList.add('hidden');
}

function simulateJoin(platform) {
    showToast(`Redirecting to ${platform} Community Server...`, 'success');
    closeJoinModal();
}

function handleContactSubmit(e) {
    e.preventDefault();
    showToast('Encrypted Packet Transmitted to NEO_ZERO Queue!', 'success');
    closeJoinModal();
}

// モバイルメニュー制御 & リンクタップで閉じる処理
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// ESCキーでモーダル閉じる
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeJoinModal();
    }
});