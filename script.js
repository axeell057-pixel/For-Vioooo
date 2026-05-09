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

    // Munculkan semua kertas & dekorasi secara bertahap setelah amplop mulai terbuka
    setTimeout(() => {
        const allItems = document.querySelectorAll('.paper');
        allItems.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('loaded');
                new DraggablePaper(el);
            }, index * 120); // muncul satu-satu
        });
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
