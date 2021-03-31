const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
  Article.findAll({
    include: [{model: Category}],
    order: [
      ["id", "DESC"], //ou ASC
      ["createdAt", "DESC"],
    ],
  }).then(articles => {

    res.render("admin/articles/index", {articles});
  })
});

router.get("/admin/articles/new", (req, res) => {
  Category.findAll({
    order: [
      ["title", "ASC"], //ou ASC
      ["createdAt", "DESC"],
    ],
  }).then((categories) => {
    res.render("admin/articles/new", { categories });
  });
});

router.post("/articles/save", (req, res) => {
  const { title, body, category } = req.body;

  if (title && body && category) {
    Article.create({ title, body, categoryId: category, slug: slugify(title, { lower: true }) })
      .then(() => {
        res.redirect("/admin/articles");
      })
      .catch((err) => {
        res.redirect("/admin/articles/new");
        console.log(err)
      });
  } else {
    res.redirect("/admin/articles/new");
  }
});

router.post("/articles/delete", (req, res) => {
  const {id} = req.body

  if(!id || isNaN(id)){
    res.redirect("/admin/categories")
  }
  
  Article.destroy({where: {id},})
  .then(() => {
    res.redirect("/admin/articles")
  })
  .catch(err => {
    res.redirect("/admin/articles")
  })

})

module.exports = router;
