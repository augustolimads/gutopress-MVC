const express = require("express");
const router = express.Router();
const Category = require("./Category");
const Article = require("../articles/Article");

const slugify = require("slugify");
const { pagination, handleBackNext } = require("../utils/pagination");

router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new");
});

router.get("/admin/categories", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/categories", { categories });
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

router.post("/categories/update", (req, res) => {
  const {id, title} = req.body

  Category.update({title, slug: slugify(title, { lower: true })}, {where:{id}})
    .then(() => {
      res.redirect("/admin/categories")
    })
})

// router.get("/categories/page/:num", (req, res) => {
//   const { num } = req.params;
//   const {limit, offset} = pagination(4, num)

//   Category.findAndCountAll({ limit, offset, order: [["id", "DESC"]]})
//     .then((categories) => {
//       const next = handleNext(offset, limit, categories.count)
     
//       res.json({next, categories});
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

router.get("/category/:slug", (req, res) => {
  const { slug } = req.params;
  res.redirect(`/category/${slug}/1`)
})

router.get("/category/:slug/:num", (req, res) => {
  const { slug } = req.params;
  let { num } = req.params;
  const {limit, offset} = pagination(1, num)

  //Category list for navbar
  let categoryList = [];
  Category.findAll({ order: [["title", "ASC"]] }).then((categories) => {
    categoryList = categories;
  });

  //Get Category id by slug
  let categoryId = 0;
  let categoryTitle = ""

  Category.findOne({where: {slug}}).then(category => {

    if(category) {
      categoryId = category.id;
      categoryTitle = category.title

      //Get all articles
      Article.findAndCountAll({limit, offset, where:{categoryId}, order: [["id", "DESC"]]})
      .then(articles => {
        const {back, next} = handleBackNext(offset, limit, articles.count, num)
        res.render("index",{
          next, 
          back, 
          offset, 
          limit, 
          num, 
          categorySlug: slug, 
          articles: articles.rows, 
          categories: categoryList });
      })
      .catch(err => console.log(err))

    } else {
      res.redirect("/")
    }
  }).catch(err => {
    console.log(err)
  })

});

module.exports = router;
