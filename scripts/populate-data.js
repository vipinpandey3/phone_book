const models = require('../models');
const faker = require('faker');
const bcrypt = require('bcryptjs');
const config = require('../config');

const populate_user = async() => {
    let user = await models.User.create({
        name: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        password: bcrypt.hashSync("12345689", config.SALT_ROUNDS),
    })
    return user
}

const populate_contact = async(user, num) => {
    for (let i = 0; i < num; i++) {
        await models.Contact.create({
            userId: user.id,
            name: faker.name.findName(),
            phone: faker.phone.phoneNumber(),
        });
    }
}

const populate_spam = async(user, num) => {
    for (let i = 0; i < num; i++) {
        let object = {
            phone: faker.phone.phoneNumber(),
            marked_by: user.id,   
        }
        if(i%2==0) {
            object.user_id = user.id
        }
        let spam = await models.Spam.create(object);
    }
}

const populate_data = async(num = 10) => {
    for (let i = 0; i < num; i++) {
        const user = await populate_user();
        await populate_contact(user, num, i);
        await populate_spam(user, num, i);
    }
}

populate_data(10);