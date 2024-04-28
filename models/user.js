'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.Contact, {
        foreignKey: 'user_id',
        as: 'contacts',
      });
      this.hasMany(models.Spam, {
        foreignKey: 'marked_by',
        as: 'spams',
      });
      this.hasMany(models.Spam, {
        foreignKey: 'user_id', // User to Spam relationship
        as: 'owner_spam', // Alias to indicate ownership
      });  
    }
  }
  User.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};