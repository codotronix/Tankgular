var app = angular.module("MainApp", []);

app.controller("mainCtrl", ['$scope', '$window', '$compile', 'gameManager', function ($scope, $window, $compile, gameManager) {
	$scope.field = {};
	$scope.field.width = $window.innerWidth;
	$scope.field.height = $window.innerHeight;
    $scope.enemyCount = 3;
    $scope.addEnemy = function (ev) {
        if(gameManager.isGameOver()) {return;}
        $scope.enemyCount++;
        angular.element(ev.target).parent().append($compile('<enemy-tank tank-id="' + $scope.enemyCount + '"></enemy-tank>')($scope));
    };
    
    gameManager.startGame();
    
    //since ng-repeat can't loop without an array
//    $scope.getArrayOfSizeN = function (n) {
//        return new Array(n);
//    };
    
    
    
	/*
	function resolveCollision () {

	}

	cxge.onCollision(resolveCollision);
	*/
}]);