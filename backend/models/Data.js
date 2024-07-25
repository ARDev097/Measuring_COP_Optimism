const { DataTypes } = require('sequelize');
const sequelize = require('./index');

// Define the Data model
const Data = sequelize.define('Data', {
  calculationId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weights: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  scores: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  results: {
    type: DataTypes.TEXT, // Use TEXT for longer strings
    allowNull: true,     // Allow NULL if results are not available at the time of creation
  },
});

module.exports = Data;
