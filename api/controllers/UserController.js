/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * Check the provided email address and password, and if they
   * match a real user in the database, sign in to Activity Overlord.
   */
   UpdateGame:function(req,res){
	   console.log('update game fired');
	   Chessgame.update({id: req.params['id']}).set({
  fen: req.params['fen']
}).exec(function(err, bobs){
  if (err) return res.serverError(err);
  if (bobs.length > 1) return res.serverError('Consistency violation: somehow multiple users exist with the same username? There must be a bug elsewhere in the code base.');
  if (bobs.length < 1) return res.notFound();

  // Broadcast a message telling anyone subscribed to Bob that his hair is now red.
  // (note that we exclude the requesting socket from the broadcast, and also include Bob's previous hair color)
  Chessgame.publishUpdate(bobs[0].id, {
    fen: req.params['fen']
  }, req);

  return res.ok();
});
   },
   
   subscribeToMyGames: function (req, res) {
    if (!req.isSocket) {
      return res.badRequest('Only a client socket can subscribe to a model.  You, sir or madame, appear to be an HTTP request.');
    }
	console.log('sub request from.'+req.session.me);
			
    // Let's say our client socket has a problem with people named "louie".

    // First we'll find all users named "louie" (or "louis" even-- we should be thorough)
    Chessgame.find({ or: [{Player1:req.session.me},{Player2: req.session.me}] }).exec(function(err, myGames){
      if (err) {
        return res.serverError(err);
      }

      // Now we'll use the ids we found to subscribe our client socket to each of these records.
      Chessgame.subscribe(req, _.pluck(myGames, 'id'));
      Chessgame.subscribe(req);
		Chessgame.watch(req);
		
      // Now any time a user named "louie" or "louis" is modified or destroyed, our client socket
      // will receive a notification (as long as it stays connected anyways).

      // All done!  We could send down some data, but instead we send an empty response.
      // (although we're ok telling this vengeful client socket when our users get
      //  destroyed, it seems ill-advised to send him our Louies' sensitive user data.
      //  We don't want to help this guy to hunt them down in real life.)
      return res.ok();
    });
  },
   
   Findjoinedgames:function (req,res){
   	User.findOne(req.session.me, function foundUser(err, user) {
		if (err) return res.negotiate(err);

		// If session refers to a user who no longer exists, still allow logout.
			if (!user) {
			console.log('Session refers to a user who no longer exists.');
			return res.backToHomePage();
			}
		
		
		
		
	Chessgame.find({
				or : [
				{ Player1: req.session.me },
				{ Player2: req.session.me }
				]
			},function(err,jgames){
				console.log(req.session.me+"jgames "+jgames);
			return res.json(jgames);
		});
		     
    });
    },
   Joingame: function(req,res)  {
	   var sentresponse=false;
		User.findOne(req.session.me, function foundUser(err, user) {
		if (err) return res.negotiate(err);

		// If session refers to a user who no longer exists, still allow logout.
			if (!user) {
			sails.log.verbose('Session refers to a user who no longer exists.');
			sentresponse=true;
			return res.backToHomePage();
			}
		PlayerName=req.param('PlayerName');
		PlayerID=req.param('PlayerID');
		GameID=req.param('GameID');
		MyName=req.param('MyName');
		Openchessgame.findOne(GameID, function foundUser(err, game) {
		if (err) 
		{
		if (sentresponse==false)
		{
		sentresponse=true;
		
			return res.negotiate(err);
		}
		}
		// If session refers to a user who no longer exists, still allow logout.
			
			if (!game) {
			console.log('Session refers to a game that no longer exists.');
		if (sentresponse==false)
		{
		sentresponse=true;
		
			return res.backToHomePage();
		}	
			}
			
			if (!game.Player2)
			{
				game.Player2=req.session.me;
			Chessgame.create({Player1:PlayerID,Player2:req.session.me,Player1Name:PlayerName,Player2Name:MyName}).exec(
			function (err, records) {
				if(err){
			console.log('Cant create joined game.');
			console.log(JSON.stringify(err));
			}
			console.log("records");
			console.log(records);
			Chessgame.publishCreate( records );
			});
			
			
			if(sentresponse==false)
			{
			sentrespone=true;
			
			return res.ok();
			}
			
			
			
			
			}
			else
			{
			console.log('someone already joined game.'+Game.Player2);
			if (sentresponse==false)
			{
			sentresponse=true;
			return res.forbidden();
			}	
			}
			
			});
			
			//game.destroy();
		// Wipe out the session (log out)
		
		
		sails.log.verbose('joining.'+GameID+' with '+PlayerID);
       
       
      // Either send a 200 OK or redirect to the home page
		if (sentresponse==false)
		{
		sentresponse=true;
		return res.ok();
		}
		 });
    
    },
    
   
   
   UpdateLevelBeaten: function(req,res)  {
		User.findOne(req.session.me, function foundUser(err, user) {
		if (err) return res.negotiate(err);

		// If session refers to a user who no longer exists, still allow logout.
			if (!user) {
			sails.log.verbose('Session refers to a user who no longer exists.');
			return res.backToHomePage();
			}
		sails.log.verbose('about to update user level.');
       
		// Wipe out the session (log out)
		if (user.DifficultyLevelBeaten<req.param('DifficultyLevelBeaten'))
		{
		user.DifficultyLevelBeaten=req.param('DifficultyLevelBeaten');
		user.save(function(err, savedUser){
		
		sails.log.verbose('saving user error.');
       
        });
      // Either send a 200 OK or redirect to the home page
		return res.ok();
		}
    
    });
    },
    
	chatmsg:function(req,res){
	sails.sockets.broadcast(req.param('roomName'), { greeting: req.param('message') });
	},
    
    subscribeToRoom: function(req, res) {
  if (!req.isSocket) {
    return res.badRequest();}
 

		
  var roomName = req.param('roomName');
  sails.sockets.join(req, roomName, function(err) {
    if (err) {
      return res.serverError(err);
    }

    return res.json({
      message: 'Subscribed to a fun room called '+roomName+'!'
    });
  });
},
   ChangeUsersCurrentGame: function (req,res){
	    User.findOne({
      id: req.session.me
	},function foundUser(err,user){
		if (!err){
	user.GameID=req.param('GameID');
	user.save();
	return res.ok();
	
	}
	});
   },
  login: function (req, res) {

    // Try to look up user using the provided email address
    User.findOne({
      email: req.param('email')
    }, function foundUser(err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.notFound();

      // Compare password attempt from the form params to the encrypted password
      // from the database (`user.password`)
      require('machinepack-passwords').checkPassword({
        passwordAttempt: req.param('password'),
        encryptedPassword: user.encryptedPassword
      }).exec({

        error: function (err){
          return res.negotiate(err);
        },

        // If the password from the form params doesn't checkout w/ the encrypted
        // password from the database...
        incorrect: function (){
          return res.notFound();
        },

        success: function (){

          // Store user id in the user session
          req.session.me = user.id;

          // All done- let the client know that everything worked.
          return res.ok();
        }
      });
    });

  },

  /**
   * Sign up for a user account.
   */

	   
   
  signup: function(req, res) {

    var Passwords = require('machinepack-passwords');

    // Encrypt a string using the BCrypt algorithm.
    Passwords.encryptPassword({
      password: req.param('password'),
      difficulty: 10,
    }).exec({
      // An unexpected error occurred.
      error: function(err) {
        return res.negotiate(err);
      },
      // OK.
      success: function(encryptedPassword) {
        require('machinepack-gravatar').getImageUrl({
          emailAddress: req.param('email')
        }).exec({
          error: function(err) {
            return res.negotiate(err);
          },
          success: function(gravatarUrl) {
          // Create a User with the params sent from
          // the sign-up form --> signup.ejs
            User.create({
              name: req.param('name'),
              title: req.param('title'),
              email: req.param('email'),
              encryptedPassword: encryptedPassword,
              lastLoggedIn: new Date(),
              gravatarUrl: gravatarUrl
            }, function userCreated(err, newUser) {
              if (err) {

                console.log("err: ", err);
                console.log("err.invalidAttributes: ", err.invalidAttributes)

                // If this is a uniqueness error about the email attribute,
                // send back an easily parseable status code.
                if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
                  && err.invalidAttributes.email[0].rule === 'unique') {
                  return res.emailAddressInUse();
                }

                // Otherwise, send back something reasonable as our error response.
                return res.negotiate(err);
              }

              // Log user in
              req.session.me = newUser.id;

              // Send back the id of the new user
              return res.json({
                id: newUser.id
              });
            });
          }
        });
      }
    });
  },

  /**
   * Log out of Activity Overlord.
   * (wipes `me` from the sesion)
   */
  logout: function (req, res) {

    // Look up the user record from the database which is
    // referenced by the id in the user session (req.session.me)
    User.findOne(req.session.me, function foundUser(err, user) {
      if (err) return res.negotiate(err);

      // If session refers to a user who no longer exists, still allow logout.
      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists.');
        return res.backToHomePage();
      }

      // Wipe out the session (log out)
      req.session.me = null;

      // Either send a 200 OK or redirect to the home page
      return res.backToHomePage();

    });
  }
};
