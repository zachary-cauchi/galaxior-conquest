<!DOCTYPE html>
<html>
    <head>
        
        <meta charset="utf-8"/>
        <title>Leaderboard</title>
        
        <link type="text/css" rel="stylesheet" href="../css/stylesheet.css"/>
        <link type="text/css" rel="stylesheet" href="../css/header.css"/>
        <link type="text/css" rel="stylesheet" href="../css/leaderboard.css"/>
        <link type="text/css" rel="stylesheet" href="../assets/themes/tablesorter-blue/style.css"/>
        
        <script src="../libs/js/jquery-3.1.1.js"></script>
        <script src="../libs/js/jquery.tablesorter.min.js"></script>
        
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
            <div id="tableContainer">
                <table id="leaderboardTable" class="tablesorter">
                    <thead>
                        <tr>
                            <th class="header">Username</th>
                            <th class="header">Score</th>
                            <th class="header">Kills</th>
                            <th class="header">Deaths</th>
                            <th class="header">Wins</th>
                            <th class="header">losses</th>
                            <th class="header">W/L Ratio</th>
                        </tr>
                    </thead>
                    <tbody id="accountHolder">
                        
                    </tbody>
                </table>
            </div>
        </div>
        
        <script>
            $(document).ready(function() {
                $.each(localStorage, function(index, value) {
                    var account = JSON.parse(value);
                    var winLossRatio = isFinite(account.statistics.gamesWon / account.statistics.gamesLost) ? account.statistics.gamesWon / account.statistics.gamesLost : 0;
                    var rowString = '<tr class="accountRow">'
                                    + '<td>' + account.userName + '</td>'
                                    + '<td>' + account.statistics.totalPointsEarned + '</td>'
                                    + '<td>' + account.statistics.enemiesKilled + '</td>'
                                    + '<td>' + account.statistics.playerDeaths + '</td>'
                                    + '<td>' + account.statistics.gamesWon + '</td>'
                                    + '<td>' + account.statistics.gamesLost + '</td>'
                                    + '<td>' + winLossRatio + '</td>'
                                    + '</tr>';
                    $('#accountHolder').append(rowString);
                });
                
                $('#leaderboardTable').tablesorter();
                
            });
        </script>
        
    </body>
</html>