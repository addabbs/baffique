class World {
    constructor() {
        this.groundY = window.innerHeight - 150;
        this.platforms = [];
        this.movables = [];
        this.movingPlatforms = [];
        this.hazards = [];
        this.scrolls = [];
        this.gates = [];
        this.water = [];
        this.climbables = [];
        this.windZones = [];
        this.levelWidth = 5000;

        // Load the first level of chapter 1 by default
        this.loadLevel(GAME_LEVELS.chapter_1[0]);
    }

    // Helper to parse Y coordinates from string shortcuts (ground, ground_minus_100, etc)
    parseY(yValue) {
        if (typeof yValue === 'number') return yValue;
        if (yValue === 'ground') return this.groundY;
        if (yValue.startsWith('ground_minus_')) {
            return this.groundY - parseInt(yValue.replace('ground_minus_', ''));
        }
        if (yValue.startsWith('ground_plus_')) {
            return this.groundY + parseInt(yValue.replace('ground_plus_', ''));
        }
        return 0;
    }

    loadLevel(config) {
        // Clear current level
        this.platforms = [];
        this.movables = [];
        this.movingPlatforms = [];
        this.scrolls = [];
        this.gates = [];
        this.water = [];
        this.climbables = [];
        this.windZones = [];

        this.levelWidth = config.width;

        config.entities.forEach(ent => {
            const data = { ...ent };
            data.y = this.parseY(ent.y); // Convert "ground_minus_100" to actual pixels

            const obj = EntityFactory.create(ent.type, data);
            
            if (ent.type === 'platform') this.platforms.push(obj);
            else if (ent.type === 'hazard') this.hazards.push(obj);
            else if (ent.type === 'movable') this.movables.push(obj);
            else if (ent.type === 'moving_platform') this.movingPlatforms.push(obj);
            else if (ent.type === 'scroll') this.scrolls.push(obj);
            else if (ent.type === 'gate') this.gates.push(obj);
            else if (ent.type === 'water') this.water.push(obj);
            else if (ent.type === 'climbable') this.climbables.push(obj);
            else if (ent.type === 'wind_zone') this.windZones.push(obj);
        });
    }

    update() {
        for (let m of this.movables) {
            // Each stone considers platforms and OTHER stones as obstacles
            const otherStones = this.movables.filter(other => other !== m);
            const obstacles = [...this.platforms, ...otherStones];
            m.update(obstacles);
        }
        for (let mp of this.movingPlatforms) mp.update();
    }

    draw(ctx, camera) {
        ctx.fillStyle = '#000';
        for (let p of this.platforms) {
            ctx.fillRect(p.x - camera.x, p.y - camera.y, p.width, p.height);
            // Label: 1
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.font = "bold 14px Arial";
            ctx.fillText("1", p.x - camera.x + 5, p.y - camera.y + 15);
            ctx.fillStyle = '#000'; // Reset color
        }

        for (let mp of this.movingPlatforms) {
            mp.draw(ctx, camera);
            // Label: 2
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            ctx.font = "bold 14px Arial";
            ctx.fillText("2", mp.x - camera.x + 5, mp.y - camera.y + 15);
        }

        for (let h of this.hazards) {
            h.draw(ctx, camera);
            // Label: 6
            ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
            ctx.font = "bold 14px Arial";
            ctx.fillText("6", h.x - camera.x + 5, h.y - camera.y + 15);
        }

        for (let m of this.movables) {
            m.draw(ctx, camera);
            // Label: 5
            ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
            ctx.font = "bold 14px Arial";
            ctx.fillText("5", m.x - camera.x + 5, m.y - camera.y + 15);
        }

        for (let s of this.scrolls) {
            s.draw(ctx, camera);
            // Label: 7
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.font = "bold 14px Arial";
            ctx.fillText("7", s.x - camera.x + 5, s.y - camera.y - 10);
        }

        for (let g of this.gates) {
            g.draw(ctx, camera);
            // Label: 8
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.font = "bold 14px Arial";
            ctx.fillText("8", g.x - camera.x + 5, g.y - camera.y - 10);
        }

        for (let w of this.water) {
            w.draw(ctx, camera);
            // Label: 4
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            ctx.font = "bold 14px Arial";
            ctx.fillText("4", w.x - camera.x + 5, w.y - camera.y + 20);
        }

        for (let c of this.climbables) {
            c.draw(ctx, camera);
            // Label: 3
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            ctx.font = "bold 14px Arial";
            ctx.fillText("3", c.x - camera.x + 5, c.y - camera.y + 20);
        }
    }
}
