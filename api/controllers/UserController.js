/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Constants = sails.config.constants;
const ResponseCodes = Constants.ResponseCodes;

module.exports = {
    // for registering new user
    signUp: async (req, res) => {
        try {
            let password = req.body.password;
            if (password.length >= 6) {
                // hashing the password using helper hashPassword
                let hash = await sails.helpers.hashPassword.with({
                    password: password  // password of user
                });
                // creating new user
                await User.create({
                    id: Constants.uuid.v4(),  // generating unique id using uuid
                    name: req.body.name,
                    email: req.body.email,
                    password: hash.hash,
                })
                    .then(() => {
                        return res.status(ResponseCodes.CREATED).send({
                            status: ResponseCodes.CREATED,
                            message: req.i18n.__("SIGN_UP") 
                        })
                    })
                    .catch({ code: 'E_UNIQUE' }, (err) => {
                        return res.status(ResponseCodes.CONFLICT).send({
                            status: ResponseCodes.CONFLICT,
                            message: req.i18n.__("EMAIL_IN_USE"),
                          });
                    })
            } else {
                return res.status(ResponseCodes.NOT_FOUND).send({
                    status: ResponseCodes.NOT_FOUND,
                    message: req.i18n.__("PASS_VALIDATE")
                })
            }

        } catch (error) {
            console.log(error);
            return res.serverError({
                status: ResponseCodes.SERVER_ERROR,
                error: req.i18n.__("WENT_WRONG"),
              });
        }
    },

    // for user login
    login: async (req, res) => {
        const password = req.body.password;
        try {
            // finding if email present or not
            await User.find({ email: req.body.email })
                .then(async (user) => {
                    if (!user) {
                        return res.status(ResponseCodes.NOT_FOUND).send({
                            status: ResponseCodes.NOT_FOUND,
                            message: req.i18n.__("USER_NOT")
                        })
                    }
                    // comparing password using bcrypt compare method
                    await Constants.bcrypt.compare(password, user[0].password, async (err, result) => {
                        if (err) {
                            return res.badRequest({
                                status: ResponseCodes.BAD_REQUEST, 
                                error: req.i18n.__("WENT_WRONG") 
                            });
                        }
                        if (result) {
                            // generating token using helper generateToken
                            let token = await sails.helpers.generateToken.with({
                                // data which is signed with token
                                data: {
                                    id: user[0].id,
                                    isAdmin: user[0].isAdmin
                                },
                                expiresIn: '1h' // expiration time of token
                            });
                            // storing token inside cookie
                            res.cookie('Jwt', token.token, {
                                httpOnly: true
                            })
                            return res.ok({
                                status: ResponseCodes.OK, 
                                message: req.i18n.__("LOG_IN"), 
                                token: token.token, 
                                data: user })
                        }
                        return res.serverError({
                            status: ResponseCodes.SERVER_ERROR,
                            error: req.i18n.__("INVALID"),
                          });
                    })
                })
        } catch (error) {
            console.log(error);
            return res.serverError({
                status: ResponseCodes.SERVER_ERROR,
                error: req.i18n.__("WENT_WRONG"),
              });
        }
    },

    // for logout the user or admin
    logout: (req, res) => {
        try {
            const id = req.params.id;
            // finding specific id
            User.findOne({ id: id })
                .then((user) => {
                    // if user is not logged in
                    if (!user) {
                        return res.status(ResponseCodes.NOT_FOUND).send({
                            status: ResponseCodes.NOT_FOUND,
                            message: req.i18n.__("USER_NOT")
                        })
                    }
                    //clearing cookies 
                    res.clearCookie('Jwt');
                    return res.ok({
                        status: ResponseCodes.OK, 
                        message: req.i18n.__("LOG_OUT")
                    })
                });
        } catch (error) {
            console.log(error);
            return res.serverError({
                status: ResponseCodes.SERVER_ERROR,
                error: req.i18n.__("WENT_WRONG"),
              });
        }
    },

    // updating the user name
    update: async (req, res) => {
        let name = req.body.name;
        let id = req.params.id;
        try {
            // updating user name with its id
            await User.update({ id: id }, { name: name })
                .then(() => {
                    res.ok({
                        status: ResponseCodes.OK, 
                        message: req.i18n.__("USER_UPDATE")
                    });
                });
        } catch (error) {
            return res.serverError({
                status: ResponseCodes.SERVER_ERROR,
                error: req.i18n.__("WENT_WRONG"),
              });
        }
    }

};

