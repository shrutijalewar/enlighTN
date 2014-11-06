(function(){
  'use strict';

  angular.module('enlighTN')
  .controller('DashboardCtrl', ['$scope', 'User', 'Reflection', function($scope, User, Reflection){
    User.show().then(function(response){
      $scope.user = response.data.user;
      $scope.reflections = $scope.user.reflections;
    });

// Quote Shuffler-------------------------------------------
    $scope.quotes = [
      {body: 'You can\'t just give someone a creativity injection. You have to create an environment for curiosity and a way to encourage people and get the best out of them.', author:'Ken Robinson'},
      {body: 'Creativity involves breaking out of established patterns in order to look at things in a different way.', author: 'Edward de Bono'},
      {body: 'Creativity is not just for artists. It\'s for businesspeople looking for a new way to close a sale; it\'s for engineers trying to solve a problem; it\'s for parents who want their children to see the world in more than one way.', author: 'Twyla Tharp'},
      {body: 'Creativity is the power to connect the seemingly unconnected.', author: 'William Plomer'},
      {body: 'Creativity is always a leap of faith. You\'re faced with a blank page, blank easel, or an empty stage.', author:'Julia Cameron'},
      {body: 'The tantalizing discomfort of perplexity is what inspires otherwise ordinary men and women to extraordinary feats of ingenuity and creativity; nothing quite focuses the mind like dissonant details awaiting harmonious resolution.', author:'Brian Greene'},
      {body: 'Creativity is piercing the mundane to find the marvelous.', author: 'Bill Moyers'}
    ];

    $scope.init = function(){
      var shuffledQuotes = _.shuffle($scope.quotes),
      quote = _.sample(shuffledQuotes, [1]);
      $scope.quote = quote[0];
      $scope.showReflect = {};
    };

// Toggle forms---------------------------------------------
    $scope.toggleReflect = function(index){
      $scope.showReflect[index] = !!!$scope.showReflect[index];
    };

    $scope.editProfile = function(){
      var user = {
        name: $scope.user.name,
        email: $scope.user.email
      };
      User.update(user).then(function(response){
        toastr.success('Your info has been updated.');
        $scope.form = !$scope.form;
      });
    };

    $scope.editReflection = function(index){
      $scope.user.reflections[index].date = new Date();

      Reflection.update($scope.user.reflections[index]).then(function(response){
        toastr.success('Your reflection has been updated.');
        $scope.toggleReflect(index);
      });
    };

  }]);
})();

