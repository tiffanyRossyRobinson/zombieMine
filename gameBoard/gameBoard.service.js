(function() {
  'use strict';
  angular
    .module('board')
    .factory('boardService', function ($http, $rootScope, $q) {
     
          return msEngine($q);
     });

}());

