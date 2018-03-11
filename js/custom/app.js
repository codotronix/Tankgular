angular.module("Tankgular", ['ngRoute'])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
    .when("/menu", {
        templateUrl: "templates/menu.html",
        controller: "menuController"
    })
    .when("/game", {
        templateUrl: "templates/game.html",
        controller: "gameController"
    })
    .when("/", {
        redirectTo: "/menu"
    })
    .otherwise({
        redirectTo: "/"
    });

}]);