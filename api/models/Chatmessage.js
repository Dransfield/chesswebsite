/**
 * Chatmessage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  talker: {
      type: 'string',
      required: true
    },

    // The user's title at their job (or something)
    // e.g. Genius
    message: {
      type: 'string'
    }
  }
};

