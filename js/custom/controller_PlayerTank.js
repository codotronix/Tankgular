var app = angular.module("MainApp");

app.controller("tankCtrl", ['$scope', '$document', 'gameManager', '$window', function ($scope, $document, gameManager, $window) {
	
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

	$scope.tank.moveLeft = function () { 
		$scope.tank.direction = "tankLeft";
		$scope.tank.left -= tank.speed;
		if($scope.tank.left < 0) {
			$scope.tank.left = 0;
		}
	};

	$scope.tank.moveRight = function () {
		$scope.tank.direction = "tankRight";
		$scope.tank.left += tank.speed;
		if($scope.tank.left > ($scope.field.width - tank.size)) {
			$scope.tank.left = $scope.field.width - tank.size;
		}
	};

	$scope.tank.moveUp = function () {
		$scope.tank.direction = "tankUp";
		$scope.tank.top -= tank.speed;
		if($scope.tank.top < 0) {
			$scope.tank.top = 0;
		} 
	};

	$scope.tank.moveDown = function () {
		$scope.tank.direction = "tankDown";
		$scope.tank.top += tank.speed; 
		if($scope.tank.top > ($scope.field.height - tank.size)) {
			$scope.tank.top = $scope.field.height - tank.size;
		} 
	};
    
    $scope.isPlayerKilled = gameManager.isPlayerKilled;
    
    angular.element($document).on('keydown', function (ev) {
        if(gameManager.getGameState() == "stopped") {return;}
        if (ev.keyCode == 37) {
            $scope.tank.moveLeft();
        } else if (ev.keyCode == 38) {
            $scope.tank.moveUp();
        } else if (ev.keyCode == 39) {
            $scope.tank.moveRight();
        } else if (ev.keyCode == 40) {
            $scope.tank.moveDown();
        } else if (ev.keyCode == 32) {
            tank.fire();
        } else {
            return;
        }
        
        //if here, means not returned, means safe to assume that player position has changed
        updatePlayerObj();
    });
    
    function moveBullet () { //console.log('moveBullet called');
        if ($scope.bulletAlive) {console.log('moveBullet called');
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