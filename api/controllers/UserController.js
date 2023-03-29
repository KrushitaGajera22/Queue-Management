/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Constants = sails.config.constants;

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
                return res.status(201).send({ message: 'Signed Up!!' })
            } else {
                return res.status(404).send({ message: 'Enter password of atleast 6 characters' })
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error });
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
                        return res.status(404).send({ message: 'User not Found' })
                    }
                    // comparing password using bcrypt compare method
                    await Constants.bcrypt.compare(password, user[0].password, async (err, result) => {
                        if (err) {
                            return res.status(401).send({ error: err });
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
                            return res.status(200).send({ message: 'Logged in!!', token: token.token, user: user })
                        }
                        res.status(500).send({ message: 'Invalid Details' });
                    })
                })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error });
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
                        return res.status(404).send({ message: 'User not found' })
                    }
                    //clearing cookies 
                    res.clearCookie('Jwt');
                    res.status(200).send({ message: 'User Logout!!' })
                });
        } catch (error) {
            res.send({ error: error });
            console.log(error);
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
                    res.status(200).send({ message: "user updated" });
                });
        } catch (error) {
            res.status(500).send({ error: error });
        }
    }

};

