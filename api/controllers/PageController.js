/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	showProfilePage:function(req,res){
	
    // If not logged in, show the public view.
    if (!req.session.me) {
      return res.view('profile',{loggedin:false});
	}
    // Otherwise, look up the logged-in user and show the logged-in view,
    // bootstrapping basic user data in the HTML sent from the server
    User.findOne(req.session.me, function (err, user){
      if (err) {
        return res.negotiate(err);
      }

     if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('profile',{loggedin:false});
      }
      return res.view('profile', {
        loggedin:true,
        me: {
         id: user.id,
          name: user.name,
          email: user.email,
          title: user.title,
          isAdmin: !!user.admin,
          gravatarUrl: user.gravatarUrl,
          DifficultyLevelBeaten:user.DifficultyLevelBeaten
		}
      });

    });
  },
	showChessPage:function (req, res) {

    // If not logged in, show the public view.
    if (!req.session.me) {
      return res.view('humanvsai',{loggedin:false});
	}
    // Otherwise, look up the logged-in user and show the logged-in view,
    // bootstrapping basic user data in the HTML sent from the server
    User.findOne(req.session.me, function (err, user){
      if (err) {
        return res.negotiate(err);
      }

     if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('humanvsai',{loggedin:false});
      }
      return res.view('humanvsai', {
        loggedin:true,
        me: {
         id: user.id,
          name: user.name,
          email: user.email,
          title: user.title,
          isAdmin: !!user.admin,
          gravatarUrl: user.gravatarUrl,
          DifficultyLevelBeaten:user.DifficultyLevelBeaten
		}
      });

    });
  },
	showHomePage: function (req, res) {

    // If not logged in, show the public view.
    if (!req.session.me) {
      return res.view('homepage',{loggedin:false});
	}
    // Otherwise, look up the logged-in user and show the logged-in view,
    // bootstrapping basic user data in the HTML sent from the server
    User.findOne(req.session.me, function (err, user){
      if (err) {
        return res.negotiate(err);
      }

     if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('homepage',{loggedin:false});
      }
      return res.view('homepage', {
        loggedin:true,
        me: {
         id: user.id,
          name: user.name,
          email: user.email,
          title: user.title,
          isAdmin: !!user.admin,
          gravatarUrl: user.gravatarUrl,
          DifficultyLevelBeaten:user.DifficultyLevelBeaten
		}
      });

    });
  }

};
