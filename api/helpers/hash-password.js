const Constants = sails.config.constants;

module.exports = {


  friendlyName: 'Hash password',


  description: '',


  inputs: {
    // password of user
    password: {
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    
    try {
      // salting and hashing of password using bcrypt
      await Constants.bcrypt.hash(inputs.password, 10 , (err, hash) => {
        if(err) { throw err;}
        return exits.success({ hash })
      })
    } catch (e) {
      return exits.success(undefined)
    }
  }


};

