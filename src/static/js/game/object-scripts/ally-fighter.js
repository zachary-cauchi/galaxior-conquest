function AllyFighter(state, spriteKey, spawnX, spawnY) {
    
    this.state = state;
    Fighter.call(this, state.game, spriteKey, spawnX, spawnY);
    this.aiTarget = null;
    this.aiManager = null;
    this.isDead = false;
    this.desiredSpeed = 300;
    this.sprite.body.collideWorldBounds = false;
}

AllyFighter.prototype = Object.create(Fighter.prototype);
AllyFighter.prototype.constructor = Fighter;

AllyFighter.prototype.faceTarget = function() {
    this.sprite.rotation = this.state.game.physics.arcade.angleToXY(this.sprite, this.aiTarget.entitySprite.x, this.aiTarget.entitySprite.y);
};

AllyFighter.prototype.engageTarget = function() {
    if(this.aiManager.active) {
        if(this.aiTarget.entitySprite === undefined) {
            return;
        }
        if(this.aiTarget.entitySprite.isDead) {
            this.aiTarget.entitySprite = this.aiManager.requestTarget(this.aiManager.possiblePriorities.HEALTHIEST, this.aiTarget.entitySprite).sprite;
        } else if(!this.isDead) {
            var distanceToTarget = this.state.game.physics.arcade.distanceToXY(this.sprite, this.aiTarget.entitySprite.x, this.aiTarget.entitySprite.y);
            if(distanceToTarget > 300) {
                this.sprite.rotation = this.state.game.physics.arcade.angleToXY(this.sprite, this.aiTarget.entitySprite.x, this.aiTarget.entitySprite.y);
                this.state.physics.arcade.accelerationFromRotation(this.sprite.rotation, this.desiredSpeed, this.sprite.body.acceleration);
            }else if(distanceToTarget < 300) {
                this.weapon.fire();
                this.faceTarget();

            }
        }
    }
};

AllyFighter.prototype.die = function() {
    Fighter.prototype.die.call(this);
};