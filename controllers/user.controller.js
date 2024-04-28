const { create_contacts,
    get_user_details,
    get_contacts,
    mark_spam,
    get_phone_user,
    get_details
} = require('../services/user.service');

const user_controller = {
    create_contacts: async(req, res) => {
        try {
            let result = await create_contacts(req.body, req.user);
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
    },

    get_user_details: async(req, res) => {
        try {
            let result = await get_user_details(req.body, req.user);
            if(!result.status) {
                return res.status(500).json({
                    resultShort: "failure",
                    resultLong: result.message
                })
            };
            return res.status(200).json({
                resultShort: "success",
                resultLong: result.message,
                data: result.data
            })
        } catch (error) {
            res.status(500).json({
                resultShort: "failure",
                resultLong: error.message
            })
        }
    },

    get_contacts: async(req, res) => {
        try {
            let result = await get_contacts(req.body, req.user);
            if(!result.status) {
                return res.status(500).json({
                    resultShort: "failure",
                    resultLong: result.message
                })
            };
            return res.status(200).json({
                resultShort: "success",
                resultLong: result.message,
                data: result.data
            })
        } catch (error) {
            res.status(500).json({
                resultShort: "failure",
                resultLong: error.message
            })
        }
    },

    mark_spam: async(req, res) => {
        try {
            let result = await mark_spam(req.body, req.user);
            if(!result.status) {
                return res.status(500).json({
                    resultShort: "failure",
                    resultLong: result.message
                })
            };
            return res.status(200).json({
                resultShort: "success",
                resultLong: result.message,
                data: result.data
            })
        } catch (error) {
            res.status(500).json({
                resultShort: "failure",
                resultLong: error.message
            })
        }
    },

    get_phone_user: async(req, res) => {
        try {
            let reqBody = req.body;
            let result = await get_phone_user(req.body, req.user);
            if(!result.status) {
                return res.status(500).json({
                    resultShort: "failure",
                    resultLong: result.message
                })
            };
            return res.status(200).json({
                resultShort: "success",
                resultLong: result.message,
                data: result.data
            })
        } catch (error) {
            res.status(500).json({
                resultShort: "failure",
                resultLong: error.message
            })
        }
    },

    get_details: async(req, res) => {
        try {
            const { phone } = req.params;
            let reqBody = {
                phone
            }
            let result = await get_details(reqBody, req.user);
            if(!result.status) {
                return res.status(500).json({
                    resultShort: "failure",
                    resultLong: result.message
                })
            };
            return res.status(200).json({
                resultShort: "success",
                resultLong: result.message,
                data: result.data
            })
        } catch (error) {
            res.status(500).json({
                resultShort: "failure",
                resultLong: error.message
            })
        }
    }
}

module.exports = user_controller;