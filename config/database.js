const { Sequelize } = require('sequelize');

module.exports = new Sequelize('codegig', 'postgres', 'admin321', {
  host: 'localhost',
  dialect: 'postgres'
});
