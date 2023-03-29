const Constants = sails.config.constants;

module.exports = {


  friendlyName: 'Generate token',


  description: '',


  inputs: {
    // data through which jwt sign the token
    data: {
      type: 'json'
    },
    // expiration time for the token
    expiresIn: {
      type: 'string'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {

    try {
      let token;
      //signing the token
      token = await Constants.jwt.sign(inputs.data,
        Constants.Jwt_Secret, // secret key for generating token
        {
          expiresIn: inputs.expiresIn  //expiration time for the token
        });

      return exits.success({ token })
    } catch (e) {
      return exits.success(undefined)
    }
  }


};

