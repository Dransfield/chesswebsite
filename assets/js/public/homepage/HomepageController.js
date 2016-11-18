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
	
		var n = Date.now();
		//alert("string date "+dat);
		//alert("now "+n);
		var newnum=n-dat;
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
	/*
	function phrasefordate(dat)
	{
		var today=new Date();
		var phrase='';
		var msec = Date.UTC(Date.parse(dat));
		var n = Date.now();
		alert("string date "+dat);
		alert("now "+n);
		alert("game date "+msec);
		var newnum=n-msec;
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
	*/
	
	
	io.socket.get('/openchessgame', function(resData, jwres)
	 {
	 $scope.$apply(function() {
		 $scope.opg=resData;
				for (m in resData)
				{
		
		
		resData[m].phrase=phrasefordate(resData[m].Created);
				}
		
		console.log(resData);
			})
		}
	)
	
	io.socket.on('openchessgame', function(event)
	{
		console.log(event);
		$scope.$apply(function() {
		
		if (event.verb=="created")
		{
		event.data.phrase=phrasefordate(event.data.Created);
		 $scope.opg.push(event.data);
		}
		if (event.verb=="destroyed")
		{
			
			
		for(var i = $scope.opg.length - 1; i >= 0; i--) {
			if($scope.opg[i].id === event.id) {
			$scope.opg.splice(i, 1);
			}
		}
		
		}
		
		})
		})
	$scope.PlayGame=function(GameID)
	{
		$http.put('/ChangeUsersCurrentGame', {
			  GameID: GameID
    })
    .then(function onSuccess (dat){
      // Refresh the page now that we've been logged in.
      //$scope.$apply(function() {
     window.location="/humanvshuman";
	//});
    })
	}
	
	$scope.subscribeToMyGames=function(user)
	{
		io.socket.get('/subscribetomygames', function(resData, jwres)
		{
		console.log("try to subscribe to joined games");
		console.log(resData);
		console.log(jwres);	
			
		})
		
		
			io.socket.get('/chessgame', function(resData, jwres)
	 {
		 $scope.$apply(function() {
		 
		 for (m in resData)
		 {
		if (resData[m].Player1==user)
		{
		resData[m].phrase=phrasefordate(resData[m].Created);
		
		}
		
		
		}
		//$scope.joinedgames=(resData);
		 //console.log(resData);
	})
		}
	)
	
		/*
	io.socket.on('chessgame', function(event)
	{
		console.log(event);
		$scope.$apply(function() {
		
		if (event.data.Player1==user || event.data.Player2==user)
		{
		if (event.verb=="created")
		{
		event.data.phrase=phrasefordate(event.data.Created);
		 $scope.joinedgames.push(event.data);
		}
		
		if (event.verb=="destroyed")
		{
		for(var i = $scope.joinedgames.length - 1; i >= 0; i--) {
			if($scope.joinedgames[i].id === event.id) {
			$scope.joinedgames.splice(i, 1);
			}
		}
		
		}
		
		
		}})
		})
		*/
	}
	
	

	
	
	
	/*$scope.subscribeToMyGames=function(){
	  $http.get('/subscribetomygames', {
	}
	}*/
	$scope.deletegame=function (GameID,user){
	
	io.socket.delete('/chessgame/'+GameID, function (resData)
	 {
				
			console.log(resData); // => {id:9, name: 'Timmy Mendez', occupation: 'psychic'}
			console.log("Game to delete "+GameID);
			$scope.getjoinedgames(user);
		});
	}
	$scope.getjoinedgames=function(user){
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
		console.log("joingame player1"+PlayerID+" player2"+MyID+" player1name "+PlayerName+" Player2Name "+MyName);
		$http.put('/joingame', {
			GameID:GameID,
			PlayerID:PlayerID,
			PlayerName:PlayerName,
			MyID:MyID,
			MyName:MyName
			})
		.then(function onSuccess(sailsResponse){
			
			io.socket.delete('/openchessgame/'+GameID, function (resData) {
				$scope.getjoinedgames(MyID);
			resData; // => {id:9, name: 'Timmy Mendez', occupation: 'psychic'}
			
			});
			}
			)
		/* $http.post('/chessgame',  {Player1:PlayerID,Player2:MyID,Player1Name:PlayerName,Player2Name:MyName} )
    .then(function onSuccess (){
      // Refresh the page now that we've been logged in.
      //window.location.reload(true); 
		//toastr.success('Created New Game');
		toastr.success("Joined game");
    })
    .catch(function onError(sailsResponse) {
	//toastr.error("Can't Create New Game");
      // Handle known error type(s).
      // Invalid username / password combination.
      if (sailsResponse.status === 400 || 404) {
        // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
        //
        toastr.error('Couldnt Create Game.', 'Error' );
        
         // closeButton: true
        }
        else
        {
       }
				return;
      })
  
    .finally(function eitherWay(){
     // $scope.loginForm.loading = false;
    })
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
	*/
	}
	
	$scope.creategame=function(id,name){
		
		// Set the loading state (i.e. show loading spinner)
   



    $http.post('/openchessgame', { Player1: id,Player1Name:name,Created:Date.now() })
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
