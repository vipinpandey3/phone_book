const {create_user} = require('../services/auth.service')

const auth_controller = {
    create_user: async(req, res) => {
        try {
            let result = await create_user(req.body);
            if(!result.status) {
                return res.status(500).json({
                    resultShort: "failure",
                    resultLong: result.message
                })
            };
            return res.status(200).json({
                resultShort: "success",
                resultLong: result.message
            })
        } catch (error) {
            res.status(500).json({
                resultShort: "failure",
                resultLong: error.message
            })
        }
    }
}

module.exports = auth_controller;