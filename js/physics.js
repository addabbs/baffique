class Physics {
    // Check intersection of two rectangles
    static AABB(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    // Resolve movement and collisions for an entity against a list of obstacles
    static resolveCollisions(entity, obstacles, ignoreObstacleX = null) {
        entity.grounded = false;

        // X Axis resolution
        entity.x += entity.velX;
        for (let p of obstacles) {
            if (p === entity || p === ignoreObstacleX) continue;
            if (Physics.AABB(entity, p)) {
                if (entity.velX > 0) {
                    entity.x = p.x - entity.width; // Hit right wall
                    console.log(`[Physics] Collision X (Right): ${entity.constructor.name} hit obstacle`);
                } else if (entity.velX < 0) {
                    entity.x = p.x + p.width; // Hit left wall
                    console.log(`[Physics] Collision X (Left): ${entity.constructor.name} hit obstacle`);
                }
                entity.velX = 0;
            }
        }

        // Y Axis resolution
        entity.y += entity.velY;
        for (let p of obstacles) {
            if (p === entity) continue;
            if (Physics.AABB(entity, p)) {
                if (entity.velY > 0) {
                    entity.y = p.y - entity.height; // Landed on top
                    if (!entity.grounded) console.log(`[Physics] ${entity.constructor.name} landed on surface`);
                    entity.grounded = true;
                    entity.velY = 0;
                } else if (entity.velY < 0) {
                    entity.y = p.y + p.height; // Hit ceiling
                    console.log(`[Physics] ${entity.constructor.name} hit ceiling`);
                    entity.velY = 0;
                }
            }
        }
    }
}
