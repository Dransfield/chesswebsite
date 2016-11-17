/**
 * Chessgame.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
Player1:{type:'string',
		defaultsTo:''
  },
Player1Name:{type:'string',
		defaultsTo:''
  },
Player2:{type:'string',
		defaultsTo:''
  },
 Player2Name:{type:'string',
		defaultsTo:''
  },
CurrentTurn:{type:'string',
defaultsTo:''
 }
}
};
