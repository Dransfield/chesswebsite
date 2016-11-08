angular.module('HomepageModule').controller('HomepageController', ['$scope', '$http', 'toastr', function($scope, $http, toastr){

	// set-up loginForm loading state
	$scope.loginForm = {
		loading: false
	}
	$scope.LevelForm = {
		loading: false
	}
	$scope.submitLevelForm=function(num){
	//$http.put('/updatelevelbeaten', {
    //  DifficultyLevelBeaten:$scope.LevelForm.level,
    //})
    //.then(function onSuccess (){
      // Refresh the page now that we've been logged in.
    //  toastr.success('Level Updated');
    //})    
    toastr.success('Playing against AI Level: '+$scope.LevelForm.level);
    $( "div[id='whole thing']" ).show(5000);
    $( "form[id='levelform']" ).hide(1000);
    init($scope.LevelForm.level);
	},
	$scope.submitLoginForm = function (){

    // Set the loading state (i.e. show loading spinner)
    $scope.loginForm.loading = true;

    // Submit request to Sails.
    $http.put('/login', {
      email: $scope.loginForm.email,
      password: $scope.loginForm.password
    })
    .then(function onSuccess (){
      // Refresh the page now that we've been logged in.
      window.location.reload(true); 
    })
    .catch(function onError(sailsResponse) {

      // Handle known error type(s).
      // Invalid username / password combination.
      if (sailsResponse.status === 400 || 404) {
        // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
        //
        toastr.error('Invalid email/password combination.', 'Error', {
          closeButton: true
        });
        return;
      }

				toastr.error('An unexpected error occurred, please try again.', 'Error', {
					closeButton: true
				});
				return;

    })
    .finally(function eitherWay(){
      $scope.loginForm.loading = false;
    });
  };


}]);
