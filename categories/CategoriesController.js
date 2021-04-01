const express = require("express");
const router = express.Router();
const Category = require("./Category");

const slugify = require("slugify");

router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
  const { title } = req.body;

  if (title) {
    Category.create({
      title,
      slug: slugify(title, { lower: true }),
    }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

router.get("/admin/categories", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/categories", { categories });
  });
});

router.post("/categories/delete", (req, res) => {
  const { id } = req.body;

  if (!id || isNaN(id)) {
    res.redirect("/admin/categories");
  } 

  Category.destroy({
    where: { id },
  }).then(() => {
    res.redirect("/admin/categories");
  });
  
});

router.get("/admin/categories/:id", (req, res) => {
  const id = Number(req.params.id);

  Category.findByPk(id)
    .then((category) => {
      if (!category || isNaN(id)) {
        res.redirect("/admin/categories");
      } else {
      }
      res.render("admin/categories/edit", { category });

    })
    .catch((err) => {
      res.redirect("/admin/categories");
    });
});

router.post("/categories/update", (req, res) => {
  const {id, title} = req.body

  Category.update({title, slug: slugify(title, { lower: true })}, {where:{id}})
    .then(() => {
      res.redirect("/admin/categories")
    })
})

router.get("/categories/page/:num", (req, res) => {
  const { num } = req.params;
  let limit = 5;
  let offset = (isNaN(num) || num <= 1) ? 0 : (parseInt(num) -1) * limit ;

  Category.findAndCountAll({ limit, offset, order: [["id", "DESC"]]})
    .then((categories) => {
      let next = (offset + limit >= categories.count) ? false : true
     
      res.json({next, categories});
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
