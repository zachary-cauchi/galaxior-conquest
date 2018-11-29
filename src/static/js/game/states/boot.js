/**
 * Start boot prototype, the state during which initial game assets are loaded
 */
var boot = function() {
  console.log('%cAdding boot state...', LOG_INFO_COLOR);
};

/**
 * Sets up various game functions for the "boot" state
 */
boot.prototype = {
  preload: startBoot,

  //Preliminary function, setting necessary parameters.
  create: function() {

    console.log('%cConfiguring game object', LOG_INFO_COLOR);

    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = false;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = 800;
    this.scale.minHeight = 600;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.stage.forcePortrait = true;
    this.scale.refresh();

    console.log('%cPerforming final configurations', LOG_INFO_COLOR);
    this.input.addPointer();
    this.stage.backgroundColor = '#171642';
        
    this.time.advancedTiming = true;
    
    this.game.physics.arcade.skipQuadTree = false;
    
    // Start the Preloader state
    //this.state.start('Preloader');
    console.log("Calling next state");
    //game.state.start(stateNames.play);
  }

};

/**
 * Start processes required for booting the game
 */
function startBoot(game) {
  console.log('%cBooting...', LOG_INFO_COLOR);

  // add event that transfers game to the next game state after asset loading
  // has completed
  game.load.onLoadComplete.addOnce(function () {
    game.state.start(stateNames.assault);
  }, this);

  // load assets required for starting the game
  loadInitialAssets(game);
}

/**
 * Load initial assets for the game
 */
function loadInitialAssets(game) {
  console.log('%cLoading initial game assets...', LOG_INFO_COLOR);

  // load json specifying what assets are needed for the game
  game.load.text('assets', 'json/assets.json');

  // manually tell phaser to load assets that are queued up above
  game.load.start();
}

// add state to game
game.state.add(stateNames.boot, boot);
