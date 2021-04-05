const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/users", adminAuth, (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", { users });
  });
});

router.get("/admin/users/create", adminAuth, (req, res) => {
  const { email, password } = req.body;
  res.render("admin/users/new");
});

router.post("/users/create", adminAuth, (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      res.redirect("/admin/users/create");
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      User.create({
        email,
        password: hash,
      })
        .then(() => res.redirect("/admin/users"))
        .catch((err) => console.log(err));
    }
  });
});

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/users/authenticate", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (!user) {
      res.redirect("/login");
    } else {
      const correct = bcrypt.compareSync(password, user.password);
      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        res.redirect("/admin/articles");
      } else {
        res.redirect("/login");
      }
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/")
})

module.exports = router;
("");
