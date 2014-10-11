(function(){
  'use strict';

  angular.module('enlighTN')
  .controller('MakeReflectionCtrl', ['$scope', '$modalInstance', 'Reflection', 'loc', function($scope, $modalInstance, Reflection, loc){

    $scope.locId = loc;
    $scope.reflection = {
      title: 'Wow!',
      text:  'This place blew my mind'
    };

    $scope.ok = function(){
      $scope.reflection.locId = $scope.locId;
      Reflection.create($scope.reflection).then(function(){
        $modalInstance.close($scope.reflection);
      });
    };

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    };

  }]);
})();
