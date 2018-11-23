function Killable(startingHealth, startingArmour) {
    this.startingHealth = startingHealth;
    this.startingArmour = startingArmour;
    this.health = startingHealth;
    this.armour = startingArmour;
    this.isDead = false;
}

Killable.prototype = {
    die : function() {}
};