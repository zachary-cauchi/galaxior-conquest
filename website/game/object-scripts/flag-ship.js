function FlagShip(state, shipSpriteKey) {
    
    this.game = state.game;
    this.state = state;
    
    var spriteScale = 9
    
    this.totalHealth = 0;
    this.isDead = false;
    
    this.sprite = this.game.add.sprite(this.game.world.width, this.game.world.centerY, shipSpriteKey);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(spriteScale);
    this.sprite.x = state.world.width - this.sprite.width / 2;
    this.turretCount = 10;
    
    this.turrets = [];
    this.aliveTurrets = [];
    
    this.subSystems = [];
    this.aliveSubSystems = [];
    
    this.subEntityGroup = this.game.add.group();
    this.subEntityGroup.enableBody = true;
    this.subEntityGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.subEntityGroup.turretGroup = this.game.add.group();
    this.subEntityGroup.subSystemGroup = this.game.add.group();
    
    var spriteOriginX = this.sprite.x - (this.sprite.width * this.sprite.anchor.x);
    var spriteOriginY = this.sprite.y - (this.sprite.height * this.sprite.anchor.y);
    
    this.turretSpawnZones = [
        
            //Hull zone 1
            new Phaser.Rectangle(
                spriteOriginX + (52 * spriteScale),
                spriteOriginY + (34 * spriteScale),
                56 * spriteScale,
                60 * spriteScale
            ),
        
            //Hull zone 2
            new Phaser.Rectangle(
                spriteOriginX + (108 * spriteScale),
                spriteOriginY + (42 * spriteScale),
                72 * spriteScale,
                44 * spriteScale
            ),
            
            //Top engine
            new Phaser.Rectangle(
                spriteOriginX + (119 * spriteScale),
                spriteOriginY + (17 * spriteScale),
                52 * spriteScale,
                14 * spriteScale
            ),
        
            //Bottom engine
            new Phaser.Rectangle(
                spriteOriginX + (119 * spriteScale),
                spriteOriginY + (97 * spriteScale),
                52 * spriteScale,
                14 * spriteScale
            )
            
    ];
    
    this.possibleTargets = [this.state.player];
    for(i = 0; i < this.state.allyFighters.length; i++) {
        this.possibleTargets.push(this.state.allyFighters[i]);
    }
    this.turretTargetAssignments = [];
    this.spawnSubSystems(this.game, 'shieldGenerator');
    this.initialiseTurrets(state, 'basicTurret');
    
    //Calculating health
    this.turrets.forEach(function(turret, index) {
        this.totalHealth += turret.health;
    }, this);
    this.subSystems.forEach(function(subSystem, index) {
        this.totalHealth += subSystem.health;
    }, this);
}

FlagShip.prototype = {
    
    spawnSubSystems : function(assetKeys) {
        
        var chosenSpawnZone = Math.floor(random() * (this.turretSpawnZones.length - 3));
        var coordinates = this.getRandomSpawnCoordinates(this.turretSpawnZones[chosenSpawnZone]);
        
        this.subSystems.push(new ShieldGenerator(this.game, 'shieldGenerator', coordinates, this));
        this.subEntityGroup.subSystemGroup.add(this.subSystems[0].sprite);
        this.subSystems[0].sprite.subSystemId = '0';
        this.aliveSubSystems[0] = this.subSystems[0];
    },
    
    initialiseTurrets : function(game, turretSpriteKey) {
        
        var thresholdX = 60;
        var thresholdY = 60;
        var isValid = true;
        
        for(i = 0; i < this.turretCount; i++) {
            
            do {
                
                var chosenSpawnZone = Math.floor(random() * (this.turretSpawnZones.length - 2));
                isValid = true;
                
                var coordinates = this.getRandomSpawnCoordinates(this.turretSpawnZones[chosenSpawnZone]);
                
                var vicinityX = 0;
                var vicinityY = 0;
                
                //Intersection check
                for(j = i - 1; j >= 0; j--) {
                    vicinityX = coordinates.x - this.aliveTurrets[j].sprite.x;
                    vicinityY = coordinates.y - this.aliveTurrets[j].sprite.y;
                    if((vicinityX > -thresholdX && vicinityX < thresholdX) && (vicinityY > -thresholdY && vicinityY < thresholdY)) {
                        isValid = false;
                    }
                } //*/
                
                for(j = 0; j < this.aliveSubSystems.length; j++) {
                    vicinityX = coordinates.x - this.aliveSubSystems[j].sprite.x;
                    vicinityY = coordinates.y - this.aliveSubSystems[j].sprite.y;
                    if((vicinityX > -thresholdX && vicinityX < thresholdX) && (vicinityY > -thresholdY && vicinityY < thresholdY)) {
                        isValid = false;
                    }
                }
            
            } while(isValid == false);
            
            this.turrets[i] = new Turret(this.state, turretSpriteKey, coordinates, this, i);
            this.turretTargetAssignments.push(this.possibleTargets[Math.floor(random() * this.possibleTargets.length)]);
            this.subEntityGroup.turretGroup.add(this.turrets[i].sprite);
            this.aliveTurrets[i] = this.turrets[i];
        }
        
    },
    
    aiUpdate : function(targetSprite) {
        
        for(i = 0; i < this.aliveTurrets.length; i++) {
            
            var turretAssignment = this.turretTargetAssignments[this.aliveTurrets[i].sprite.originalTurretId].sprite;
            if(this.game.physics.arcade.distanceToXY(this.aliveTurrets[i].sprite, turretAssignment.x, turretAssignment.y) > this.aliveTurrets[i].attackRange * 2 && !this.state.player.isDead) {
                this.aliveTurrets[i].aiUpdate(this.game, this.state.player.sprite);
            } else {
                this.aliveTurrets[i].aiUpdate(this.game, turretAssignment);
            }
            
        }
        
    },
    
    getRandomSpawnCoordinates : function(chosenRect) {
       
        var coordinates = new Phaser.Point();
        
        chosenRect.random(coordinates);
        
        return {
            x : coordinates.x,
            y : coordinates.y
        };
        
    },
    
    takeDamage : function(healthAmountReduced) {
        if(this.totalHealth - healthAmountReduced <= 0) {
            this.totalHealth = 0;
            this.die();
        } else {
            this.totalHealth -= healthAmountReduced;
        }
    },
    
    die : function() {
        console.log('ship has died');
        this.state.flagShipMoveTween.stop();
        this.state.aiUpdateTimer.stop();
        this.sprite.loadTexture('flagShipDestroyed', 0);
        this.state.gameOverText.text = 'Flag ship Destroyed';
        this.state.gameOverText.visible = true;
        this.state.gameWon();
    }
    
};

function Turret(state, turretSpriteKey, coordinates, flagShip, id = 0) {
    
    this.game = state.game;
    this.gameState = state;
    
    //Set up weapon
    this.weapon = this.game.add.weapon(60, 'turretLaser');
    this.weaponFireRate = 1000;
    
    this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.weapon.bulletLifespan = 2500;

    this.weapon.bulletSpeed = 400;
    this.weapon.fireRate = 100;
    
    this.weapon.bullets.enableBody = true;
    this.weapon.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    
    this.weapon.bullets.forEach(function(bullet) {
        bullet.attackDamage = {
            ballisticsDamage : 3,
            energyDamage : 1
        };
    }, this);
    
    this.attackRange = ((this.weapon.bulletSpeed * this.weapon.bulletLifespan / 1000) / 6) * 5;
    
    //Health
    this.startingHealth = 250;
    this.health = this.startingHealth;
    this.armour = 0;
    this.isDead = false;
    
    //Targeting
    
    this.rotationSpeed = 25;
    this.desiredAngle = 0;
    this.desiredAngleDiff = 0;
    this.prevTargetCoords = {x:0, y:0};
    this.prevTurretCoords = {x : coordinates.x, y : coordinates.y};
    this.fireWithinDeviation = 0.05;
    
    //Create sprite
    this.sprite = this.game.add.sprite(coordinates.x, coordinates.y, turretSpriteKey);
    this.sprite.frameName = 'turret-larger';
    this.sprite.animations.add('die', [0, 1, 2, 3, 4, 5, 6]);
    
    this.sprite.turretId = id;
    this.sprite.originalTurretId = id;
    this.sprite.isDead = false;
    this.parentFlagShip = flagShip;
    
    var anchorX = 11 / 45;
    var anchorY = 11 / 21;
    
    this.sprite.anchor.set(anchorX, anchorY);
    this.turretScale = 2
    this.sprite.scale.set(this.turretScale);
    
    //Create collision body for turret
    this.game.physics.arcade.enableBody(this.sprite);
    this.sprite.body.setCircle(this.sprite.height / 2, -(this.sprite.height / 4), -(this.sprite.height / 4));
    this.sprite.body.immovable = true;
    
    //Tell the weapon to spawn bullets at a position and rotation relative to the turret sprite
    this.weapon.trackSprite(this.sprite, anchorX, anchorY, true);
    this.weapon.trackOffset.x = this.sprite.width - (this.sprite.width * anchorX);
    
    this.desiredAngleDiff = this.sprite.rotation - this.game.physics.arcade.angleToXY(this.sprite, this.prevTargetCoords.x, this.prevTargetCoords.y);
    
}

Turret.prototype = {
    
    aiUpdate : function(game, targetSprite) {
        
        //If the target has changed coordinates, update the variables
        
        var posChanged = (this.prevTurretCoords.x != this.sprite.x || this.prevTurretCoords.y != this.sprite.y);
        if((this.prevTargetCoords.x != targetSprite.x) || (this.prevTargetCoords.y != targetSprite.y) || posChanged) {
            this.prevTargetCoords.x = targetSprite.x;
            this.prevTargetCoords.y = targetSprite.y;
            
            this.prevTurretCoords.x = this.sprite.x;
            this.prevTurretCoords.y = this.sprite.y;
            
            this.desiredAngle = game.physics.arcade.angleToXY(this.sprite, this.prevTargetCoords.x, this.prevTargetCoords.y);
            this.desiredAngleDiff = this.sprite.rotation - this.desiredAngle;
        }
        
        //If the target is close enough, set the turret rotation to face the target
        var deviation = this.sprite.rotation - this.desiredAngle;
        if(deviation > 0.05 || deviation < -0.05) {
            this.sprite.rotation -= this.desiredAngleDiff / this.rotationSpeed;
        } else {
            this.sprite.rotation = this.desiredAngle;
        }
        
        //If the target is out of reach, don't consider firing
        if(game.physics.arcade.distanceToXY(this.sprite, targetSprite.x, targetSprite.y) < this.attackRange) {
            if(deviation > -this.fireWithinDeviation && deviation < this.fireWithinDeviation) {
                this.weapon.fire();
            }
        }
        
    },
    
    updateFlagship : function(healthAmountReduced) {
        this.parentFlagShip.takeDamage(healthAmountReduced);
    },
    
    die : function() {
        this.isDead = true;
        this.sprite.isDead = true;
        this.sprite.animations.play('die', 4, false);
        
        //Reindexing the turret ids for when the turret is removed
        if(this.sprite.turretId < (this.parentFlagShip.aliveTurrets.length - 1)) {
            for(i = this.sprite.turretId + 1; i < this.parentFlagShip.aliveTurrets.length; i++) {
                this.parentFlagShip.aliveTurrets[i].sprite.turretId -= 1;
            }
        }
        this.parentFlagShip.aliveTurrets.splice(this.sprite.turretId, 1);
        this.sprite.body.enable = false;
    }
    
};

function ShieldGenerator(game, assetKey, coordinates, parentFlagShip) {
    
    this.game = game;
    this.parentFlagShip = parentFlagShip;
    this.spriteScale = 3;
    
    this.sprite = game.add.sprite(coordinates.x, coordinates.y, assetKey);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(this.spriteScale);
    
    this.sprite.animations.add('alive', [3, 2, 1, 0]);
    this.sprite.animations.add('die', [7, 6, 5, 4, 8]);
    this.sprite.animations.play('alive', 5, true);

    game.physics.arcade.enableBody(this.sprite);
    this.sprite.body.setCircle(this.sprite.width / (this.spriteScale * 0.75), -this.sprite.width / 3.6, -this.sprite.height / 3.6);
    this.sprite.body.immovable = true;
    
    this.health = 500;
    this.armour = 50;
    this.isDead = false;
    this.isShielding = true;
    this.sprite.subSystemId = 0;
    this.sprite.originalSubSystemId = 0;
    
}

ShieldGenerator.prototype = {
    
    die : function() {
        this.isDead = true;
        this.isShielding = false;
        this.sprite.animations.play('die', 5, false);
        
        //Reindexing the turret ids for when the turret is removed
        if(this.sprite.subSystemId < (this.parentFlagShip.aliveSubSystems.length - 1)) {
            for(i = this.sprite.subSystemId + 1; i < this.parentFlagShip.aliveSubSystems.length; i++) {
                this.parentFlagShip.aliveSubSystems[i].sprite.subSystemId -= 1;
            }
        }
        this.parentFlagShip.aliveSubSystems.splice(this.sprite.subSystemId, 1);
        
        this.sprite.body.enable = false;
    },
    
    updateFlagship : function(healthAmountReduced) {
        this.parentFlagShip.takeDamage(healthAmountReduced);
    }
    
};