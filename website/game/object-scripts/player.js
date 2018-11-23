//Represents the user by extending the Fighter class

//Constructor
function PlayerFighter(state, spriteKey, spawnX, spawnY) {
    
    this.speedTarget = 1200;
    
    //The 'super' call to the parent constructor
    Fighter.call(this, state, spriteKey, spawnX, spawnY);
    this.sprite.frameName = 'player-ship-alive';
    this.sprite.animations.add('die', [0, 1, 2, 3, 4, 5, 6]);
    this.sprite.body.collideWorldBounds = true;
    
    this.startingHealth = 500;
    this.health = this.startingHealth;
    this.isDead = false;
    this.respawnReady = false;
    
    //Amount of ballistic damage to tolerate before energy damage can reduce health
    this.startingArmour = 150;
    this.armour = this.startingArmour;
    
    this.state = state;
    
    //Configure a keyboard key to enable/disable drag on the sprite
    this.isDampenerOn = true;
    this.dampenerToggleKey = state.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    this.dampenerToggleKey.onDown.add(function() {
        if(this.isDampenerOn) {
            this.sprite.body.drag.set(0);
        } else {
            this.sprite.body.drag.set(500);
        }
        this.isDampenerOn = !this.isDampenerOn;
    }, this);
    
    
    
    //Respawn mechanism
    
    this.respawnTimer = state.game.time.create(false);
    state.input.keyboard.addCallbacks(this, function() {
        if(this.respawnReady) {
            this.respawnPlayer();
        }
    });
}

//Setting the child prototype and constructor to the parents
PlayerFighter.prototype = Object.create(Fighter.prototype);
PlayerFighter.prototype.constructor = Fighter;

PlayerFighter.prototype.moveWithArrows = function(cursorKeys) {
    if(!this.isDead) {
        if (cursorKeys.up.isDown) {
            this.state.physics.arcade.accelerationFromRotation(this.sprite.rotation, this.speedTarget, this.sprite.body.acceleration);
        } else if(cursorKeys.down.isDown) {
            this.state.physics.arcade.accelerationFromRotation(this.sprite.rotation, -this.speedTarget, this.sprite.body.acceleration);
        } else {
            this.sprite.body.acceleration.set(0);
        }

        if (cursorKeys.left.isDown) {
            this.sprite.body.angularVelocity = -300;
        } else if (cursorKeys.right.isDown) {
            this.sprite.body.angularVelocity = 300;
        } else {
            this.sprite.body.angularVelocity = 0;
        }
    }
};

PlayerFighter.prototype.fire = function(fireButton) {
    if(fireButton.isDown && !this.isDead) {
        this.weapon.fire();
    }
};

PlayerFighter.prototype.die = function() {
    GalaxiorConquest.userAccount.statistics.playerDeaths++;
    saveAccountToLocal(GalaxiorConquest.userAccount);
    Fighter.prototype.die.call(this);
    this.sprite.animations.play('die', 4, false);
    this.respawnTimer.add(10000, function() {
        this.respawnReady = true;
    }, this);
    this.respawnTimer.start();
};

PlayerFighter.prototype.respawnPlayer = function() {
    if(this.respawnReady) {
        this.respawnReady = false;
        this.isDead = false;
        this.sprite.kill();
        this.sprite.x = 200;
        this.sprite.y = this.state.world.centerY;
        this.sprite.revive();
        this.sprite.frameName = 'player-ship-alive';
        this.resetHealth();
        this.isDampenerOn = true;
        this.sprite.body.drag.set(500);
        this.sprite.body.velocity.set(0);
        this.sprite.body.collideWorldBounds = true;
    }
};

PlayerFighter.prototype.resetHealth = function() {
    
    this.health = this.startingHealth;
    this.armour = this.startingArmour;
    
};