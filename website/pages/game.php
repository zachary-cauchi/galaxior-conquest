<!DOCTYPE html>
<html>
    <head>
        <title>Play now|Galaxior Conquest</title>
        <meta charset="utf-8"/>
        <link type="text/css" rel="stylesheet" href="../css/stylesheet.css"/>
        <link type="text/css" rel="stylesheet" href="../css/header.css"/>
        <link type="text/css" rel="stylesheet" href="../css/game.css"/>
        
        <!-- Library scripts -->
        <script src="../libs/js/phaser.js"></script>
        <script src="../libs/js/slick-ui.min.js"></script>
        <script src="../libs/js/jquery-3.1.1.js"></script>
        
        <!-- Utility scripts -->
        <script src="../scripts/js/account.js"></script>
        <script src="../scripts/js/storage-handler.js"></script>
        <script src="../scripts/js/utilities.js"></script>
        
        <!-- Game utility scripts -->
        <script src="../game/object-scripts/killable.js"></script>
        <script src="../game/object-scripts/fighter.js"></script>
        <script src="../game/object-scripts/player.js"></script>
        <script src="../game/object-scripts/ally-fighter.js"></script>
        <script src="../game/scripts/ai-manager.js"></script>
        <script src="../game/object-scripts/flag-ship.js"></script>
        <script src="../game/scripts/attack-handler.js"></script>
        
        <!-- Game state scripts -->
        <script src="../game/state-scripts/Boot.js"></script>
        <script src="../game/state-scripts/Preloader.js"></script>
        <script src="../game/state-scripts/FlagShipAssault.js"></script>
    </head>
    <body>
        
        <header>
        <?php
            include("../templates/header.html");
        ?>
        </header>
        
        <div id="mainContainer">
            <div id="gameContainer"></div>
        </div>
        
        <script>
            window.onload = function() {
                
                var gameWidth = 800;
                var gameHeight = 600;
                
                var userLoggedIn = getUserLoggedIn();
                var playerAccount;
                if(userLoggedIn !== 'Guest') {
                    playerAccount = getAccountInLocal(userLoggedIn);
                    console.log(playerAccount.emailAddress);
                }
                
                if(getSetting('useGeolocation') == true) {
                    $.ajax({
                        type: 'POST',
                        url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCB7rWJmeQP39Y6DFJCrC9_6NfX4KfIa8w',
                        dataType: 'json',
                        data : '',
                        success: function(json) {

                            var latitude = Math.ceil(json.location.lat);
                            latitude -= latitude % 2; 
                            var longitude = Math.ceil(json.location.lng);
                            longitude -= longitude % 2;
                            seed = latitude + longitude;
                            
                        }
                    });
                }
                
                var game = new Phaser.Game(gameWidth, gameHeight,  Phaser.CANVAS, 'gameContainer', null, false, false);
                
                game.state.add('Boot', GalaxiorConquest.Boot);
                game.state.add('Preloader', GalaxiorConquest.Preloader);
                game.state.add('FlagShipAssault', GalaxiorConquest.FlagShipAssault);
                game.state.start('Boot');
            };
        </script>
        
    </body>
</html>