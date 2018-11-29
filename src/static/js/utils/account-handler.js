function validateForm() {
    
    var sendData = true;
    var errorMessageContainer = document.getElementById('errorDisplay');
    var emailEntered = document.getElementsByName('txtEmail')[0].value;
    var password = document.getElementsByName('pwdPassword')[0].value;
    var enteredUserName = document.getElementsByName('txtUserName')[0].value;
    var enteredPlayerName = document.getElementsByName('txtFullName')[0].value;
    
    var pwdMismatchMessage = '<p class="errorMessage">The password in the \'confirm password\' field does not match. Please re-enter it.</p>';
    var incompleteMessage = '<p class="errorMessage">One or more of the required fields is invalid or empty. Please fill in all required fields with a valid entry to continue.</p>';
    var disagreeMessage = '<p class="errorMessage">Please read the terms and conditions and tick the \'I agree\' button.</p>';
    
    errorMessageContainer.innerHTML = "";
                    
    if(emailEntered.trim() == '' || password.trim() == '' || emailEntered === null || password === null) {

        errorMessageContainer.innerHTML += incompleteMessage;
        
        sendData = false;
        
    }
    
    if(accountPresentInLocal(enteredUserName)) {
        errorMessageContainer.innerHTML += '<p class="errorMessage">This user name is already taken. Please enter another one</p>';
        sendData = false;
    }
    
    if(password != document.getElementsByName('pwdConfirmPassword')[0].value) {
        sendData = false;
        errorMessageContainer.innerHTML += pwdMismatchMessage;
    }
    
    //Keeping record of the new account
    if(sendData == true && $('#rbtnAgree').is(':checked')) {
        //Save account to local storage
        var accountData = {userName : enteredUserName, password : password, emailAddress : emailEntered, fullName : enteredPlayerName};
        console.log('Saving account');
        var account = new UserAccount(accountData);
        saveAccountToLocal(account);
        document.cookie = 'userSignup=successful';
        document.getElementById('signupForm').setAttribute('action', 'http://localhost:8888/galaxior-conquest/pages/login.php?signedUp=true');
    } else {
        if(!$('#rbtnAgree').is(':checked')) {
            errorMessageContainer.innerHTML += disagreeMessage;
        }
        sendData = false;
    }
    
    return sendData;
}

function validateLogin(document) {
    
    
    var loginValid = false;
    var userName = document.getElementsByName('txtUserName')[0].value;
    var password = document.getElementsByName('pwdPassword')[0].value;
    
    var errorMessageContainer = document.getElementById('errorDisplay');
    var userNotPresentError = 'User not found. Please try again.';
    var passwordIncorrectError = 'Password is incorrect. Please try again.';
    var invalidFieldsError = "";
    
    errorMessageContainer.innerHTML = '';
    
    if(userName === null || password === null || userName.trim() == '' || password.trim() == '') {
        errorMessageContainer.innerHTML = '<p class="errorMessage">Invalid data found. Please re-enter username and password.</p>';
        return false;
    }
    
    var accountFound = getAccountInLocal(userName);
    if(accountFound === 'undefined') {
        errorMessageContainer.innerHTML = '<p class="errorMessage">No user found with the name ' + userName + '. Please try again.</p>';
        return false;
    }
    
    if(password == accountFound.password) {
        sessionStorage.setItem('loggedInAs', accountFound.userName);
        document.getElementById('loginForm').setAttribute('action', 'http://localhost:8888/galaxior-conquest/index.html');
        return true;
    } else {
        errorMessageContainer.innerHTML = '<p class="errorMessage">Password is incorrect. Please try again.</p>';
        return false;
    }

    return false;
}