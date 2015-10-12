(function() {
  'use strict';
  angular
    .module('run')
    .factory('runService', function ($http, $rootScope, $q) {

          return msRun($q);

     });

}());

