class Player {
    constructor() {
        this.x = 100;
        this.y = 500;
        this.width = 100;
        this.height = 150;
        this.velX = 0;
        this.velY = 0;
        this.speed = 0.5;
        this.jumpForce = -15;
        this.gravity = 0.6;
        this.friction = 0.9;
        this.grounded = false;

        this.sprite = new Image();
        this.sprite.src = './assets/baffik.png';
        this.ready = false;
        this.sprite.onload = () => this.ready = true;
    }

    update(keys, deltaTime, world) {
        if (keys['ArrowLeft'] || keys['KeyA']) this.velX -= this.speed;
        if (keys['ArrowRight'] || keys['KeyD']) this.velX += this.speed;
        if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && this.grounded) {
            this.velY = this.jumpForce;
            this.grounded = false;
        }

        this.velX *= this.friction;
        this.velY += this.gravity;

        this.x += this.velX;
        this.y += this.velY;

        // Collision with world platforms
        world.checkCollision(this);

        // Ground level fallback
        const groundLevel = window.innerHeight - 150;
        if (this.y > groundLevel) {
            this.y = groundLevel;
            this.velY = 0;
            this.grounded = true;
        }

        if (this.x < 0) this.x = 0;
        if (this.x > window.innerWidth - this.width) this.x = window.innerWidth - this.width;
    }

    draw(ctx) {
        if (!this.ready) return;
        this.drawSoulLight(ctx);

        ctx.save();
        if (this.velX < -0.1) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }

    drawSoulLight(ctx) {
        const headX = this.x + this.width / 2;
        const headY = this.y + 40;
        
        const gradient = ctx.createRadialGradient(headX, headY, 10, headX, headY, 300);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
}

class World {
    constructor() {
        this.platforms = [
            { x: 0, y: window.innerHeight - 100, width: 5000, height: 100 },
            { x: 500, y: window.innerHeight - 250, width: 200, height: 20 },
            { x: 800, y: window.innerHeight - 400, width: 200, height: 20 },
            { x: 1100, y: window.innerHeight - 300, width: 200, height: 20 }
        ];

        this.scrolls = [
            { x: 1150, y: window.innerHeight - 350, collected: false, text: "Религия — это путь любви, а не повод для ненависти. В каждом учении есть свет." }
        ];
    }

    checkCollision(player) {
        player.grounded = false;
        for (let p of this.platforms) {
            if (player.x < p.x + p.width &&
                player.x + player.width > p.x &&
                player.y + player.height > p.y &&
                player.y + player.height < p.y + p.height + player.velY) {
                player.y = p.y - player.height;
                player.velY = 0;
                player.grounded = true;
            }
        }

        for (let s of this.scrolls) {
            if (!s.collected && 
                player.x < s.x + 40 && player.x + player.width > s.x &&
                player.y < s.y + 40 && player.y + player.height > s.y) {
                this.collectScroll(s);
            }
        }
    }

    collectScroll(scroll) {
        scroll.collected = true;
        document.getElementById('scroll-display').classList.remove('hidden');
        document.getElementById('fact-text').innerText = scroll.text;
    }

    draw(ctx) {
        ctx.fillStyle = '#000';
        for (let p of this.platforms) {
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }

        ctx.fillStyle = '#fff';
        for (let s of this.scrolls) {
            if (!s.collected) {
                ctx.save();
                ctx.shadowBlur = 15;
                ctx.shadowColor = "white";
                ctx.beginPath();
                ctx.arc(s.x + 20, s.y + 20, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        this.world = new World();
        this.player = new Player();
        
        this.keys = {};
        this.lastTime = 0;
        this.paused = false;

        this.init();
    }

    init() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        document.getElementById('start-button').addEventListener('click', () => {
            document.getElementById('start-screen').classList.add('hidden');
            requestAnimationFrame((t) => this.animate(t));
        });

        document.getElementById('close-scroll').addEventListener('click', () => {
            document.getElementById('scroll-display').classList.add('hidden');
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update(deltaTime) {
        if (document.getElementById('scroll-display').classList.contains('hidden')) {
            this.player.update(this.keys, deltaTime, this.world);
        }
    }

    draw() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#111');
        gradient.addColorStop(1, '#333');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.world.draw(this.ctx);
        this.player.draw(this.ctx);
    }

    animate(timeStamp) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((t) => this.animate(t));
    }
}

// Start Game
window.onload = () => {
    new Game();
};
