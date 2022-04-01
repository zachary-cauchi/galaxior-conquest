function takeDamage(entity, attackDamage) {
    
    if(entity.isDead == true) {
        return;
    }
    
    //How much damage will be done to the player
    var totalDamage = attackDamage.ballisticsDamage + attackDamage.energyDamage;
    
    //The player still has some armour remaining
    if(entity.armour > 0) {
        //Amount of health to be removed
        var amountReduced = Math.floor(attackDamage.ballisticsDamage / 2);
        //Amount of armour health to be removed
        var armourAmountReduced = Math.ceil(attackDamage.ballisticsDamage / 2);
        
        //Remove the calculated amount from the total damage
        totalDamage -= (amountReduced + attackDamage.energyDamage);
        
        //Check if the armour can withstand the damage or not
        if((entity.armour - armourAmountReduced) < 0) {
            //If it can't add the extra damage to totalDamage
            armourAmountReduced -= entity.armour;
            entity.armour = 0;
            totalDamage += armourAmountReduced;
        } else {
            entity.armour -= armourAmountReduced;
        }
        
        
        
    }
    
    //Check if this hit will be the final blow
    if((entity.health - totalDamage) <= 0) {
        entity.health = 0;
        entity.armour = 0;
        entity.die();
    } else {
        entity.health -= totalDamage;
    }
    
    //Damage taken by turrets and subsystems will have it removed from their parent flag ship
    //This is purposely left after the prior if statement since all surplus damage should affect the flag ship 
    if($.isFunction(entity.updateFlagship)) {
        entity.updateFlagship(totalDamage);
    }
    
}