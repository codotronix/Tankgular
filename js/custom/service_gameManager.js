var app = angular.module("MainApp");

app.service("gameManager", function ($timeout) {
    var gameLoopCallbacks = [];
    var gameRunning = false;
    var player = {};    //this should hold updated info of Player in each loop/cycle, like, x,y,size
    var enemies = {};
    var playerBullet = {};
    var enemyBullets = {};
    var playerKilled = false;
    var destroyedTanks = [];
    
    this.startGame = function () {
        gameRunning = true;
    };
    
    this.stopGame = function () {
        gameRunning = false;
    };
    
    this.addToLoop = function (callbackFnArray) {        
        for(var i in callbackFnArray) {
            gameLoopCallbacks.push(callbackFnArray[i]);
        }        
    };
    
    this.updatePlayerObj = function (obj) {
        player = obj;
        //console.log(player);
    };
    
    this.updateEnemyInfo = function (id, obj) {
        enemies[id] = obj;
        //console.log(enemies);
    };
    
    this.updateEnemyBulletsInfo = function (id, obj) {
        enemyBullets[id] = obj;
        //console.log(enemyBullets);
    };
    
    this.updatePlayerBulletInfo = function (obj) {
        playerBullet = obj;
        //console.log(enemyBullets);
    };
    
    this.isPlayerKilled = function () {
        return playerKilled;
    };
    
    this.isGameOver = function () {
        return !gameRunning;
    };
    
    this.amIHit = function (enemyObj) {
        if (!playerBullet.alive) {return false;}
        
        if (isColliding(playerBullet, enemyObj)) {
            delete enemies[enemyObj.ID];
            return true;
        } else {
            return false;
        }
    }
    
//    this.isTankDestroyed = function (tankID) {
//        //console.log('isTankDestroyed='+tankID);
//        //console.log(destroyedTanks);
//        if (destroyedTanks.indexOf(tankID + "") >= 0) { //console.log('true');
//            return true;
//        } else { //console.log('false');
//            return false;
//        }
//    };
    
    function runLoop () {
        if (gameRunning) {
            //call all the callback functions to update positions of enemies and bullets etc
            for(var i in gameLoopCallbacks) {
                gameLoopCallbacks[i]();
            }
            
            //check for collisions
            checkCollision();
        }
        $timeout(runLoop, 1000/60);
    }
    
    function checkCollision () {
        //check collision between enemy tank and player tank
        for (var i in enemies) {
            if(isColliding(enemies[i], player)) {
                playerKilled = true;
                gameRunning = false;
                //alert('collision between player and enemy_'+i);
                return;
            }
        }
        
        //check collision between enemy bullet and player tank
        for (var i in enemyBullets) {
            if(isColliding(enemyBullets[i], player)) {
                playerKilled = true;
                gameRunning = false;
                //alert('collision between player and enemyBullet_'+i);
                return;
            }
        }
    }    
    
    function isColliding (objA, objB) {
        if(typeof(objA) == "undefined" || typeof(objB) == "undefined") {return false;}
        
        if (
            (objA.x + objA.size < objB.x) || 
            (objA.x > objB.x + objB.size) ||
            (objA.y + objA.size < objB.y) ||
            (objA.y > objB.y + objB.size)
            ) {
            return false;
        } else {
            //console.log("collision");
            //console.log(objA); console.log(objB);
            return true;
        }
        
    }
    
    runLoop();
});