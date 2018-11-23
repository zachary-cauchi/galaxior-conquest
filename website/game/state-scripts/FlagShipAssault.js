GalaxiorConquest.FlagShipAssault = function(game) {
    
    this.game = game;
    
    this.player = null;
    
    this.flagShip = null;
    
    this.ships = null;
    
    this.cursorKeys = null;
    
}

GalaxiorConquest.FlagShipAssault.prototype = {
    
    create : function() {
        
        //Set up background objects
        this.world.setBounds(0, 0, 5000, 1200);
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.add.tileSprite(0, 0, this.world.width, this.world.height, 'spaceBG');
        
        //Setting up player and input keys
        this.player = new PlayerFighter(this, 'playerShip', 50, 600);
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.playerFireButton = this.input.keyboard.addKey(Phaser.KeyCode.F);
        
        //Ally fighters
        this.allyFighters = [];
        for(i = 0; i < 10; i++) {
            var spawnX = (this.world.width * 0.05) + (random() * (this.world.width * 0.15));
            var spawnY = (this.world.height * 0.05) + (random() * (this.world.height * 0.8));;
            this.allyFighters.push(new AllyFighter(this, 'allyFighter', spawnX, spawnY));
            this.allyFighters[i].sprite.originalFighterId = i;
            this.allyFighters[i].aiManager = this.allyAiManager;
        }
        
        //Enemy flagship
        this.flagShip = new FlagShip(this, 'flagShip');
        
        //Groups
        this.game.world.bringToTop(this.player.sprite);
        
        //Camera
        this.camera.follow(this.player.sprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
        
        //Input
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        
        //Timers
        this.turretShieldTimer = this.game.time.create(false);
        
        //Ordering groups and sprites
        for(i = 0; i < this.flagShip.turrets.length; i++) {
            this.game.world.bringToTop(this.flagShip.turrets[i].weapon.bullets);
        }
        this.game.world.bringToTop(this.flagShip.subEntityGroup.subSystemGroup);
        this.game.world.bringToTop(this.flagShip.subEntityGroup.turretGroup);
        this.game.world.bringToTop(this.player.weapon.bullets);
        for(i = 0; i < this.flagShip.turrets.length; i++) {
            this.game.world.bringToTop(this.flagShip.turrets[i].weapon.bullets);
        }
        this.game.world.bringToTop(this.player.sprite);
        for(i = 0; i < this.allyFighters.length; i++) {
            this.game.world.bringToTop(this.allyFighters[i].sprite);
            this.game.world.bringToTop(this.allyFighters[i].weapon.bullets);
        }
        
        //Time until the flag ship reaches the left side of the world
        this.timeToLoss = 120000;
        this.flagShipDestination = this.flagShip.sprite.width / 2;
        this.timeToLossString = '00:00:00'
        
        //Making the flag ship advance to the left
        this.flagShipTweenDataIndex = 0;
        this.flagShipArrived = false;
        //Generating arrays of offsets for all sprites of the flag ship
        this.turretXOffsets = [];
        this.flagShip.subEntityGroup.turretGroup.forEach(function(turret) {
            this.turretXOffsets.push(this.flagShip.sprite.x - turret.x);
        }, this);
        this.subSystemXOffsets = [];
        this.flagShip.subEntityGroup.subSystemGroup.forEach(function(subSystem) {
            this.subSystemXOffsets.push(this.flagShip.sprite.x - subSystem.x);
        }, this);
        
        //The tween object that moves the flag ship to the left of the world
        this.flagShipMoveTween = this.game.add.tween(this.flagShip.sprite).to({x : this.flagShipDestination}, this.timeToLoss, null, false);
        this.flagShipMoveTween.onStart.addOnce(function() {
            
        }, this);
        this.flagShipMoveTween.onUpdateCallback(function() {
            
            this.flagShip.subEntityGroup.turretGroup.forEach(function(turret) {
                turret.x = this.flagShip.sprite.x - this.turretXOffsets[turret.originalTurretId];
            }, this);
            
            this.flagShip.subEntityGroup.subSystemGroup.forEach(function(subSystem) {
                subSystem.x = this.flagShip.sprite.x - this.subSystemXOffsets[subSystem.originalSubSystemId];
            }, this);
            
            var timeLeft = -(this.flagShipDestination - this.flagShip.sprite.x) * this.timeToLoss;
            timeLeft /= 3150;
            var displayTime = Math.round(timeLeft * 100) / 100;
            this.flagShipCountDownText.text = 'Time to defeat: ' + timeFromMillis(timeLeft);
            
        }, this);
        
        this.flagShipMoveTween.onComplete.addOnce(function() {
            this.gameOverText.visible = true;
            if(this.player.isDead) {
                this.player.respawnTimer.destroy();
            } else {
                this.player.die();
            }
            GalaxiorConquest.userAccount.statistics.gamesLost++;
            saveAccountToLocal(GalaxiorConquest.userAccount);
        }, this);
        
        //UI
        
        this.gameOverTextStyle = {font: 'bold 14px Arial', fill: '#ffffff', boundsAlignH : 'center', boundsAlignV : 'middle'};
        
        this.uiElements = this.game.add.group();
        this.flagShipCountDownText = this.add.text(this.camera.width / 2, 14, 'Time until defeat: ' + this.timeToLossString, this.gameOverTextStyle);
        this.flagShipCountDownText.fixedToCamera = true;
        this.uiElements.add(this.flagShipCountDownText);
        
        this.gameOverText = this.add.text(this.camera.width / 2, this.camera.height / 2, 'Game Over', {font: 'bold 34px Arial', fill: '#ffffff', boundsAlignH : 'center', boundsAlignV : 'middle'});
        this.gameOverText.anchor.set(0.5);
        this.gameOverText.fixedToCamera = true;
        this.uiElements.add(this.gameOverText);
        this.gameOverText.visible = false;
        
        //An AI manager for all ally fighters
        this.allyAiManager = new AiManager(this.allyFighters, this.flagShip.aliveTurrets.concat(this.flagShip.aliveSubSystems));
        this.aiUpdateTimer = this.game.time.create(false);
        this.aiUpdateTimer.loop(1000, function() {
            this.allyAiManager.evaluateTargets();
        }, this);
        this.allyAiManager.evaluateTargets();
        
        this.flagShipMoveTween.start();
        this.aiUpdateTimer.start();
        
    },
    
    update : function() {
        
        var previousPlayerCoordinates = new Phaser.Point(this.player.sprite.x, this.player.sprite.y);
        
        
        //React to input
        this.player.moveWithArrows(this.cursorKeys);
        this.player.fire(this.playerFireButton);
        
        //Check collisions with flag ship by player
        this.game.physics.arcade.collide(this.player.weapon.bullets, this.flagShip.subEntityGroup.turretGroup, function(bullet, turret) {
            this.attackTurret(bullet, turret);
            if(turret.isDead) {
                GalaxiorConquest.userAccount.statistics.totalPointsEarned += 10;
            }
        }, null, this);
        
        this.game.physics.arcade.collide(this.player.weapon.bullets, this.flagShip.subEntityGroup.subSystemGroup, function(bullet, subSystem) {
            bullet.kill();
            bullet.reset();
            takeDamage(this.flagShip.aliveSubSystems[subSystem.subSystemId], bullet.attackDamage);
            if(subSystem.isDead) {
                GalaxiorConquest.userAccount.statistics.totalPointsEarned += 25;
            }
        }, null, this);
        
        //Check collisions with flag ship by ally fighters
        this.allyAiManager.entityLists.forEach(function(entity, index) {
            this.game.physics.arcade.collide(entity.weapon.bullets, this.flagShip.subEntityGroup.turretGroup, function(bullet, turret) {
                this.attackTurret(bullet, turret);
            }, null, this);
            
            this.game.physics.arcade.collide(entity.weapon.bullets, this.flagShip.subEntityGroup.subSystemGroup, function(bullet, subSystem) {
                bullet.kill();
                bullet.reset();
                takeDamage(this.flagShip.aliveSubSystems[subSystem.subSystemId], bullet.attackDamage);
            }, null, this);
            
            for(i = 0; i < this.flagShip.aliveTurrets.length; i++) {
                this.game.physics.arcade.collide(entity.sprite, this.flagShip.aliveTurrets[i].weapon.bullets, function(entity, bullet) {
                    bullet.kill();
                    bullet.reset();
                    takeDamage(this.allyFighters[entity.originalFighterId], bullet.attackDamage);
                }, null, this);
            }
            
        }, this);
        
        for(i = 0; i < this.flagShip.aliveTurrets.length; i++) {
            this.game.physics.arcade.collide(this.player.sprite, this.flagShip.aliveTurrets[i].weapon.bullets, function(player, bullet) {
                bullet.kill();
                bullet.reset();
                takeDamage(this.player, bullet.attackDamage);
            }, null, this);
            for(j = 0; j < this.allyAiManager.entityLists.length; j++) {
                this.game.physics.arcade.collide(this.player.sprite, this.flagShip.aliveTurrets[i].weapon.bullets, function(player, bullet) {
                    bullet.kill();
                    bullet.reset();
                    takeDamage(this.player, bullet.attackDamage);
                }, null, this);
            }
        }
        
        //Perform AI cycles
        if(this.flagShip.isDead == false) {
            this.flagShip.aiUpdate(this.player.sprite);
            this.allyAiManager.aiUpdate();
        } else {
        }
        
    },
    
    render : function() {
        
        this.game.debug.text('Player health: ' + this.player.health + ' ' + this.player.armour, 2, 28, '#ff0000');
        
    },
    
    attackTurret : function(bullet, turret) {
        bullet.kill();
        bullet.reset();
        //Check if the turret was protected or not
        if(this.flagShip.subSystems[0].isShielding == false) {
            takeDamage(this.flagShip.aliveTurrets[turret.turretId], bullet.attackDamage);
        } else {
            //Temporarily change the sprite frame
            this.turretShieldTimer.add(200, function(turretId) {
                this.flagShip.aliveTurrets[turretId].sprite.frameName = 'turret-larger';
            }, this, turret.turretId);
            this.flagShip.aliveTurrets[turret.turretId].sprite.frameName = 'turret-shielded';
            this.turretShieldTimer.start();
        }
    },
    
    gameWon : function() {
        this.allyAiManager.active = false;
        GalaxiorConquest.userAccount.statistics.totalPointsEarned += 100;
        GalaxiorConquest.userAccount.statistics.gamesWon++;
        saveAccountToLocal(GalaxiorConquest.userAccount);
    }
    
};