function UserAccount(accountData) {
    if(accountData !== undefined || accountData !== null) {
        this.userName = accountData.userName;
        this.password = accountData.password;
        this.emailAddress = accountData.emailAddress;
        this.fullName = accountData.fullName;
        if(accountData.statistics === null || accountData.statistics === undefined) {
            this.statistics = new Statistics();
        } else {
            this.statistics = accountData.statistics;
        }
    }
}

function Statistics(statisticData) {
    if(statisticData === undefined) {
        this.enemiesKilled = 0;
        this.playerDeaths = 0;
        this.totalPointsEarned = 0;
        this.gamesWon = 0;
        this.gamesLost = 0;
    } else {
        this.enemiesKilled = statisticData.enemiesKilled;
        this.playerDeaths = statisticData.playerDeaths;
        this.totalPointsEarned = statisticData.totalPointsEarned;
        this.gamesWon = statisticData.gamesWon;
        this.gamesLost = statisticData.gamesLost;
    }
}

/*
UserAccount.prototype.createStatObject = function() {
    this.statisticsId = this.userName + "Statistics";
    var statistics = {
        enemiesKilled : "",
        playerDeaths : "",
        totalPointsEarned : ""
    };
    localStorage.setItem(this.statisticsId, JSON.stringify(statistics));
}
*/