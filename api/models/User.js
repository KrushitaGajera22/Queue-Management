/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  // for not using default objectId
  dontUseObjectIds: true,
  attributes: {
    
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      isEmail: true,
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      minLength: 6,
      required: true
    },
    isAdmin: {
      type: 'boolean',
      defaultsTo: false
    },
    tickets: {
      collection: 'ticket',
      via: 'user'
    }
  },

};

