angular.module("Tankgular")

.directive("enemyTank", function ($window, gameManager, $rootScope) {
	return {		
		restrict: 'E',
		/*replace: true,*/
		/*transclude: true,*/
		scope:{
			tankId:'='
		},
		controller: function ($scope) {
            
			var size = 70;
			var screenHt = $window.innerHeight;
			var screenWd = $window.innerWidth;
			$scope.left =  screenWd/2 +  Math.random() * (screenWd/2 - size); //Math.random() * (screenWd - size*2) + size;
			$scope.top =  screenHt/2 +  Math.random() * (screenHt/2 - size);  //Math.random() * (screenHt - size*2) + size;
			$scope.direction = ["Left", "Right", "Up", "Down"][Math.floor(Math.random() * 4)];
            $scope.alive = true;
            
			$scope.bulletTop = 0;
			$scope.bulletLeft = 0;
			$scope.bulletAlive = false;
            $scope.isDestroyed = false;

			var bullet = {};
			bullet.size = 16;
			bullet.direction = 'Up';
			bullet.speed = 10;
            
            //this object will prevent madly left/right/left/right or up/down/up/down movement
			var nextDirection = {};
			nextDirection.Left = ["Left", "Up", "Down"];
			nextDirection.Right = ["Right", "Up", "Down"];
			nextDirection.Up = ["Left", "Right", "Up"];
			nextDirection.Down = ["Left", "Right", "Down"];

			var speed = 2;			
			var count = 0;
			var nxtDir = "Left";
            
            
            /********************************************************************************************
            * This function is responsible for moving the Enemy Tank and Its Bullet, if present
            *********************************************************************************************/
			function moveTank () {
                if(!$scope.alive) {return;}
				if (count % 15 == 0) {
					count = 1;
					nxtDir = nextDirection[$scope.direction][Math.floor(Math.random() * 3)];
				} 
				count++;
				if(nxtDir == "Left") {
					$scope.direction = "Left";
					$scope.left -= speed;
					if($scope.left < 0) {
						$scope.left = 0;
						nxtDir = "Right";
					}
				} 
				else if (nxtDir == "Right") {
					$scope.direction = "Right";
					$scope.left += speed;
					if($scope.left > (screenWd - size)) {
						$scope.left = screenWd - size;
						nxtDir = "Left";
					}
				}
				else if (nxtDir == "Up") {
					$scope.direction = "Up";
					$scope.top -= speed;
					if($scope.top < 0) {
						$scope.top = 0;
						nxtDir = "Down";
					}
				}
				else if (nxtDir == "Down") {
					$scope.direction = "Down";
					$scope.top += speed;
					if($scope.top > (screenHt - size)) {
						$scope.top = screenHt - size;
						nxtDir = "Up";
					}
				}
                
                updateEnemyInfo();
                checkIfHit();
			};            
            
            
            /********************************************************************************************************
            ************** This Function Will Create A Bullet *******************************************************
            ********************************************************************************************************/
			function createBullet () {
				if(!$scope.bulletAlive) {   //if the previous bullet is no more alive
					var rand = Math.floor(Math.random() * 99);
					if(rand % 2 == 0) {
						bullet.direction = $scope.direction;
						if(bullet.direction == 'Up') {
							$scope.bulletTop = $scope.top - bullet.size/2;
							$scope.bulletLeft = $scope.left + size / 2  - bullet.size/2;
						} else if (bullet.direction == 'Down') {
							$scope.bulletTop = $scope.top + size + bullet.size/2;
							$scope.bulletLeft = $scope.left + size / 2  - bullet.size/2;
						} else if (bullet.direction == 'Left') {
							$scope.bulletTop = $scope.top + size / 2  - bullet.size/2;
							$scope.bulletLeft = $scope.left - bullet.size/2;
						} else if (bullet.direction == 'Right') {
							$scope.bulletTop = $scope.top + size / 2  - bullet.size/2;
							$scope.bulletLeft = $scope.left + size + bullet.size/2;
						}
						$scope.bulletAlive = true;
					}
				}				
			}
            
            
            /**********************************************************************************************************
            * This function is responsible for moving the bullet if bullet is alive
            **********************************************************************************************************/
            function moveBullet () {
				if ($scope.bulletAlive) {
					if(bullet.direction == 'Up') {
						$scope.bulletTop -= bullet.speed;
					} else if (bullet.direction == 'Down') {
						$scope.bulletTop += bullet.speed;
					} else if (bullet.direction == 'Left') {
						$scope.bulletLeft -= bullet.speed;
					} else if (bullet.direction == 'Right') {
						$scope.bulletLeft += bullet.speed;
					}
				}
                
                //hide the bullet if it goes out of game world
				if($scope.bulletTop < 0 || $scope.bulletTop > screenHt || $scope.bulletLeft < 0 || $scope.bulletLeft > screenWd) {
					$scope.bulletAlive = false;
				}
            }
            
            
            function manageBullet() {
                if(!$scope.alive) {return;}
                createBullet();
                moveBullet();
                updateBulletsInfo();
            }
            
            function updateEnemyInfo () {
                var tank = {};
                tank.x = $scope.left;
                tank.y = $scope.top;
                tank.size = size;
                
                gameManager.updateEnemyInfo($scope.tankId, tank);
            }
            
            function updateBulletsInfo () {
                var bulletObj = {};
                bulletObj.x = $scope.bulletLeft;
                bulletObj.y = $scope.bulletTop;
                bulletObj.size = bullet.size;
                bulletObj.alive = $scope.bulletAlive;
                
                gameManager.updateEnemyBulletsInfo ($scope.tankId, bulletObj);
            }
            
            function checkIfHit () {
                var tank = {};
                tank.ID = $scope.tankId;
                tank.x = $scope.left;
                tank.y = $scope.top;
                tank.size = size;
                
                if(gameManager.amIHit(tank)) {
                    $scope.alive = false;
                    $scope.bulletAlive = false;
                    $rootScope.enemyCount--;
                }
            }
            
            gameManager.addToLoop([moveTank, manageBullet]);
		},
		/*
		link: function(scope, element, attrs, controllers) {			
		},*/
		templateUrl: 'templates/enemyTank.html'
	};
});