<!DOCTYPE html>
<html>
    <head>
        <title>Galaxior Conquest Login</title>
        <meta charset="utf-8"/>
        <link type="text/css" rel="stylesheet" href="../css/login.css"/>
        <link type="text/css" rel="stylesheet" href="../css/blank-with-logo.css"/>
        <link type="text/css" rel="stylesheet" href="../css/stylesheet.css"/>
        <link type="text/css" rel="stylesheet" href="../css/error.css"/>
        
        <!-- Libraries -->
        <script src="../libs/js/jquery-3.1.1.js"></script>
        
        <!-- External scripts -->
        <script src="../scripts/js/account.js"></script>
        <script src="../scripts/js/account-handler.js"></script>
        <script src="../scripts/js/storage-handler.js"></script>
    </head>
    <body>
        
        <?php
        include("../templates/blank-with-logo.html");
        ?>
        
        <div id="mainContainer">
            <div id="loginContainer">
                <h1>Login</h1>
                <form id="loginForm" method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" onsubmit="return validateLogin(document);" accept-charset="utf-8">
                    <input type="text" name="txtUserName" placeholder="Username" required value="<?PHP if(isset($_POST['txtUserName'])) echo htmlspecialchars($_POST['txtUserName']); ?>"/>
                    <input type="password" name="pwdPassword" placeholder="Password" required value=""/>
                    <br/>
                    <input id="submitButton" type="submit" name="login" value="Login"/>
                </form>
            </div>
            <div id="errorDisplay">
            </div>
        </div>
        
    </body>
</html>