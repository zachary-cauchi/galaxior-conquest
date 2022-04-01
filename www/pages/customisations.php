<!DOCTYPE html>
<html>
    <head>
        
        <meta charset="utf-8"/>
        <title>Customisations</title>
        
        <link type="text/css" rel="stylesheet" href="../css/stylesheet.css"/>
        <link type="text/css" rel="stylesheet" href="../css/header.css"/>
        <link type="text/css" rel="stylesheet" href="../css/customisations.css"/>
        <link type="text/css" rel="stylesheet" href="../libs/js/jquery-ui/jquery-ui.css"/>
        
        <script src="../libs/js/jquery-3.1.1.js"></script>
        <script src="../libs/js/jquery.tablesorter.min.js"></script>
        <script src="../libs/js/jquery-ui/jquery-ui.js"></script>
        
        <script src="../scripts/js/account.js"></script>
        <script src="../scripts/js/storage-handler.js"></script>
        <script src="../scripts/js/utilities.js"></script>
        
    </head>
    <body>
        
        <header>
            <?php
                include("../templates/header.html");
            ?>
        </header>
        
        <div id="mainContainer">
            <div id="customisationsContainer">
                <h1 id="customisationsHeading">Customise your experience!</h1>
                <div id="customisationsList">
                    <h3>Seed generation</h3>
                    <div>
                        <label for="useGeo">Use Geolocation</label>
                        <input type="checkbox" name="useGeo"/>
                    </div>
                    <h3>Weapon</h3>
                    <div>
                        <p>Damage</p>
                        <div id="damageSlider">
                            <div id="damageHandle" class="ui-slider-handle"></div>
                        </div>
                    </div>
                </div>
                <button id="btn_applyConf" onclick="commitSettings()">Apply Settings</button>
            </div>
        </div>
        
        <script>
            
            var settings = {ballisticDamage : 25, energyDamage : 8, useGeolocation : true};
            
            $(function() {
                $("#customisationsList").accordion();
                var handle = $( "#damageHandle" );
                $( "#damageSlider" ).slider({
                    value : 25,
                    
                    min : 5,
                    max : 50,
                    step: 1,
                    
                    create: function() {
                        handle.text( $( this ).slider( "value" ) );
                    },
                    
                    slide: function( event, ui ) {
                        handle.text( ui.value );
                        settings = { ballisticDamage : Math.ceil(ui.value / 2), energyDamage : Math.floor(ui.value / 3 )};
                    }
                });
            });
            function commitSettings() {
                if($('#useGeo').attr('checked') == 'true') {
                    settings.useGeolocation = true;
                } else {
                    settings.useGeolocation = false;
                }
                saveSettings(settings);
            }
        </script>
        
    </body>
</html>