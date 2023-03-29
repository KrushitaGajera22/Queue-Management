const Constants = sails.config.constants;

module.exports = async (req, res, next) => {
    try {
        // storing cookie inside token variable
        let token = req.cookies.Jwt;
        // verifying the token
        await Constants.jwt.verify(token, Constants.Jwt_Secret, (err, decoded) => {
            if (err) { throw err; }
            else {
                // checking if id is verified or not
                if (decoded.id !== (req.params.id || req.body.user)) {
                    return res.status(401).send({ message: 'Unauthorized' });
                }
                else {
                    next();
                }
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(401).send({ message: 'Unauthorized' })
    }
}