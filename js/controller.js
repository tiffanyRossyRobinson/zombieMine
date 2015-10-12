(function() {
  'use strict';
  angular
    .module('myMine')
    .controller('gameControl', function(boardService, runService, $scope, $routeParams, $location, $rootScope, $parse, $interval, $q){
        
        //this allows the user to create a table
        $scope.create= function(input){ 
          $rootScope.game = {};
          $scope.game.length = 10; 
          $scope.game.width = 10; 
          $rootScope.values =[];

          if(input === 'beginning'){
            $scope.game.level = 10; 
            setUpGame($scope.game);
          }
          else if(input === 'middle'){
            $scope.game.level = 6; 
            setUpGame($scope.game);
          }
          else if (input === 'end'){
            $scope.game.level = 2; 
            setUpGame($scope.game);
          }
        };

          var setUpGame = function(gameData){
            $scope.game = boardService.createTable(gameData).then(function(resp){
              $rootScope.game = resp;
              $rootScope.mines = resp.mines; 
              var test = Object.keys(resp.mines);
              defaultMines(resp.mines);
              $rootScope.totalMines = _.filter(test, function(data){
                return $rootScope.mines[data] === -1; 
              })
              enableCells(resp);
              $rootScope.selectedCells = [];
              $location.path("/game");
            })
            return;
        }

        //this allows the user to clear all cells
        $scope.clearAll= function(someObject){
          enableCells(someObject);
          defaultMines(someObject.mines);
          $rootScope.mines = [];
          $rootScope.selectedCells = []
          $rootScope.mines = boardService.setMines(someObject);
        };

        //This will occur when a cell button is clicked 
        $scope.selectCell=function(location){
          var gameData = $scope.game;
          disableCell(location);
          if(gameData.mines[location] !== -1){
            runService.determineMines(location, gameData.mines).then(function(value){
              $rootScope.mines[location] = value.length;
              if(value.length === 0){
                itsZero(location); 
               }
            })
          }
          else{
            revealMine(location);
            alert("Game Over");
            disableAllCells($scope.game);
          }
          
 
        };

        var revealNeighbors = function(location){
          var gameData = $scope.game;
          var safeNeighbors = []; 
          runService.determineMines(location, gameData.mines).then(function(value){
            if(!_.isUndefined(gameData.mines[location])){
              $rootScope.mines[location] = value.length; 
              falseCell(location);
              checkGameStatus(location);
              if(value.length === 0){
                safeNeighbors.push(location);
              }
            }       
            return safeNeighbors;
          }).then(function(value){
            if(!_.isUndefined(value[0])){
              itsZero(value[0]);
            }
          })
        }

        var itsZero = function(location){
          var neighbors= runService.getNeighbors(Number(location[0]), location[1]);
            _.each(neighbors, function(data){
              if($rootScope.game.classes['isActive' + data] === false){
                revealNeighbors(data);
              }
              
            })   
        }

        var disableAllCells= function(gameData){
          $rootScope.selectedCells = []
          var test = Object.keys(gameData.classes);
          _.each(test, function (value){
            var location = value[8] + value[9];
            falseCell(location);
          })
        }

        var disableCell=function(location){
          var thisClass= "isActive" + location;
          var value = $rootScope.game.classes[thisClass];
          var model = $parse(thisClass);
          model.assign($scope, !(value)); 
          $rootScope.game.classes[thisClass] = !value;
          checkGameStatus(location);
        };

        var falseCell = function (location){
          var thisClass= "isActive" + location;
          if($scope.game.mines[location] === -1){
            revealMine(location);
          }
          var value = $rootScope.game.classes[thisClass];
          var model = $parse(thisClass);
          model.assign($scope, true); 
          $rootScope.game.classes[thisClass] = true;
        }

        var checkGameStatus = function(location){
          if($rootScope.mines[location] != -1){
            $rootScope.selectedCells.push(location); 
              $rootScope.selectedCells = _.uniq($rootScope.selectedCells);
              var selected = $rootScope.selectedCells.length; 
              var total = selected + $rootScope.totalMines.length; 
              if(total === 100){
                alert("You have survived!")
                $rootScope.selectedCells = [];
                disableAllCells($scope.game)

              }
          }
          
        }

        var enableCells = function(gameData){
          var array = [];
            var test = Object.keys(gameData.classes);
            _.each(test, function(cell){
              $rootScope.game.classes[cell] = false;
              var element = cell[8] + cell[9];
              var model = $parse(cell); 
              model.assign($scope, false);
            });
            return;
        }

        var defaultMines = function(gameData){
          var array = []; 
          var test = Object.keys(gameData); 
          _.each(test, function(cell){
            var thisClass = 'isMine' + cell; 
            var model = $parse(thisClass); 
            model.assign($rootScope, false); 
          })

          return; 
        }

        var revealMine = function(gameData){
          var thisClass = 'isMine' + gameData;
          var model = $parse(thisClass); 
          model.assign($rootScope, true)
          return;          
        }

    });
})();