angular.module('engineGamejs',[])
  //And on the momentjs module, declare the moment service that we want
  // available as an injectable
  .factory('engineGame', function ($window) {
    if($window.engineGame){
      //Delete moment from window so it's not globally accessible.
      //  We can still get at it through _thirdParty however, more on why later
      $window._thirdParty = $window._thirdParty || {};
      $window._thirdParty.engineGame= $window.engineGame;
      try { delete $window.engineGame; } catch (e) {$window.engineGame = undefined;
      /*<IE8 doesn't do delete of window vars, make undefined if delete error*/}
    }
    var engineGame = $window._thirdParty.engineGame;
    return engineGame;
  });