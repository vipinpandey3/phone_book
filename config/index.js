require('dotenv').config();
let config = {};

// Data base configuratiion credentials
config.DB_HOST = process.env.DB_HOST;
config.DB_SCHEMA = process.env.DB_SCHEMA;
config.DB_USER_NAME = process.env.DB_USER_NAME;
config.DB_PASSWORD = process.env.DB_PASSWORD;
config.DB_PORT = process.env.DB_PORT

config.ENVIRONMENT = process.env.ENVIRONMENT;
config.UAT = 'UAT';

config.SERVER_PORT = process.env.SERVER_PORT;

config.JWT_SIGNING_KEY = process.env.JWT_SIGNING_KEY;

config.NPA_SERVER_URL = process.env.NPA_SERVER_URL

config.UPLOAD_FOLDER_PATH = process.env.UPLOAD_FOLDER_PATH;

config.SALT_ROUNDS = process.env.SALT_ROUNDS ? process.env.SALT_ROUNDS : 8

config.IS_PRODUCTION_ENVIRONMENT = () => config.ENVIRONMENT === 'PRODUCTION';

module.exports = config;