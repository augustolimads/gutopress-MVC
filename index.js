const express = require("express");
const app = express();
const connection = require("./database/database");
const session = require("express-session")

const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const UsersController = require("./users/UsersController")


app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 30000 },
  resave: true,
  saveUninitialized: false
}))

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
app.use("/", UsersController)

app.get("/session/generate", (req, res) => {
  req.session.treinamento = "formação node"
  req.session.ano = 2019
  req.session.email = "augusto@email.com"
  res.send('sessão gerada')
})

app.get("/session/read", (req, res) => {
  const {treinamento, ano, email} = req.session;

  res.json({
    treinamento, ano, email
  })
})

app.listen(8080, () => {
  console.log("servidor rodando na porta: http://localhost:8080");
});
