const Constants = sails.config.constants;
const ResponseCodes = Constants.ResponseCodes;

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
                    return res.status(ResponseCodes.UNAUTHORIZED).send({
                        status: ResponseCodes.UNAUTHORIZED,
                        message: req.i18n.__("UNAUTHORIZED")
                    });
                }
                else {
                    next();
                }
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(ResponseCodes.UNAUTHORIZED).send({
            status: ResponseCodes.UNAUTHORIZED,
            message: req.i18n.__("UNAUTHORIZED")
        });
    }
}