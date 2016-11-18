angular.module('HomepageModule').controller('TwoPlayerController', ['$scope', '$http', 'toastr', function($scope, $http, toastr){
var board1 ;
var game;
$scope.chatting="Chat:";
	// set-up loginForm loading state
	function updateTurnTakerLabel(game,gameRecord)
	{
		if (game.turn()=='w')
		{
		$scope.TurnTaker=gameRecord.Player1Name;
		}
		else
		{
		$scope.TurnTaker=gameRecord.Player2Name;
		
		}
		}
		
			function usersTurn(game,gameRecord,me)
	{
		if (game.turn()=='w')
		{
		if (gameRecord.Player1==me)
		{return true;}
		else
		{return false;}
		}
		else
		{
		if (gameRecord.Player2==me)
		{return true;}
		else
		{return false;}
		
		}
		}
		
		
	$scope.getchatmessages=function(){
		
	  $http.get('/chatmessage?room='+GameID, {
      room: GameID
    })
    .then(function onSuccess (dat){
      // Refresh the page now that we've been logged in.
      //$scope.$apply(function() {
      console.log("joined games reply"+JSON.stringify(dat.data));
		for (m in dat.data)
	{console.log("joined games reply2"+JSON.stringify(dat.data[m]));
	$scope.chatting=$scope.chatting+String.fromCharCode(13, 10)+dat.data[m]['talker']+":"+dat.data[m]['msg']+" ";
	}
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

		
		$scope.chatMessage=function(usrName)
		{
			io.socket.put("/chatmsg",{roomName:GameID,message:$scope.chatInput}, function (resData, jwres){
 
			});
			
			
			 $http.post('/Chatmessage', { talker: usrName,msg:$scope.chatInput,room:GameID})
    .then(function onSuccess (){
      // Refresh the page now that we've been logged in.
      //window.location.reload(true); 
		//toastr.success('Created New Game');
    })
    .catch(function onError(sailsResponse) {
	toastr.error("Can't Create New chat message"+sailsResponse.status);
	console.log(JSON.stringify(sailsResponse));
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
		$scope.joinRoom=function (usrName)
		{
			io.socket.get("/subscribeToRoom",{roomName:GameID},function (resData,jwres){
			console.log(JSON.stringify(resData));
			});
			io.socket.on('message', function (data){
				 $scope.$apply($scope.chatting=$scope.chatting+String.fromCharCode(13, 10)+usrName+":"+data.greeting+" ");
			console.log(data.greeting);
			});
	
		}
$scope.setBoard=function (me)
		{
			

			
			$http.get('/chessgame?id='+GameID)
.then(function (res) {
   var gameRecord = res.data;
  console.log(gameRecord);

		
      
			
		 var onDrop = function(source, target) {
  
  if (usersTurn(game,gameRecord,me)==false)
  { return 'snapback';}
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  
  if (move === null) return 'snapback';
  console.log('move'+JSON.stringify(move));
updateStatus(game,gameRecord,move);
};

function updateStatus(game,gameRecord,move)
{
	console.log("update status");
gameRecord.fen=game.fen();
gameRecord.lastmove=move.from+move.to;
updateTurnTakerLabel(game,gameRecord);
//game.load(gameRecord.fen);


io.socket.put('/Chessgame/'+gameRecord.id,{
      fen: game.fen(),
      lastmove:move.from+move.to
      }  
      
    ,function(resData,jwres)
{}
);
/*
io.socket.put('/UpdateGame',{
      fen: game.fen(),
      id:gameRecord.id
      }  
      
    ,function(resData,jwres)
{}
);*/
}
 board1 = ChessBoard('board',{draggable: true,onDrop: onDrop,} );
 game = new Chess();
  //io.socket.get('/subscribetomygames');
  //io.socket.get('Chessgame');
  //io.socket.get('/chessgame');
// io.socket.get('chessgame');
 

	board1.start();
	
		if (gameRecord.fen)
		{
		board1.position(gameRecord.fen);
		if(game.load(gameRecord.fen)==false)
		{
		alert('couldnt load game');
		}
		
	
		}
		updateTurnTakerLabel(game,gameRecord);
		})
		
		
		 io.socket.on('chessgame', function gotmsg(msg) {
  console.log(msg);
  			$http.get('/chessgame?id='+GameID)
.then(function (res) {
   var gameRecordnow = res.data;
		//board1.position(gameRecordnow .fen);
		//.if(game.load(gameRecordnow .fen)==false)
		//{
		//alert('couldnt load game');
	//	}
	console.log("last move"+gameRecordnow.lastmove);
	var modified=(gameRecordnow.lastmove.substr(0, 2) + "-" + gameRecordnow.lastmove.substr(2));
	console.log("with -"+modified);
	console.log("from "+gameRecordnow.lastmove.substr(0, 2)+"-to-"+gameRecordnow.lastmove.substr(2, 5)+"-");
		game.move({ from: gameRecordnow.lastmove.substr(0, 2), to: gameRecordnow.lastmove.substr(2, 5) });
		board1.move(modified);
		updateTurnTakerLabel(game,gameRecordnow);
		console.log(game.ascii());
		})
		
	})
	
	}
   
   

		
	 


	   /* 
     
	 setInterval(function ()
		{
        if (announced_game_over) {
            return;
        }
        }
        )
        
        if (chess.game_over())
        {
        if (chess.game_checkmate())
        {
        if (chess.NotPlayersTurn())
        {
            announced_game_over = true;
           toastr.success("You Won!");
           $http.put('/updatelevelbeaten', {
			DifficultyLevelBeaten:$scope.LevelForm.level,
			})
			.then(function onSuccess (){
			//Refresh the page now that we've been logged in.
			toastr.success('Your victory has been recorded in your profile');
			})   
            .catch(function onError(sailsResponse) {

      // Handle known error type(s).
      // Invalid username / password combination.
      if (sailsResponse.status === 500) {
        // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
        //
        toastr.error('Log in to record your victories.', 'Error', {
          closeButton: true
        });
        return;
      }
		
				toastr.error('An unexpected error occurred, please try again.', 'Error', {
					closeButton: true
				});
				return;

    })
           
        }
        }
		}
        
    }, 1000);
     
    
	$scope.injectfen=function (){
	
	
	chess.injectboard('3Q1R2/8/5R2/P7/6p1/2K1k1P1/P6B/8 w - - 0 55');
	chess.injectgame('3Q1R2/8/5R2/P7/6p1/2K1k1P1/P6B/8 w - - 0 55');
	}
	
	
	$scope.PressedGoButton=function(){
	$scope.hideboard=false;
	chess=init($scope.LevelForm.level);
	$scope.hidedifficulty=true;
	toastr.success("Playing at difficulty level "+$scope.LevelForm.level);
	
	};
	 */
}]
 )
 ;