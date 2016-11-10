angular.module('HomepageModule').controller('SinglePlayerController', ['$scope', '$http', 'toastr','engineGamejs', function($scope, $http, toastr,engineGamejs){

	// set-up loginForm loading state
	
	$scope.levelform = {
		loading: false
		
	}
	$scope.game=engineGamejs();
	
	$scope.showlevelpicker=true;
	$scope.Clearboard=function(){$scope.board.clear();}
	$scope.ChooseLevel=function(){
		toastr.success("Playing AI level "+$scope.levelform.level);
		$scope.showboard=true;
		$scope.showlevelpicker=false;
		}

}]);
