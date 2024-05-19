const { Sequelize } = require('sequelize');
const config = require('../../config/config.json'); // Adjust the path if necessary

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

module.exports = sequelize;
