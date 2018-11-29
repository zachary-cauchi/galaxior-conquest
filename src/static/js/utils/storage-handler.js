var guestAccount = new UserAccount({userName : 'Guest', password : null, emailAddress : null, fullName : null});

//Get cookies from the client's device
function getCookie(cookieKey) {
    var key = cookieKey + '=';
    var cookies = document.cookie.split(';');
    
    for(var i = 0; i < cookies.length; i++) {
        
        var cookie = cookies[i];
        //Remove any present whitespace
        while(cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if(cookie.indexOf(cookieKey) == 0) {
            return cookie.substring(key.length, cookie.length);
        }
        
    }
    return 'undefined';
}

//Return a UserAccount object found in Local Storage
function getAccountInLocal(accountKey) {
    if(typeof(Storage) !== 'undefined') {
        var accountFound = JSON.parse(localStorage.getItem(accountKey + 'Account'));
        try {
            var account = new UserAccount(accountFound);
            if(account === null) {
                return null;
            } else {
                return account;
            }
        } catch(err) {
            console.log('Account with username ' + accountKey + ' not found.');
            return null;
        }
    }
}

function accountPresentInLocal(accountKey) {
    if(typeof(Storage) !== 'undefined') {
        var accountFound = localStorage.getItem(accountKey + 'Account');
        if(accountFound === null) {
            return false;
        } else {
            return true;
        }
    }
}

//Save a UserAccount object in Local Storage
function saveAccountToLocal(account) {
    
    if (typeof(Storage) !== 'undefined') {
        if(account.userName === guestAccount.userName && account.password === null && account.emailAddress === null) {
            sessionStorage.setItem(account.userName + 'Account', JSON.stringify(account));
            return;
        }
        var accountFound = getAccountInLocal(account.userName);
        //No account found with the same user name
        if(accountFound === null) {
            localStorage.setItem(account.userName + 'Account', JSON.stringify(account));
        //An account is found with the same name
        } else if (accountFound.userName === account.userName) {
            return;
        }
        
    } else {
        console.log('LocalStorage disabled');
    }
}

function getUserLoggedIn() {
    if(typeof(Storage) !== 'undefined') {
        var user = sessionStorage.getItem('loggedInAs');
        if(user !== null && user !== undefined) {
            return user;
        } else {
            return 'Guest';
        }
    }
}

function getSetting(setting, defaultValue) {
    var settings = JSON.parse(sessionStorage.getItem(getUserLoggedIn() + 'Configuration'));
    var setting = $( settings ).attr(setting);
    if(setting !== undefined) {
        return setting;
    } else {
        sessionStorage.setItem(getUserLoggedIn + 'Configuration', setting + '"' + setting + '":' + defaultValue);
    }
}

function saveSettings(settings) {
    var configurationNo = parseInt(localStorage.getItem('configurations'));
    sessionStorage.setItem(getUserLoggedIn() + 'Configuration', JSON.stringify(settings));
}