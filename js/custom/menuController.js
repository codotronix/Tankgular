angular.module("Tankgular")
.controller("menuController", ['$scope', '$location',
    function ($scope, $location) {
        
        $scope.startGame = function () {
            $location.path('/game');
        }
}]);