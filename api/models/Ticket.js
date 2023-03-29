/**
 * Ticket.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  // for not using default objectId
  dontUseObjectIds: true,
  attributes: {
    ticketNumber: {
      type: 'string',
      required: true,
      unique: true
    },
    isProcessed: {
      type: 'boolean',
      defaultsTo: false
    },

    place: {
      model: 'place'
    },

    user: {
      model: 'user'
    }

  },
};

