function AiManager(controllableEntities, targetEntities) {
    

    this.entityLists = controllableEntities;
    this.active = true;
    
    for(i = 0; i < this.entityLists.length; i++) {
        this.entityLists[i].aiManager = this;
    }
    
    this.possiblePriorities = {
        HEALTHIEST : 8,
        SHIELDS : 15,
        WEAKEST : 10
    };
    
    this.currentPriority = this.possiblePriorities.HEALTHIEST;
    
    //An array of multipliers for calculating target priority per target type
    this.entityPriorityList = {
        TURRET : 3,
        SHIELD_GENERATOR : 5
    };
    
    //Top priority targets
    this.rankingTargets = {
        strongest : {health : 0, armour : 0},
        weakest : {health : Infinity, armour : Infinity},
        subSystem : {health : 0, armour : 0},
    };
    
    this.overallRankedTarget = {entity : {health : 0, armour : 0}, priority : 0};
    
    this.targetAssignments = {
        strongest : 0,
        weakest : 0,
        subSystems : 0
    };
    
    //A multi-dimensional array of all possible targets to evaluate
    this.listOfTargets = {};
    
    //Sorting the target entities into sub-arrays based on entity type
    targetEntities.forEach(function(target) {
        if(target instanceof Turret) {
            if(this.listOfTargets.turrets === undefined) {
                this.listOfTargets.turrets = [];
            }
            this.listOfTargets.turrets.push(target);
        } else if(target instanceof ShieldGenerator) {
            if(this.listOfTargets.shieldGenerator === undefined) {
                this.listOfTargets.shieldGenerator = [];
            }
            this.listOfTargets.shieldGenerator.push(target);
        }
    }, this);
    
}

AiManager.prototype = {
    
    //Calculate priority of individual target entity with a defined bias
    calculatePriority : function(entity, aiTargetPriority, bias = 1) {
        var health = entity.health;
        var armour = entity.armour;

        var priority = 0;
        
        if(entity.health > 0) {
            var health = entity.health;
            var armour = entity.armour > 0 ? entity.armour : 1;

            //Calculating type-based priority of given entity
            if(entity instanceof Turret) {
                priority = aiTargetPriority.TURRET * (health / armour) * bias;
            } else if(entity instanceof ShieldGenerator) {
                priority = aiTargetPriority.SHIELD_GENERATOR * (health / armour) * bias;
            }

            return priority;
        }

    },
    
    //Update AI targets list
    evaluateTargets : function() {
        
        var strongestEntity = null;
        var weakestEntity = null;
        var shieldGenerator = null;
        
        this.rankingTargets.strongest = {health : 0, armour : 0};
        this.rankingTargets.weakest = {health : Infinity, armour : Infinity};
        this.rankingTargets.subSystem = {health : 0, armour : 0};
        
        //Passing in this to use as context reference in anonymous functions
        var selfReference = this;
        
        //Update ranked list of targets
        $.each(this.listOfTargets, function(index, value) {
            value.forEach(function(target) {
                if(target.isDead) {
                    if(target instanceof Turret) {
                        selfReference.listOfTargets.turrets.splice(selfReference.listOfTargets.turrets.indexOf(target), 1);
                    } else if(target instanceof ShieldGenerator) {
                        selfReference.listOfTargets.shieldGenerator.splice(selfReference.listOfTargets.shieldGenerator.indexOf(target), 1);
                    }
                } else {
                    //Check if the target is the strongest or weakest
                    if(target.health > selfReference.rankingTargets.strongest.health && target.armour > selfReference.rankingTargets.strongest.armour) {
                        selfReference.rankingTargets.strongest = target;
                    } else if(target.health < selfReference.rankingTargets.weakest.health && target.armour < selfReference.rankingTargets.weakest.armour) {
                        selfReference.rankingTargets.weakest = target;
                    } else if(target instanceof ShieldGenerator) {
                        selfReference.rankingTargets.subSystem = target;
                    }
                }
            }, this);
        });
        
        var priority = 0;
        
        this.overallRankedTarget = {entity : {}, priority : 0, rank : ''};
        
        //Determine overall highest priority target
        $.each(this.rankingTargets, function(index, target) {
            if(index == 'strongest') {
                priority = selfReference.calculatePriority(target, selfReference.entityPriorityList, selfReference.possiblePriorities.HEALTHIEST);
            } else if(index == 'weakest') {
                priority = selfReference.calculatePriority(target, selfReference.entityPriorityList, selfReference.possiblePriorities.WEAKEST);
            } else if(index == 'subSystem') {
                priority = selfReference.calculatePriority(target, selfReference.entityPriorityList, selfReference.possiblePriorities.SHIELDS);
            }
            
            if(priority > selfReference.overallRankedTarget.priority) {
                selfReference.overallRankedTarget = {entity : target, priority : priority, rank : index};
            }
        });
        
    },

    aiUpdate : function(targets) {

        for(i = 0; i < this.entityLists.length; i++) {
            if(this.entityLists[i].aiTarget !== null) {
                this.entityLists[i].engageTarget();
            } else {
                this.entityLists[i].aiTarget = {entitySprite : this.overallRankedTarget.entity.sprite};
            }
        }
        
    },
    
    requestTarget : function(priority, original) {
        
        if(this.rankingTargets.strongest.sprite == original || this.rankingTargets.weakest.sprite == original || this.rankingTargets.subSystem.sprite == original) {
            this.evaluateTargets();
        }
        
        switch(priority) {
            case this.possiblePriorities.HEALTHIEST:
                this.targetAssignments.strongest += 1;
                
                return this.overallRankedTarget.entity;
            break;
            
            case this.possiblePriorities.WEAKEST:
                this.targetAssignments.weakest += 1;
                return this.overallRankedTarget.entity;
            break;
            
            case this.possiblePriorities.SHIELDS:
                this.targetAssignments.subSystems += 1;
                return this.overallRankedTarget.entity;
            break;
                
            default:
                return;
        }
    }
    
};