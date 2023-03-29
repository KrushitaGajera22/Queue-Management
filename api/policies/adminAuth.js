const Constants = sails.config.constants;

module.exports = async (req, res, next) => {
    try {
        // storing jwt inside token variable
        let token = req.cookies.Jwt;
        // verifying the token
        await Constants.jwt.verify(token, Constants.Jwt_Secret, (err, decoded) => {
            if (err) { throw err; }
            else {
                // checking if it is admin or not
                if (decoded.isAdmin !== true) {
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