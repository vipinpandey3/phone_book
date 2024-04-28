const models = require('../models');
const { Sequelize, Op } = require('sequelize');

const user_service = {
    create_contacts: async(reqBody, reqUser) => {
        try {
            console.log("inside the create_contacts");
            if(!reqBody.phone) {
                throw new Error("please provide phone number");
            }
            let contact_obj = {
                name: reqBody.name ? reqBody.name : null,
                phone: reqBody.phone,
                user_id: reqUser.user_id 
            };
            let created_contact = await models.Contact.create(contact_obj)
            if(!created_contact) throw new Error("error creating contact");
            return {
                status: true,
                message: "contact created"
            }
        } catch (error) {
            console.log("error inside the create_contacts", error)
            return {
                status: false,
                message: error.message
            }
        }
    },

    get_user_details: async(reqBody, reqUser) => {
        try {
            const userId = reqUser.user_id; // Assuming authenticate middleware sets req.user
            const user = await models.User.findOne({
                where: { id: userId },
                attributes: ['id', 'name', 'phone', 'email'], // Information to fetch
                include: [
                    {
                        model: models.Contact,
                        as: 'contacts', // Include user's contacts
                    },
                    {
                        model: models.Spam,
                        as: 'spams', // Include spam reports by this user
                    },
                ],
            });
            console.log("user", user)
            return {
                status: true,
                message: "fetched user details",
                data: user
            }
        } catch (error) {
            console.log("error inside the create_contacts", error)
            return {
                status: false,
                message: error.message
            }
        }
    },

    get_contacts: async(reqBody, reqUser) => {
        try {
            console.log("inside the get_contacts")
            const userId = reqUser.user_id;
            let where = {
                user_id: reqUser.user_id
            }
            if(reqBody.search) {
                where = {
                    ...where,
                    [Op.or]: [
                        {
                            phone: {
                              [Op.like]: `%${reqBody.search}%`,
                            },
                        },
                        {
                            name: {
                              [Op.like]: `%${reqBody.search}%`,
                            },
                        }
                    ]
                }
            }
            let contacts = await models.Contact.findAll({
                where: where
            })
            console.log("contacts", contacts)
            return {
                status: true,
                message: "fetched contacts",
                data: contacts
            }
        } catch (error) {
            console.log("error inside the get_contacts", error)
            return {
                status: false,
                message: error.message
            }
        }
    },

    mark_spam: async(reqBody, reqUser) => {
        try {
            console.log("inside the mark_spam");
            if(!reqBody.phone) {
                throw new Error("please provide phone number");
            }
            let spam_obj = {}
            let  user = await models.User.findOne({
                where: {
                    phone: reqBody.phone
                }
            });
            if(user) {
                spam_obj.user_id = user.id;
            }
            spam_obj.phone = reqBody.phone
            spam_obj.marked_by = reqUser.user_id;
            spam_obj = await models.Spam.create(spam_obj)
            if(!spam_obj) throw new Error("error spamming the number");
            return {
                status: true,
                message: "spammed the number"
            }
        } catch (error) {
            console.log("error inside the mark_spam",  error);
            return {
                status: false,
                message: error.message
            }
        }
    },

    get_phone_user: async(reqBody, reqUser) => {
        try {
            console.log("inside the get_phone_user");
            let key_name = 'name_search' in reqBody ? "name" : 'phone_search'  in reqBody ? "phone" : 'generic';
            let get_table_data = await user_service.get_table_data(key_name);
            let result = await get_table_data(reqBody);
            return result
        } catch (error) {
            console.log("error inside the get_phone_user",  error);
            return {
                status: false,
                message: error.message
            }
        }
    },

    get_table_data: async(type) => {
        let object = {
            name: async(data) => {return await user_service.get_phone_data_by_name(data)},
            phone: async(data) => {return await user_service.get_phone_data_by_phone(data)}
        }
        return object[type];
    },

    get_phone_data_by_name: async(reqBody, reqUser) => {
        try {
            console.log("inside the get_phone_data_by_name");
            let limit = parseInt(reqBody.limit) || 10;
            const offset = parseInt(reqBody.offset) || limit;
            let _data = await models.User.findAll({
                include: 'owner_spam',
                where: { name: { [Op.like]: `${reqBody.name_search}%` } },
                attributes: { exclude: ['password'] },
                limit,
                offset,
              });

            if(!_data.length || _data.length < limit) {
                limit = limit - _data.length;
                let data = await models.User.findAll({
                    where: {
                      name: {
                        [Op.and]: [
                          { [Op.like]: `%${reqBody.name_search}%` },
                          { [Op.notLike]: `${reqBody.name_search}%` },
                        ],
                      },
                    },
                    include: 'owner_spam',
                    limit,
                    offset,
                });
                _data = [..._data, data];
            }
            return {
                status: true,
                message: "fetched data",
                data: _data
            }
        } catch (error) {
            console.log("error inside the get_phone_data_by_name", error)
            return {
                status: false,
                message: "error fetching data"
            }
        }
    },

    get_phone_data_by_phone: async(reqBody, resUser) => {
        try {
            console.log("inside the get_phone_data_by_phone");
            let limit = parseInt(reqBody.limit) || 10;
            const offset = parseInt(reqBody.offset) || limit;
            let type = "user";
            let where = { phone: reqBody.phone_search }
            let _data = await models.User.All({
                where: where,
                include: 'owner_spam', // Include spam data
              });
            if(!_data) {
                type = 'contact';
                _data = await models.Contact.findAll({
                    where: where,
                    limit,
                    offset,
                });
                if(_data) {
                    _data = _data.map(async(x) => {
                        try {
                            let _x = await models.Spam.findAll({
                                where: {
                                    phone: x.phone
                                }
                            })
                            if(_x.length) {
                                x.owned_spams = x[0]
                            }
                        } catch (error) {
                            x = x
                        }
                    })
                }
            }
            return {
                status: true,
                message: "fetched data",
                data: _data
            }
        } catch (error) {
            console.log("error inside the get_phone_data_by_phone", error)
            return {
                status: false,
                message: "error fetching data"
            }
        }
    },

    get_details: async(reqBody, reqUser) => {
        try {
            console.log("inside the get_details");
            let user_phone = reqUser.user_phone;
            let where = { phone: reqBody.phone }
            let _data = await models.User.findOne({
                where: where,
                attributes: ['id', 'name', "email"],
                include: ['owner_spam', 'contacts'],
            });
            _data = JSON.parse(JSON.stringify(_data))
            console.log("_data", JSON.parse(JSON.stringify(_data)))
            let contact = {}
            if(!_data) {
                contact = await models.Contact.findOne({
                    where: where,
                    attributes: ['id', "name", "phone"]
                })
                let spams = await models.Spam.findOne({
                    where: where
                });
                if(!contact) throw new Error("error finding the details")
                contact = JSON.parse(JSON.stringify(contact))
                if(spams) {
                    contact.owner_spam = [spams];
                    contact.is_spammed = true
                }
                _data = contact
            } else {
                let contacts = _data.contacts;
                let delete_flag = true
                for (let index = 0; index < contacts.length; index++) {
                    const element = contacts[index];
                    if(element.phone === user_phone) {
                        delete_flag = false;
                    }
                }
                if(delete_flag) delete _data.email;
                let owner_spam = _data.owner_spam;
                if(owner_spam.length) {
                    _data.is_spammed = true
                }
            }

            return {
                status: true,
                message: "fetched data",
                data: _data
            }
        } catch (error) {
            console.log("error inside the get_details", error)
            return {
                status: false,
                message: "error fetching data"
            }
        }
    }
}

module.exports = user_service