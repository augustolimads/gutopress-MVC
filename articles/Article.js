const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define(
  "article",
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {}
);

Category.hasMany(Article);
Article.belongsTo(Category);

// Article.sync({ force: false }).catch((err) => {
//   console.log(err);
// });

module.exports = Article;
