const Sequelize = require("sequelize");
require("dotenv").config();

const connection = new Sequelize(
  "gutopress",
  process.env.MYSQL_ADMIN_USERNAME,
  process.env.MYSQL_ADMIN_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  }
);

module.exports = connection;
