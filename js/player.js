class Player {
    constructor() {
        this.x = 100;
        this.y = window.innerHeight - 300;
        this.width = 100;
        this.height = 150;
        this.velX = 0;
        this.velY = 0;
        this.speed = 0.6;
        this.jumpForce = -18;
        this.gravity = 0.6;
        this.friction = 0.85;
        this.onClimbable = false;
        this.inWindZone = false;
        
        // Attack/Ultimate stats
        this.scrollCount = 0;
        this.attackTimer = 0;
        this.ultimateTimer = 0;
        this.isAttacking = false;
        this.isUltimate = false;
        
        // Checkpoint system
        this.checkpointX = 100;
        this.checkpointY = window.innerHeight - 300;

        this.sprite = new Image();
        this.sprite.src = './assets/baffik.png';
        this.ready = false;
        this.sprite.onload = () => this.ready = true;
    }

    update(keys, deltaTime, world) {
        this.inWater = false;
        this.onClimbable = false;
        this.inWindZone = false;

        // Check for special areas (Water/Climbables/Wind)
        for (let w of world.water) {
            if (Physics.AABB(this, w)) {
                if (!this.inWater) console.log("[Player] Entered Water");
                this.inWater = true;
            }
        }
        for (let c of world.climbables) {
            const nearClimbable = (this.x + this.width > c.x - 10 && this.x < c.x + c.width + 10 && this.y + this.height > c.y - 10 && this.y < c.y + c.height + 10);
            if (nearClimbable) {
                if (!this.onClimbable) console.log("[Player] Grabbing Climbable Surface");
                this.onClimbable = true;
            }
        }
        for (let wz of world.windZones) {
            if (Physics.AABB(this, wz)) {
                if (!this.inWindZone) console.log("[Player] Entered Wind Anomaly Zone");
                this.inWindZone = true;
                this.velY += wz.force; // Apply wind force
            }
        }

        // Find if we can grab a movable object
        let grabbedObject = null;
        if (keys['ShiftLeft'] || keys['ShiftRight']) {
            for (let m of world.movables) {
                // Check if near enough to grab (slightly larger range to avoid collision blocking)
                const isNearX = Math.abs((this.x + this.width / 2) - (m.x + m.width / 2)) < (this.width / 2 + m.width / 2 + 25);
                const isNearY = Math.abs((this.y + this.height) - (m.y + m.height)) < 50; 
                if (isNearX && isNearY) {
                    grabbedObject = m;
                    break;
                }
            }
        }

        // Horizontal Movement
        let currentSpeed = this.speed;
        if (this.inWater) currentSpeed *= 0.5;
        if (this.onClimbable) currentSpeed *= 0.7;
        if (this.inWindZone) currentSpeed *= 1.2; // Move faster in wind

        if (keys['ArrowLeft'] || keys['KeyA']) this.velX -= currentSpeed;
        if (keys['ArrowRight'] || keys['KeyD']) this.velX += currentSpeed;

        this.velX *= this.inWater ? 0.9 : this.friction;

        // Apply movement to grabbed object if any
        if (grabbedObject) {
            grabbedObject.isBeingGrabbed = true;
            grabbedObject.velX = this.velX;
            // Let the object resolve its own X collision first so we can't push it through walls
            let oldObjX = grabbedObject.x;
            grabbedObject.x += grabbedObject.velX;
            // Temp resolution for object X against static platforms
            for (let p of world.platforms) {
                if (Physics.AABB(grabbedObject, p)) {
                    if (grabbedObject.velX > 0) grabbedObject.x = p.x - grabbedObject.width;
                    else if (grabbedObject.velX < 0) grabbedObject.x = p.x + p.width;
                    grabbedObject.velX = 0;
                }
            }
            // If object was stopped, stop player too
            if (grabbedObject.velX === 0 && Math.abs(this.velX) > 0.1) {
                this.velX = 0; 
            }
        } else {
            for (let m of world.movables) m.isBeingGrabbed = false;
        }

        // Attack / Ultimate Trigger
        if (keys['Enter'] && this.attackTimer <= 0) {
            this.isAttacking = true;
            this.attackTimer = 30; // 0.5s at 60fps
            console.log("[Combat] Attack triggered!");
            
            // Physical impact on stones
            let hitSomething = false;
            for (let m of world.movables) {
                const dist = Math.sqrt(Math.pow(this.x - m.x, 2) + Math.pow(this.y - m.y, 2));
                if (dist < 150) {
                    const direction = (this.velX < -0.1) ? -1 : 1;
                    m.velX = direction * 15; // Punch the stone
                    m.velY = -5; // Slight pop up
                    hitSomething = true;
                    console.log("[Combat] Logic Stone hit by attack!");
                }
            }
            if (!hitSomething) console.log("[Combat] Attack missed (no objects in range)");
        }
        
        const ultKey = (keys['Comma'] || keys['Period'] || keys['KeyQ']);
        if (ultKey && this.ultimateTimer <= 0) {
            if (this.scrollCount >= 3) {
                this.isUltimate = true;
                this.ultimateTimer = 120; // 2s duration
                console.log("%c[ULTIMATE] SOUL BURST ACTIVATED!%c", "color: #fff; background: #ffd700; padding: 5px; font-weight: bold; border-radius: 3px;", "");
            } else {
                console.warn(`[Combat] Ultimate failed: Scrolls needed 3, you have ${this.scrollCount}.`);
                // Briefly reset key to prevent log spam
                keys['Comma'] = false;
                keys['Period'] = false;
                keys['KeyQ'] = false;
            }
        }

        if (this.attackTimer > 0) this.attackTimer--;
        else this.isAttacking = false;
        
        if (this.ultimateTimer > 0) this.ultimateTimer--;
        else this.isUltimate = false;

        // Jump / Swim / Climb / Fly
        if (keys['Space'] || keys['ArrowUp'] || keys['KeyW']) {
            if (this.grounded) {
                this.velY = this.jumpForce;
                this.grounded = false;
            } else if (this.inWater) {
                this.velY -= 0.8;
                if (this.velY < -5) this.velY = -5;
            } else if (this.onClimbable) {
                this.velY = -4;
            } else if (this.inWindZone) {
                this.velY -= 0.6; // Fly up
                if (this.velY < -7) this.velY = -7;
            }
        }
        
        // Fly down in wind zone
        if (this.inWindZone && (keys['ArrowDown'] || keys['KeyS'])) {
            this.velY += 2.0; // Much stronger force to overcome the wind
            if (this.velY > 7) this.velY = 7;
        }

        // Gravity / Buoyancy / Wind
        if (this.inWater) {
            this.velY += 0.1;
            if (this.velY > 2) this.velY = 2;
        } else if (this.onClimbable) {
            if (this.velY > 0) this.velY = 0;
        } else if (this.inWindZone) {
            // Hover effect in wind if no vertical keys pressed
            if (!(keys['Space'] || keys['ArrowUp'] || keys['KeyW'] || keys['ArrowDown'] || keys['KeyS'])) {
                this.velY *= 0.9; 
            }
        } else {
            this.velY += this.gravity;
        }

        // Combine platforms, movables, and moving platforms as obstacles
        let allObstacles = [...world.platforms, ...world.movables, ...world.movingPlatforms, ...world.climbables];
        
        // Special case: Player moving with platform
        for(let mp of world.movingPlatforms) {
            // Check if player is standing on the platform (with a small margin of 2 pixels)
            const isOnPlatform = (this.x + this.width > mp.x && 
                                  this.x < mp.x + mp.width && 
                                  Math.abs((this.y + this.height) - mp.y) < 5);
            
            if(isOnPlatform) {
                this.x += mp.velX; 
            }
        }

        // Resolve collisions
        Physics.resolveCollisions(this, allObstacles, grabbedObject);

        // Keep player in bounds
        if (this.x < 0) {
            this.x = 0;
            this.velX = 0;
        }
    }

    respawn() {
        this.x = this.checkpointX;
        this.y = this.checkpointY;
        this.velX = 0;
        this.velY = 0;
    }

    draw(ctx, camera) {
        this.drawSoulLight(ctx, camera);
        
        // Ultimate Ready Indicator
        if (this.scrollCount >= 3 && !this.isUltimate && this.ultimateTimer <= 0) {
            ctx.save();
            ctx.fillStyle = "#FFD700";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "gold";
            ctx.fillText("УЛЬТА ГОТОВА (,)", this.x - camera.x + this.width / 2, this.y - camera.y - 20);
            ctx.restore();
        }

        // Draw Ultimate effect
        if (this.isUltimate) {
            const centerX = this.x - camera.x + this.width / 2;
            const centerY = this.y - camera.y + this.height / 2;
            const radius = (120 - this.ultimateTimer) * 10;
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.ultimateTimer / 120})`;
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.restore();
        }

        if (!this.ready) return;

        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        ctx.save();
        
        // Draw Attack effect
        if (this.isAttacking) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = 10;
            ctx.beginPath();
            const offset = (this.velX < -0.1) ? -100 : 100;
            ctx.arc(drawX + this.width/2 + offset/2, drawY + this.height/2, 60, -0.5, 0.5);
            ctx.stroke();
        }

        if (this.velX < -0.1) {
            ctx.translate(drawX + this.width, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(this.sprite, drawX, drawY, this.width, this.height);
        }
        ctx.restore();
    }

    drawSoulLight(ctx, camera) {
        const headX = this.x - camera.x + this.width / 2;
        const headY = this.y - camera.y + 40;
        
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
