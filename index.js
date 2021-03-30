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

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", CategoriesController);
app.use("/", ArticlesController);

app.listen(8080, () => {
  console.log("servidor rodando na porta: http://localhost:8080");
});
