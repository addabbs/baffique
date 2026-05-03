class EntityFactory {
    static create(type, data) {
        console.log(`[Factory] Creating entity: ${type} at (${data.x}, ${data.y}) with size ${data.width}x${data.height}`);
        switch (type) {
            case 'platform':
                return { x: data.x, y: data.y, width: data.width, height: data.height };
            
            case 'hazard':
                return new Hazard(data.x, data.y, data.width, data.height);
            
            case 'movable':
                return new MovableObject(data.x, data.y, data.width, data.height);
            
            case 'moving_platform':
                return new MovingPlatform(data.x, data.y, data.width, data.height, data.rangeX, data.speed);
            
            case 'scroll':
                return new Scroll(data.x, data.y, data.text, data.isSecret || false);
            
            case 'gate':
                return new LevelGate(data.x, data.y, data.nextLevel);
            
            case 'water':
                return new Water(data.x, data.y, data.width, data.height);
            
            case 'climbable':
                return new ClimbableWall(data.x, data.y, data.width, data.height);
            
            case 'wind_zone':
                return new WindZone(data.x, data.y, data.width, data.height, data.force);
            
            default:
                console.warn(`Unknown entity type: ${type}`);
                return null;
        }
    }
}
