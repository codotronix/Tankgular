angular.module("Tankgular")
.controller("gameController", ['$timeout', '$location', '$scope', '$window', '$compile', 'gameManager', '$rootScope',
 function ($timeout, $location, $scope, $window, $compile, gameManager, $rootScope) {
    $scope.field = {};
    $scope.field.width = $window.innerWidth;
    $scope.field.height = $window.innerHeight;
    $rootScope.enemyCount = 3;
    $scope.enemyID = $rootScope.enemyCount;    
    $scope.addEnemy = function (ev) {
        if (gameManager.getGameState() == "stopped") {return;}
        $rootScope.enemyCount++;    //rootScope.enemyCount will also decrease if enemy dies
        $scope.enemyID++;           //it will only keep on increasing
        angular.element(ev.target).parent().append($compile('<enemy-tank tank-id="' + $scope.enemyID + '"></enemy-tank>')($scope));
    };
    $scope.togglePause = function () {
        if (gameManager.getGameState() == "running") {
            gameManager.pauseGame();
        } else if (gameManager.getGameState() == "paused") {
            gameManager.startGame();
        }
    };

    $scope.exit = function(){
        gameManager.init();
        $location.path('/menu');
    };

    function onPlayerKilled () {
        $timeout(function(){
            alert("Game over...");
            $location.path('/menu');
        }, 3000);        
    }
    
    gameManager.init();
    gameManager.setPlayerKilledCallBack(onPlayerKilled);
    gameManager.startGame();
}]);