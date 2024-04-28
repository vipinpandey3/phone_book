'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add a unique constraint to the phone column in the User table
    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true, // Adding the unique constraint
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the unique constraint if you need to revert the migration
    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false, // Removing the unique constraint
    });
  },
};
