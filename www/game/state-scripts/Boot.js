/*
The global object representing the game.
It contains all the global variables,
state constructors and state prototypes
needed by the 'game' object.
*/
var GalaxiorConquest = {};

//The account representing the user playing the game.
GalaxiorConquest.userAccount = getUserLoggedIn() === 'Guest' ? guestAccount : getAccountInLocal(getUserLoggedIn()); 

GalaxiorConquest.Boot = function(game) {};

GalaxiorConquest.Boot.prototype = {
    
    //Loading of assets for the Preloader state
    preload: function() {
        this.load.image('preloadBar', '../game/assets/loader-bar.png');
    },
    
    //Preliminary function, setting necessary parameters.
    create: function() {
        this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = false;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 800;
		this.scale.minHeight = 600;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.stage.forcePortrait = true;
		this.scale.refresh();

		this.input.addPointer();
		this.stage.backgroundColor = '#171642';
        
        this.time.advancedTiming = true;
        
        this.game.physics.arcade.skipQuadTree = false;
        
        this.state.start('Preloader');
    }
    
};