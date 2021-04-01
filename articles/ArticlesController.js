const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const {pagination, handleNext} = require('../utils/pagination')

router.get("/admin/articles", (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
    order: [
      ["id", "DESC"], //ou ASC
      ["createdAt", "DESC"],
    ],
  }).then((articles) => {
    res.render("admin/articles/index", { articles });
  });
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
    Article.create({
      title,
      body,
      categoryId: category,
      slug: slugify(title, { lower: true }),
    })
      .then(() => {
        res.redirect("/admin/articles");
      })
      .catch((err) => {
        res.redirect("/admin/articles/new");
        console.log(err);
      });
  } else {
    res.redirect("/admin/articles/new");
  }
});

router.post("/articles/delete", (req, res) => {
  const { id } = req.body;

  if (!id || isNaN(id)) {
    res.redirect("/admin/categories");
  }

  Article.destroy({ where: { id } })
    .then(() => {
      res.redirect("/admin/articles");
    })
    .catch((err) => {
      res.redirect("/admin/articles");
    });
});

router.get("/admin/articles/:id", (req, res) => {
  const id = Number(req.params.id);
  let categoriesList = [];

  Category.findAll({
    order: [
      ["title", "ASC"], //ou ASC
      ["createdAt", "DESC"],
    ],
  }).then((categories) => {
    categoriesList = categories;
  });

  Article.findByPk(id, { include: [{ model: Category }] }) //include: [{model: Category}],
    .then((article) => {
      if (!article || isNaN(id)) {
        res.redirect("/admin/articles");
      } else {
        res.render("admin/articles/edit", {
          article,
          categories: categoriesList,
        });
      }
    })
    .catch((err) => {
      res.redirect("/admin/articles");
    });
});

router.post("/articles/update", (req, res) => {
  const { title, body, category, id } = req.body;

  if (title && body && category) {
    Article.update(
      {
        title,
        body,
        categoryId: category,
        slug: slugify(title, { lower: true }),
      },
      {
        where: { id },
      }
    )
      .then(() => {
        res.redirect("/admin/articles");
      })
      .catch((err) => {
        res.redirect("/admin/articles/edit");
        console.log(err);
      });
  } else {
    res.redirect("/admin/articles/edit");
  }
});

router.get("/articles/page/:num", (req, res) => {
  const { num } = req.params;
  const {limit, offset} = pagination(4, num)
  
  Article.findAndCountAll({ limit, offset, order: [["id", "DESC"]]})
    .then((articles) => {
      const next = handleNext(offset, limit, articles.count)
     
      res.json({next, articles});
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
