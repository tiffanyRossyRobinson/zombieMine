(function() {
  'use strict';
  angular
    .module('myMine', [
      'ngRoute', 
      'board',
      'run'
      ])
    .config(function($routeProvider){
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'gameControl'
      })
       $routeProvider
      .when('/game', {
        templateUrl: 'views/mine.html',
        controller: 'gameControl'
      })     
      .when('/404', {
        template: '<div>' +
                    '<h2 style="color:white; font-size: 4em; font-family: sans-serif;">Whoops! Page not found.</h2>' +
                   '</div>'
      })
      .otherwise ({
        redirectTo: '/404'
      })
    })
})();