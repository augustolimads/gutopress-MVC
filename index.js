const express = require("express");
const app = express();
const connection = require("./database/database");

const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connection
  .authenticate()
  .then(() => {
    console.log("conexão feita com o BD");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", CategoriesController);
app.use("/", ArticlesController);

app.get("/", (req, res) => {
  let categoryList = [];

  //Category list for navbar
  Category.findAll({ order: [["title", "ASC"]] }).then((categories) => {
    categoryList = categories;
  });

  //
  Article.findAll({
    include: [{ model: Category }],
    order: [
      ["id", "DESC"], //ou ASC
      ["createdAt", "DESC"],
    ],
  }).then((articles) => {
    res.render("index", { articles, categories: categoryList });
  });
});

//Category
app.get("/category/:slug", (req, res) => {
  const { slug } = req.params;

  Category.findOne(
    { where: { slug },
      include: [{model: Article}]
  },
    )
    .then((category) => {
      if (category) {
        Category.findAll({order: [["title", "ASC"]]}).then(categories => {
          res.render("index", {articles: category.articles, categories });
        })
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

// Article
app.get("/:slug", (req, res) => {
  const { slug } = req.params;

  let categoryList = [];

  Category.findAll({ order: [["title", "ASC"]] }).then((categories) => {
    categoryList = categories;
  });

  Article.findOne({ where: { slug } })
    .then((article) => {
      if (article) {
        res.render("article", { article, categories: categoryList });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});



app.listen(8080, () => {
  console.log("servidor rodando na porta: http://localhost:8080");
});
