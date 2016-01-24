var app = angular.module("MainApp", []);

app.controller("mainCtrl", ['$scope', '$window', '$compile', 'gameManager', '$rootScope', function ($scope, $window, $compile, gameManager, $rootScope) {
	$scope.field = {};
	$scope.field.width = $window.innerWidth;
	$scope.field.height = $window.innerHeight;
    $rootScope.enemyCount = 3;
    $scope.enemyID = $rootScope.enemyCount;    
    $scope.addEnemy = function (ev) {
        if(gameManager.isGameOver()) {return;}
        $rootScope.enemyCount++;    //rootScope.enemyCount will also decrease if enemy dies
        $scope.enemyID++;           //it will only keep on increasing
        angular.element(ev.target).parent().append($compile('<enemy-tank tank-id="' + $scope.enemyID + '"></enemy-tank>')($scope));
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