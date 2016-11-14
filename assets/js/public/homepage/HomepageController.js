angular.module('HomepageModule').controller('HomepageController', ['$scope', '$http', 'toastr', function($scope, $http, toastr){

	// set-up loginForm loading state
	$scope.loginForm = {
		loading: false
	}
	$scope.opg={}
	$scope.joinedgames={}
	
	

	
	// $scope.$watch(function(scope) {
		// return scope.opg;
    //console.log("**** reference checkers $watch ****")
	
  //});
	//$http.get('/chessgame')
	//.success(function(success_data){

//	$scope.opg = success_data;
//	$log.info(success_data);
//});

	function phrasefordate(dat)
	{
		var today=new Date();
		var phrase='';
		var msec = Date.parse(dat);
		var newnum=today-msec;
		newnum=newnum/1000;
		if (newnum<60)
		{
		phrase=parseInt(newnum)+" seconds ago";
		}
		else
		{
		newnum=newnum/60;
		if (newnum<60)
		{
		phrase=parseInt(newnum)+" minutes ago";
		}
		else
		{
		newnum=newnum/60;
		if (newnum<60)
		{
		phrase=parseInt(newnum)+" hours ago";
		}
		else
		{
		newnum=newnum/24;
		
		phrase=parseInt(newnum)+" days ago";
		
		}
		
		}
		
		}
		return phrase;
	}
	
	io.socket.get('/openchessgame', function(resData, jwres)
	 {
		 $scope.$apply(function() {
		 $scope.opg=resData;
		 for (m in resData)
		  {
		
		
		resData[m].phrase=phrasefordate(resData[m].createdAt);
		
		
		
		}
		
		 console.log(resData);
	})
		}
	)
	
	io.socket.on('openchessgame', function(event)
	{
		$scope.$apply(function() {
		console.log(event);
		event.data.phrase=phrasefordate(event.data.createdAt);
		 $scope.opg.push(event.data);
		})
		})
	
	io.socket.on('chessgame', function(event)
	{
		$scope.$apply(function() {
		event.data.phrase=phrasefordate(event.data.createdAt);
		 $scope.joinedgames.push(event.data);
		})
		})
	
	$scope.joinedgames=function(user){
	console.log('user'+user);
	  $http.get('/findjoinedgames', {
      myid: user
    })
    .then(function onSuccess (dat){
      // Refresh the page now that we've been logged in.
      //$scope.$apply(function() {
      console.log("joined games reply"+JSON.stringify(dat.data));
		
		$scope.joinedgames=dat.data;
	
	//});
    })
    .catch(function onError(sailsResponse) {

      // Handle known error type(s).
      // Invalid username / password combination.
      if (sailsResponse.status === 400 || 404) {
        // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
        //
        toastr.error('Cant find joined games, not logged in.', 'Error', {
          
        });
        return;
      }

				toastr.error('An unexpected error occurred trying to find joined games.', 'Error', {
					
				});
				return;

    })
    .finally(function eitherWay(){
      
    });
    
}


	$scope.joingame=function(GameID,PlayerID,PlayerName,MyID,MyName){
		
		$http.put('/joingame', {
			GameID:GameID,
			PlayerID:PlayerID,
			PlayerName:PlayerName,
			MyID:MyID,
			MyName:MyName
			})
		.then(function onSuccess(sailsResponse){
			toastr.success("Joined game");
			//window.location = '/humanvshuman';
		})
		.catch(function onError(sailsResponse){

		// Handle known error type(s).
		// If using sails-disk adpater -- Handle Duplicate Key
		var GameAlreadyJoined = sailsResponse.status == 409;
		toastr.error(sailsResponse.status );
		if (GameAlreadyJoined) {
			toastr.error('Someone else already joined that game, sorry.', 'Error');
			return;
		}

		})
		.finally(function eitherWay(){
			//form.loading = false;
		})
	
	}
	
	$scope.creategame=function(id,name){
		
		// Set the loading state (i.e. show loading spinner)
   



    $http.post('/openchessgame', { Player1: id,Player1Name:name })
    .then(function onSuccess (){
      // Refresh the page now that we've been logged in.
      //window.location.reload(true); 
		toastr.success('Created New Game');
    })
    .catch(function onError(sailsResponse) {
	toastr.error("Can't Create New Game");
      // Handle known error type(s).
      // Invalid username / password combination.
      if (sailsResponse.status === 400 || 404) {
        // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
        //
        //toastr.error('Invalid email/password combination.', 'Error', {
         // closeButton: true
        }
        else
        {
        toastr.error('An unexpected error occurred, please try again.', 'Error');
		}
				return;
      })
  
    .finally(function eitherWay(){
     // $scope.loginForm.loading = false;
    })
  }
	
	
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
