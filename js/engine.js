class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.world = new World();
        this.player = new Player();
        this.camera = new Camera();

        this.currentChapter = "chapter_1";
        this.currentLevelIndex = 1;

        console.log("%c Baffique Engine v1.0 %c Initialized ", "background: #111; color: #ffd700; font-weight: bold;", "background: #ffd700; color: #000;");

        this.jumpForce = -18;
        this.keys = {};
        this.lastTime = 0;
        this.isRunning = false;
        this.paused = false;

        this.init();
        this.world.loadLevel(GAME_LEVELS[this.currentChapter][this.currentLevelIndex]);
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => {
            this.resize();
            this.camera.resize();
        });

        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        document.getElementById('start-button').addEventListener('click', () => {
            document.getElementById('start-screen').classList.add('hidden');
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame((t) => this.animate(t));
        });

        document.getElementById('close-scroll').addEventListener('click', () => {
            this.closeScroll();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        console.log(`[System] Canvas resized to ${this.canvas.width}x${this.canvas.height}`);
    }

    update(deltaTime) {
        if (this.paused) {
            // Allow closing scroll with Space or Enter
            if (this.keys['Space'] || this.keys['Enter']) {
                this.closeScroll();
            }
            return;
        }

        if (deltaTime > 100) deltaTime = 100;

        this.world.update();
        this.player.update(this.keys, deltaTime, this.world);
        this.camera.update(this.player);

        // Check hazard collection (Death)
        for (let h of this.world.hazards) {
            if (Physics.AABB(this.player, h)) {
                this.player.respawn();
            }
        }

        // Check scroll collection and update checkpoint
        for (let s of this.world.scrolls) {
            // Use larger proximity check for better collection while flying/swimming
            const dist = Math.sqrt(Math.pow((this.player.x + this.player.width / 2) - (s.x + s.width / 2), 2) +
                Math.pow((this.player.y + this.player.height / 2) - (s.y + s.height / 2), 2));

            if (!s.collected && dist < 100) {
                s.collected = true;
                this.player.scrollCount++;
                console.log(`[Engine] Scroll collected! Total: ${this.player.scrollCount}/3. Text: "${s.text.substring(0, 30)}..."`);
                this.player.checkpointX = s.x;
                this.player.checkpointY = s.y;
                this.showScroll(s);
            }
        }

        // Check level gate
        for (let g of this.world.gates) {
            if (Physics.AABB(this.player, g)) {
                this.completeLevel(g.nextLevelName);
            }
        }

        // Death check (falling deep)
        if (this.player.y > window.innerHeight + 500) {
            this.player.respawn();
        }
    }

    completeLevel(nextLevelId) {
        if (nextLevelId === "end") {
            this.isRunning = false;
            this.showMessage("Путь Завершен", "Ты обрел мудрость всех свитков этой главы.");
            return;
        }

        const nextLevel = GAME_LEVELS[this.currentChapter].find(l => l.id === nextLevelId);
        if (nextLevel) {
            console.log(`[Engine] Transitioning to level: ${nextLevelId} (${nextLevel.name})`);
            this.currentLevelIndex = GAME_LEVELS[this.currentChapter].indexOf(nextLevel);
            this.world.loadLevel(nextLevel);
            this.player.respawn();
            this.showMessage("Новый Этап", `Ты входишь в: ${nextLevel.name}`);
        }
    }

    showMessage(titleText, bodyText) {
        this.paused = true;
        const display = document.getElementById('scroll-display');
        const title = document.getElementById('fact-title');
        const text = document.getElementById('fact-text');

        title.innerText = titleText;
        title.style.color = "#FFD700";
        text.innerText = bodyText;
        display.classList.remove('hidden');
    }

    showScroll(scroll) {
        this.paused = true;
        const display = document.getElementById('scroll-display');
        const title = document.getElementById('fact-title');
        const text = document.getElementById('fact-text');

        if (scroll.isSecret) {
            title.innerText = "Тайный Осколок Истины";
            title.style.color = "#00ffff";
        } else {
            title.innerText = "Осколок Истины";
            title.style.color = "#ffffff";
        }

        text.innerText = scroll.text;
        display.classList.remove('hidden');
    }

    closeScroll() {
        this.paused = false;
        document.getElementById('scroll-display').classList.add('hidden');
        // Reset all keys that might cause movement/jumping
        this.keys['Space'] = false;
        this.keys['Enter'] = false;
        this.keys['ArrowUp'] = false;
        this.keys['KeyW'] = false;
    }

    draw() {
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#111');
        gradient.addColorStop(1, '#222');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw game elements
        this.world.draw(this.ctx, this.camera);
        this.player.draw(this.ctx, this.camera);

        // Fog layer
        this.ctx.save();
        this.ctx.globalAlpha = 0.15;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    animate(timeStamp) {
        if (!this.isRunning) return;

        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((t) => this.animate(t));
    }
}

// Start game
window.onload = () => {
    new Game();
};
