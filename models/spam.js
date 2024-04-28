const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) =>{
  class Spam extends Model {
    static associate(models) {
      // Relationship with the User who marked the number as spam
      this.belongsTo(models.User, {
        foreignKey: 'marked_by', // User who marked the number as spam
        as: 'marker', // Alias for the relationship
      });
  
      // Relationship with the User who owns the spammed number
      this.belongsTo(models.User, {
        foreignKey: 'user_id', // User who owns the spammed number
        as: 'owner', // Alias for the relationship
      });
    }
  }
  Spam.init(
    {
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marked_by: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Spam',
      timestamps: true,
    }
  );
  return Spam;
}
