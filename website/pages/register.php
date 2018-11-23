<?php
    if(isset($_COOKIE["userSignup"]) && isset($_POST)) {
        $_POST = array();
    }
?>    

<!DOCTYPE html>
<html>
    <head>
        <title>Create your new account</title>
        <meta charset="utf-8"/>
        
        <!-- Stylesheets -->
        <link type="text/css" rel="stylesheet" href="../css/blank-with-logo.css"/>
        <link type="text/css" rel="stylesheet" href="../css/register.css"/>
        <link type="text/css" rel="stylesheet" href="../css/error.css"/>
        <link type="text/css" rel="stylesheet" href="../css/stylesheet.css"/>
        
        <!-- Scripts to load -->
        <script src="../libs/js/jquery-3.1.1.js"></script>
        <script src="../scripts/js/account.js"></script>
        <script src="../scripts/js/account-handler.js"></script>
        <script src="../scripts/js/storage-handler.js"></script>
    </head>
    <body>
        
        <?php
        include("../templates/blank-with-logo.html");
        ?>
        
        <div id="successContainer">
            <h2 id="successTitle">Success!</h2>
            <p>You have successfully registered your account. Please open the <a href="login.php">Login</a> page to sign in with your new account.</p>
        </div>
        
        <form id="signupForm" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>" accept-charset="utf-8" onsubmit="return validateForm()" method="post">
            <fieldset>
                <legend>Account</legend>
                <input type="email" name="txtEmail" placeholder="Email address" required value="<?PHP if(isset($_POST['txtEmail'])) echo htmlspecialchars($_POST['txtEmail']); ?>"/>
                <br/>
                <input type="text" name="pwdPassword" placeholder="Password" maxlength="30" required value="<?PHP if(isset($_POST['pwdPassword'])) echo htmlspecialchars($_POST['pwdPassword']); ?>"/>
                <br/>
                <input type="password" name="pwdConfirmPassword" placeholder="Confirm password" maxlength="30" required/>
            </fieldset>
            <fieldset>
                <legend>Profile</legend>
                <input type="text" id="txtUserName" name="txtUserName" placeholder="User name" maxlength="35" required value="<?PHP if(isset($_POST['txtUserName'])) echo htmlspecialchars($_POST['txtUserName']); ?>"/>
                <br/>
                <input type="text" id="txtFullName" name="txtFullName" placeholder="Full name" maxlength="60" required value="<?PHP if(isset($_POST['txtFullName'])) echo htmlspecialchars($_POST['txtFullName']); ?>"/>
            </fieldset>
            <p>In order to register, one must agree to the Terms &amp; Conditions specified.</p>
            <div id="radioContainer">
                <input type="radio" id="rbtnAgree" name="rbtnTermsCond" value="Agree"/>
                <label for="rbtnAgree" form="signupForm">I agree to the Terms &amp; Conditions</label>
                <br/>
                <input checked="true" id="rbtnDisagree" type="radio" name="rbtnTermsCond" value="Disagree"/>
                <label for="rbtnDisagree" form="signupForm">I disagree</label>
            </div>
            <input type="submit" id="register" value="Register"/>
        </form>
        <div id="errorDisplay"></div>
        
        <script>
            //Check if the user successfully registered
            $(function() {
                if(getCookie('userSignup') == 'successful') {
                    
                    $('#successContainer').show();
                    
                    //Disable text fields
                    var elements = document.getElementById('signupForm').getElementsByTagName('input');
                    for (var i = 0, len = elements.length; i < len; ++i) {
                        elements[i].setAttribute('value', '');
                        elements[i].readOnly = true;
                    }
                    
                    document.getElementById('rbtnAgree').disabled = true;
                    document.getElementById('rbtnDisagree').disabled = true;
                    document.getElementById('register').disabled = true;
                    
                } else {
                    document.getElementById('successContainer').style.visibility = 'hidden';
                }
                
            });
        </script>
        
    </body>
</html>