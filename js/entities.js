class Scroll {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.text = text;
        this.collected = false;
        this.animTimer = Math.random() * 10; // Random start for animation
    }

    draw(ctx, camera) {
        if (this.collected) return;
        
        this.animTimer += 0.05;
        const bounce = Math.sin(this.animTimer) * 10;
        
        ctx.save();
        ctx.translate(this.x - camera.x + 20, this.y - camera.y + 20 + bounce);
        
        // Glowing effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = "white";
        ctx.fillStyle = "white";
        
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Extra glow layer
        ctx.shadowBlur = 40;
        ctx.fill();
        
        ctx.restore();
    }
}

class MovableObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velX = 0;
        this.velY = 0;
        this.gravity = 0.6;
        this.friction = 0.8;
        this.grounded = false;
        this.isBeingGrabbed = false;
    }

    update(obstacles) {
        // Only allow movement if being grabbed, otherwise it acts as a fixed obstacle
        if (!this.isBeingGrabbed) {
            this.velX = 0; 
        }
        
        this.velY += this.gravity;
        Physics.resolveCollisions(this, obstacles);
    }

    draw(ctx, camera) {
        ctx.save();
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        // "Stone of Logic" aesthetics
        ctx.fillStyle = '#1a1a1a';
        ctx.strokeStyle = '#00ffff'; // Cyan glow for runes
        ctx.lineWidth = 2;
        ctx.shadowBlur = this.isBeingGrabbed ? 15 : 5;
        ctx.shadowColor = '#00ffff';

        ctx.fillRect(drawX, drawY, this.width, this.height);
        ctx.strokeRect(drawX, drawY, this.width, this.height);

        // Draw simple glowing runes
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(drawX + 15, drawY + 15);
        ctx.lineTo(drawX + 35, drawY + 35);
        ctx.moveTo(drawX + 35, drawY + 15);
        ctx.lineTo(drawX + 15, drawY + 35);
        ctx.stroke();

        ctx.restore();
    }
}

class Hazard {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pulse = 0;
    }

    draw(ctx, camera) {
        this.pulse += 0.05;
        const opacity = 0.3 + Math.sin(this.pulse) * 0.2;
        
        ctx.save();
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        // "Miasma of Dogma" aesthetics
        const grad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
        grad.addColorStop(0, `rgba(40, 0, 0, ${opacity})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(drawX, drawY, this.width, this.height);

        // Particle-like symbols in miasma
        ctx.fillStyle = `rgba(255, 0, 0, ${opacity * 0.5})`;
        for(let i=0; i<5; i++) {
            let px = drawX + (Math.sin(this.pulse + i) * 0.5 + 0.5) * this.width;
            let py = drawY + (Math.cos(this.pulse * 0.5 + i) * 0.5 + 0.5) * this.height;
            ctx.fillRect(px, py, 4, 4);
        }

        ctx.restore();
    }
}

class MovingPlatform {
    constructor(x, y, width, height, rangeX, speed) {
        this.startX = x;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rangeX = rangeX;
        this.speed = speed;
        this.timer = 0;
        this.velX = 0; // Needed for player momentum
    }

    update() {
        this.timer += this.speed;
        const oldX = this.x;
        this.x = this.startX + Math.sin(this.timer) * this.rangeX;
        this.velX = this.x - oldX;
    }

    draw(ctx, camera) {
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        ctx.strokeRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        ctx.restore();
    }
}

class LevelGate {
    constructor(x, y, nextLevelName) {
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 200;
        this.nextLevelName = nextLevelName;
        this.active = true;
    }

    draw(ctx, camera) {
        ctx.save();
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        // Portal-like light gate
        const grad = ctx.createLinearGradient(drawX, drawY, drawX + this.width, drawY);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.shadowBlur = 30;
        ctx.shadowColor = 'white';
        ctx.fillStyle = grad;
        ctx.fillRect(drawX, drawY, this.width, this.height);
        
        // Two side pillars
        ctx.fillStyle = '#000';
        ctx.fillRect(drawX, drawY, 10, this.height);
        ctx.fillRect(drawX + this.width - 10, drawY, 10, this.height);

        ctx.restore();
    }
}

class Water {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.waveTimer = 0;
    }

    draw(ctx, camera) {
        this.waveTimer += 0.03;
        ctx.save();
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        // Water styling
        ctx.fillStyle = 'rgba(0, 100, 255, 0.4)';
        ctx.fillRect(drawX, drawY, this.width, this.height);

        // Wave lines on surface
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= this.width; i += 20) {
            const waveY = Math.sin(this.waveTimer + i * 0.05) * 5;
            if (i === 0) ctx.moveTo(drawX + i, drawY + waveY);
            else ctx.lineTo(drawX + i, drawY + waveY);
        }
        ctx.stroke();
        ctx.restore();
    }
}

class ClimbableWall {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx, camera) {
        ctx.save();
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        // "Sticky Grass" styling
        ctx.fillStyle = '#1a331a';
        ctx.fillRect(drawX, drawY, this.width, this.height);
        
        // Leafy texture
        ctx.strokeStyle = '#2d5a2d';
        ctx.lineWidth = 1;
        for (let i = 0; i < this.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(drawX, drawY + i);
            ctx.lineTo(drawX + this.width, drawY + i + 10);
            ctx.stroke();
        }

        // Label: 3
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.font = "bold 16px Arial";
        ctx.fillText("3", drawX + 5, drawY + 20);

        ctx.restore();
    }
}
class WindZone {
    constructor(x, y, width, height, force = -1.2) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.force = force;
        this.particles = [];
        for(let i=0; i<15; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                speed: 2 + Math.random() * 3
            });
        }
    }

    draw(ctx, camera) {
        ctx.save();
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        // Subtle blue tint for the zone
        ctx.fillStyle = 'rgba(100, 200, 255, 0.1)';
        ctx.fillRect(drawX, drawY, this.width, this.height);

        // Moving wind particles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        for (let p of this.particles) {
            p.y -= p.speed;
            if (p.y < 0) p.y = this.height;
            
            ctx.beginPath();
            ctx.moveTo(drawX + p.x, drawY + p.y);
            ctx.lineTo(drawX + p.x, drawY + p.y + 10);
            ctx.stroke();
        }

        // Label: 9
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "bold 14px Arial";
        ctx.fillText("9", drawX + 5, drawY + 20);

        ctx.restore();
    }
}
