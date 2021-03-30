const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define(
  "category",
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {}
);

// Category.sync({ force: false }).catch((err) => {
//   console.log(err);
// });

module.exports = Category;
