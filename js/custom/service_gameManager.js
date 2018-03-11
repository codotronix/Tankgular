angular.module("Tankgular")
.service("gameManager", function ($timeout) {
    var gameLoopCallbacks;
    var gameState; //stopped, running, paused
    var player;    //this should hold updated info of Player in each loop/cycle, like, x,y,size
    var enemies;
    var playerBullet;
    var enemyBullets;
    var playerKilled;
    var destroyedTanks;
    var playerKilledCB;

    this.init = function () {
        gameLoopCallbacks = [];
        gameState = "stopped";
        player = {};
        enemies = {};
        playerBullet = {};
        enemyBullets = {};
        playerKilled = false;
        destroyedTanks = [];
    }
    
    this.startGame = function () {
        gameState = "running";
    };
    
    this.stopGame = function () {
        gameState = "stopped";
    };
    
    this.pauseGame = function () {
        gameState = "paused";
    };
    
    this.getGameState = function () {
        return gameState;
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

    this.setPlayerKilledCallBack = function (cb) {
        playerKilledCB = cb;
    }
        
    this.amIHit = function (enemyObj) {
        if (!playerBullet.alive) {return false;}
        
        if (isColliding(playerBullet, enemyObj)) {
            delete enemies[enemyObj.ID];
            delete enemyBullets[enemyObj.ID];
            return true;
        } else {
            return false;
        }
    }
    
    function runLoop () {
        if (gameState == "running") {
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
                gameState = "stopped";
                playerKilledCB();
                //alert('collision between player and enemy_'+i);
                return;
            }
        }
        
        //check collision between enemy bullet and player tank
        for (var i in enemyBullets) {
            if(isColliding(enemyBullets[i], player)) {
                playerKilled = true;
                gameState = "stopped";
                playerKilledCB();
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