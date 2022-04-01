function Fighter(game, spriteKey, spawnX, spawnY) {
    //Extending the Killable class
    Killable.call(this, 300, 50);
    
    this.sprite = game.add.sprite(spawnX, spawnY, spriteKey);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(1.25);
    
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.drag.set(500);
    this.sprite.body.maxVelocity.set(1200);
    
    //Setting the collision properties
    game.physics.arcade.enableBody(this.sprite);
    this.sprite.body.setCircle(this.sprite.height / 2, -4, -4);
    this.sprite.body.immovable = true;
    
    //Create a weapon for the player
    this.weapon = game.add.weapon(40, 'burstShot');
    this.weaponFireRate = 250;
    
    this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.weapon.bulletLifespan = 2000;
    
    this.bulletSpeed = 300;
    
    //Enable physics for the bullets
    this.weapon.bullets.enableBody = true;
    this.weapon.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    
    //Configure each bullet in the group
    this.weapon.bullets.forEach(function(bullet) {
        bullet.scale.set(2);
        bullet.body.setCircle(bullet.width / 2);
        //Set damage-inflicting properties
        bullet.attackDamage = {
            ballisticsDamage : getSetting('ballisticDamage'),
            energyDamage : getSetting('energyDamage')
        };
    }, this);
    this.weapon.trackSprite(this.sprite, 1.1, 0.5, true);
    this.weapon.trackOffset.x = this.sprite.width - (this.sprite.width * this.sprite.anchor.x);
    
}

Fighter.prototype = Object.create(Killable.prototype);
Fighter.prototype.constructor = Killable;

Fighter.prototype.die = function() {
    this.health = 0;
    this.isDead = true;
    this.isDampenerOn = false;
    this.sprite.body.drag.set(0);
    this.sprite.body.acceleration.set(0);
    this.sprite.body.collideWorldBounds = false;
}