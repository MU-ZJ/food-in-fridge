const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  const user = req.session.userid;

  if (!user) {
    res.render("index", { login: "Login" });
  } else {
    res.render("index", { login: `Hello ${user}` });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", (req, res) => {
  const user_handle = req.body.user_handle;
  const user_pass = req.body.user_pass;

  db.one("SELECT user_handle, user_pass FROM users WHERE user_handle = $1", [
    user_handle,
  ])
    .then((user) => {
      bcrypt.compare(user_pass, user.user_pass, (error, result) => {
        if (result) {
          if (req.session) {
            req.session.userId = user.id;
            req.session.username = user.name;
            res.redirect("/");
/*           ---------------------------------------------
            |Temporarily set to index redirect for testing|
	     ---------------------------------------------
*/         
          }
        } else {
          res.render("login", { message: "Invalid Password!" });
        }
      });
    })
    .catch((error) => {
      res.render("login", { message: "User doesnt Exist!" });
    });
});
router.post("/register", (req, res) => {
  let user_handle = req.body.user_handle;
  let user_pass = req.body.user_pass;
  console.log(user_handle);
  db.oneOrNone("SELECT user_handle, user_pass FROM users WHERE user_handle = $1", [
    user_handle,
  ])
    .then((user) => {
      if (user) {
        res.render("register", { message: "User Already Exists" });
      } else {
        bcrypt.genSalt(10, function (error, salt) {
          bcrypt.hash(user_pass, salt, function (error, hash) {
            if (!error) {
              db.none(
                "INSERT INTO users(user_handle, user_pass) VALUES($1, $2)",
                [user_handle, hash]
              ).then(() => {
                res.redirect("/login");
              });
            }
          });
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
module.exports = router;
