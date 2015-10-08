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

        //this allows the user to clear all cells
        $scope.clearAll= function(someObject){
          enableCells(someObject);
          defaultMines(someObject.mines);
          $rootScope.mines = [];
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
          runService.determineMines(location, gameData.mines).then(function(value){
            if(!_.isUndefined(gameData.mines[location])){
              $rootScope.mines[location] = value.length; 
              falseCell(location);
              if(value.length === 0){
                console.log("this: ", location )
                console.log("has no zombie neighbors: ");
              }
            }       
          })
        }

        var itsZero = function(location){
          var neighbors= runService.getNeighbors(Number(location[0]), location[1]);
            console.log("it's neighbors are: ", neighbors);
            _.each(neighbors, function(data){
              revealNeighbors(data);
            })   
        }


        var setUpGame = function(gameData){
            $scope.game = boardService.createTable(gameData).then(function(resp){
              $rootScope.game = resp;
              $rootScope.mines = resp.mines; 
              defaultMines(resp.mines);
              enableCells(resp);
              $location.path("/game");
            })
            return;
        }

        var disableAllCells= function(gameData){
          var test = Object.keys(gameData.classes);
          console.log("disable game ", gameData);
          _.each(test, function (value){
            console.log("disable value: ", value)
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
          console.log("reveal mine: ", gameData)
          var thisClass = 'isMine' + gameData;
          var model = $parse(thisClass); 
          model.assign($rootScope, true)
          return;          
        }

    });
})();