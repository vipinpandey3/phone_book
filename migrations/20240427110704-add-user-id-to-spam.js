'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the user_id column to the Spam table, referencing the User table
    await queryInterface.addColumn('Spams', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Can be null if the spammed number doesn't belong to a registered user
      references: {
        model: 'Users', // Table to reference
        key: 'id', // Column to reference
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the user_id column from the Spam table (if rolling back)
    await queryInterface.removeColumn('Spams', 'user_id');
  },
};
