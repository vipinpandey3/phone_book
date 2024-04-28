const express = require('express');
var passport = require('passport');
const { create_contacts, 
    get_user_details, 
    get_contacts, 
    mark_spam, 
    get_phone_user,
    get_details
} = require('../controllers/user.controller');
const router = express.Router();


router.post('/create-contacts', create_contacts);

router.get('/get-user-details', get_user_details);

router.post('/get-contacts', get_contacts);

router.post('/mark-spam', mark_spam);

router.post('/get-phone-user', get_phone_user);

router.get('/get-details/:phone', get_details)

module.exports = router;
