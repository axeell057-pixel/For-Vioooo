/* ============================================
   DRAGGABLE PAPER
   ============================================ */

let currentPaperZ = 100;
const paperSfx = document.getElementById('sfx-paper');
const openSfx  = document.getElementById('sfx-open');

class DraggablePaper {
    constructor(el) {
        this.el       = el;
        this.isDragging = false;
        this.posX     = 0;
        this.posY     = 0;
        this.rotation = Math.random() * 14 - 7; // -7 s/d +7 derajat
        this.init();
    }

    init() {
        this.el.style.transform = `rotate(${this.rotation}deg)`;

        const onStart = (e) => {
            // Kartu pinned (fixed-layer) tidak bisa digeser
            if (this.el.classList.contains('fixed-layer')) return;

            this.isDragging = true;

            // z index
            if (this.el.classList.contains('paper-layer')) {
                this.el.style.zIndex = currentPaperZ++;
            }

            // Suara kertas
            paperSfx.currentTime = 0;
            paperSfx.play();

            const { clientX, clientY } = this.getCoords(e);
            this.startX = clientX - this.posX;
            this.startY = clientY - this.posY;
            this.el.style.transition = 'none';
        };

        const onMove = (e) => {
            if (!this.isDragging) return;

            const { clientX, clientY } = this.getCoords(e);
            this.posX = clientX - this.startX;
            this.posY = clientY - this.startY;
            this.el.style.transform =
                `translate(${this.posX}px, ${this.posY}px) rotate(${this.rotation}deg) scale(1.05)`;
        };

        const onEnd = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            this.el.style.transform =
                `translate(${this.posX}px, ${this.posY}px) rotate(${this.rotation}deg) scale(1)`;
        };

        // Mouse events
        this.el.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        // Touch events
        this.el.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onEnd);
    }

    // Helper ambil koordinat dari mouse atau touch
    getCoords(e) {
        if (e.touches && e.touches.length > 0) {
            return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
        }
        return { clientX: e.clientX, clientY: e.clientY };
    }
}


/* ============================================
   BUKA AMPLOP
   ============================================ */
function openEnvelope() {
    openSfx.play();

    const wrapper = document.getElementById('envelope-wrapper');
    wrapper.classList.add('open');
    startPetals();

    // Munculkan semua kertas & dekorasi secara bertahap setelah amplop mulai terbuka
    setTimeout(() => {
        const allItems = document.querySelectorAll('.paper');
        allItems.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('loaded');
                new DraggablePaper(el);
            }, index * 120); // muncul satu-satu
        });
       setTimeout(() => {
                document.getElementById('vault-btn').classList.add('visible');
            }, allItems.length * 120 + 400);
    }, 600);
}


/* ============================================
   MUSIC PLAYER
   ============================================ */
function togglePlay() {
    const audio  = document.getElementById('myAudio');
    const player = document.getElementById('musicPlayer');
    const btn    = document.getElementById('playBtn');

    if (audio.paused) {
        audio.play();
        player.classList.add('playing');
        btn.textContent = '⏸';
    } else {
        audio.pause();
        player.classList.remove('playing');
        btn.textContent = '▶';
    }
}

// Loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hide');
    }, 1800);
});

// Petals jatuh (mulai setelah amplop dibuka)
function startPetals() {
    const petals = ['🌸', '🌷', '✿', '❀'];
    function spawnPetal() {
        const p = document.createElement('div');
        p.classList.add('petal');
        p.textContent = petals[Math.floor(Math.random() * petals.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = '-40px';
        p.style.fontSize = (0.7 + Math.random() * 0.8) + 'rem';
        const dur = 7 + Math.random() * 8;
        p.style.animationDuration = dur + 's';
        p.style.animationDelay = Math.random() * 3 + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), (dur + 4) * 1000);
    }
    setInterval(spawnPetal, 1000);
    for (let i = 0; i < 5; i++) spawnPetal();
}
// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hide');
    }, 1800);
});

// Petals
function startPetals() {
    const petals = ['🌸', '🌷', '✿', '❀'];
    function spawnPetal() {
        const p = document.createElement('div');
        p.classList.add('petal');
        p.textContent = petals[Math.floor(Math.random() * petals.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.fontSize = (0.7 + Math.random() * 0.8) + 'rem';
        const dur = 7 + Math.random() * 8;
        p.style.animationDuration = dur + 's';
        p.style.animationDelay = Math.random() * 3 + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), (dur + 4) * 1000);
    }
    setInterval(spawnPetal, 1000);
    for (let i = 0; i < 5; i++) spawnPetal();
}

// Memory Vault
const PASSWORD = "160326";

function openVault() {
    document.getElementById('vault-overlay').classList.add('open');
    document.getElementById('vault-password-screen').style.display = 'flex';
    document.getElementById('vault-content').classList.remove('show');
    document.getElementById('vault-input').value = '';
    document.getElementById('vault-error').textContent = '';
    document.getElementById('vault-overlay').querySelector('.vault-lock-icon').textContent = '🔒';
    setTimeout(() => document.getElementById('vault-input').focus(), 300);
}

function closeVault() {
    document.getElementById('vault-overlay').classList.remove('open');
    document.getElementById('vault-password-screen').style.display = 'flex';
    document.getElementById('vault-content').classList.remove('show');
    document.getElementById('vault-input').value = '';
    document.getElementById('vault-error').textContent = '';
    document.getElementById('vault-overlay').querySelector('.vault-lock-icon').textContent = '🔒';
}

function checkPassword() {
    const input = document.getElementById('vault-input').value;
    const error = document.getElementById('vault-error');
    if (input === PASSWORD) {
        document.getElementById('vault-password-screen').style.display = 'none';
        document.getElementById('vault-content').classList.add('show');
        document.getElementById('vault-overlay').querySelector('.vault-lock-icon').textContent = '🔓';
    } else {
        error.textContent = 'kode salah, coba lagi. 🌸';
        document.getElementById('vault-input').value = '';
        document.getElementById('vault-input').focus();
    }
}

function togglePreview() {
    const container = document.querySelector('.container');
    const btn = document.getElementById('preview-btn');

    container.classList.toggle('preview-mode');

    if (container.classList.contains('preview-mode')) {
        btn.textContent = 'read';
    } else {
        btn.textContent = 'preview';
    }
}
