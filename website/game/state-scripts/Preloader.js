//Preloader constructor and variables used
GalaxiorConquest.Preloader = function(game) {
    this.preloadBar = null;
    this.ready = false;
};

//Prototype methods used by the preloader
GalaxiorConquest.Preloader.prototype = {
	
    //Loading all assets to be used by the game
	preload: function () {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
        this.load.image('playButton', '../game/assets/ui/play-button.png');
        this.load.bitmapFont('galaxiorLarge', '../fonts/galaxior/galaxior1.png', '../fonts/galaxior/galaxior1.fnt');
        
        //Game assets
        this.load.image('spaceBG', '../game/assets/scene/deep-space.jpg');
        
        //Player assets
        this.load.atlas('playerShip', '../game/assets/entities/player/player.png', '../game/assets/entities/player/player.json');
        
        //Ally fighter assets
        this.load.image('allyFighter', '../game/assets/entities/ally-fighter/alive.png');
        
        //Enemy entity assets
        this.load.image('flagShip', '../game/assets/entities/flag-ship/sprites/flag-ship.png');
        this.load.image('flagShipDestroyed', '../game/assets/entities/flag-ship/sprites/flag-ship-dead.png');
        this.load.atlas('basicTurret', '../game/assets/entities/turret/turret.png', '../game/assets/entities/turret/turret.json');
        this.load.atlas('shieldGenerator', '../game/assets/entities/flag-ship/shield-generator/shield-generator.png', '../game/assets/entities/flag-ship/shield-generator/shield-generator.json');
        
        //Particle assets
        this.load.image('turretLaser', '../game/assets/particles/flak-laser.png');
        this.load.image('burstShot', '../game/assets/particles/burst-shot.png');
        
	},
    
	create: function () {
		this.preloadBar.cropEnabled = false;
	},
    
    //Method to be called when all assets have been loaded
	update: function () {
	   	this.ready = true;
        this.state.start('FlagShipAssault');
	}
};