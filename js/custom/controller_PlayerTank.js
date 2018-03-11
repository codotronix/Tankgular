angular.module("Tankgular")

.controller("tankCtrl", ['$scope', '$document', 'gameManager', '$window', function ($scope, $document, gameManager, $window) {
	
    var screenHt = $window.innerHeight;
	var screenWd = $window.innerWidth;
    var bullet = {};
    bullet.size = 16;
    bullet.direction = 'Up';
    bullet.speed = 10;    
    
    $scope.tank = {};
	$scope.tank.left = 100;
	$scope.tank.top = 80;
	$scope.tank.direction = "tankRight";
	var tank = {};
	tank.size = 70;
	tank.speed = 4;
    tank.fire = function () {
        if($scope.bulletAlive) {return;}
        
        $scope.bulletTop = $scope.tank.top + (tank.size - bullet.size)/2;
        $scope.bulletLeft = $scope.tank.left + (tank.size - bullet.size)/2;
        $scope.bulletAlive = true;
        bullet.direction = $scope.tank.direction;
    };
    
    
    $scope.bulletTop = 0;
    $scope.bulletLeft = 0;
    $scope.bulletAlive = false;

    $scope.tank.move = function (direction) {
        $scope.tank.direction = direction || $scope.tank.direction || "tankRight";

        switch ($scope.tank.direction) {
            case "tankLeft":
                $scope.tank.left -= tank.speed;
                if($scope.tank.left < 0) {
                    $scope.tank.left = 0;
                }
                break;

            case "tankRight":
                $scope.tank.left += tank.speed;
                if($scope.tank.left > ($scope.field.width - tank.size)) {
                    $scope.tank.left = $scope.field.width - tank.size;
                }
                break;

            case "tankUp":
                $scope.tank.top -= tank.speed;
                if($scope.tank.top < 0) {
                    $scope.tank.top = 0;
                }
                break;

            case "tankDown":
                $scope.tank.top += tank.speed; 
                if($scope.tank.top > ($scope.field.height - tank.size)) {
                    $scope.tank.top = $scope.field.height - tank.size;
                }
                break;
        }
    }
    
    $scope.isPlayerKilled = gameManager.isPlayerKilled;
    
    angular.element($document).on('keydown', function (ev) {
        if(gameManager.getGameState() == "stopped") {return;}
        if (ev.keyCode == 37) {
            $scope.tank.move("tankLeft");
        } else if (ev.keyCode == 38) {
            $scope.tank.move("tankUp");
        } else if (ev.keyCode == 39) {
            $scope.tank.move("tankRight");
        } else if (ev.keyCode == 40) {
            $scope.tank.move("tankDown");
        } else if (ev.keyCode == 32) {
            tank.fire();
        } else {
            return;
        }
        
        //if here, means not returned, means safe to assume that player position has changed
        updatePlayerObj();
    });

    $scope.fire = function () {
        tank.fire();
        //updateBulletInfo();
        //updatePlayerObj();
    }

    // Touchscreen Controls
    //var movingContinuously = false;
    $scope.keepMoving = function (direction) {
        $scope.tank.move(direction);
        //$scope.tank.direction = direction;
        // if (!movingContinuously) {
        //     gameManager.addToLoop([moveContinuously]);
        // }
        updatePlayerObj();
    }

    //This will be called again and again in touchscreen devices
    function moveContinuously () {
        $scope.tank.move();
    }
    //////////////////////////////////////////////////////////////////////

    
    function moveBullet () { //console.log('moveBullet called');
        if ($scope.bulletAlive) {
            if(bullet.direction == 'tankUp') {
                $scope.bulletTop -= bullet.speed;
            } else if (bullet.direction == 'tankDown') {
                $scope.bulletTop += bullet.speed;
            } else if (bullet.direction == 'tankLeft') {
                $scope.bulletLeft -= bullet.speed;
            } else if (bullet.direction == 'tankRight') {
                $scope.bulletLeft += bullet.speed;
            }
        }

        //hide the bullet if it goes out of game world
        if($scope.bulletTop < 0 || $scope.bulletTop > screenHt || $scope.bulletLeft < 0 || $scope.bulletLeft > screenWd) {
            $scope.bulletAlive = false;
        }
        
        updateBulletInfo();
    };
    
    function updatePlayerObj () {
        var player = {};
        player.x = $scope.tank.left;
        player.y = $scope.tank.top;
        player.size = tank.size;
        
        gameManager.updatePlayerObj(player);
    }
    
    function updateBulletInfo () {
        var bulletObj = {};
        bulletObj.x = $scope.bulletLeft;
        bulletObj.y = $scope.bulletTop;
        bulletObj.size = bullet.size;
        bulletObj.alive = $scope.bulletAlive;

        gameManager.updatePlayerBulletInfo (bulletObj);
    }
    
    //update initial position of player obj
    updatePlayerObj();
    
    gameManager.addToLoop([moveBullet]);
		
}]);