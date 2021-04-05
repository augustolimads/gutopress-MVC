const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", { users });
  });
});

router.get("/admin/users/create", (req, res) => {
  const { email, password } = req.body;
  res.render("admin/users/new");
});

router.post("/users/create", (req, res) => {
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
        res.json(req.session.user);
      } else {
        res.redirect("/login");
      }
    }
  });
});

module.exports = router;
("");
