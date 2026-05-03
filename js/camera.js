class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
    }

    update(target) {
        // Target is usually the player
        // We want to center the player horizontally on the screen
        const targetX = target.x - this.viewportWidth / 2 + target.width / 2;
        
        // Smooth camera follow
        this.x += (targetX - this.x) * 0.1;

        // Clamp camera so it doesn't go left of the level start (x=0)
        if (this.x < 0) {
            this.x = 0;
        }
        
        // Y axis can remain fixed for now, or follow similarly if vertical levels are needed
        this.y = 0;
    }

    resize() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
    }
}
