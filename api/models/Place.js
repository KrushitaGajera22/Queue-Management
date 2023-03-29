/**
 * Place.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  // for not using default objectId
  dontUseObjectIds: true,
  attributes: {

    Name: {
      type: 'string',
      unique: true,
      required: true
    },
    ticketSeries: {
      type: 'string',
      unique: true,
      required: true
    },
    tickets: {
      collection: 'ticket',
      via: 'place'
    }

  },

};

