const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
const fetch = require('node-fetch');

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
                res.redirect("/");
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

router.get('/choice', (req, res) => {
    res.render('inhouse')
})

router.post('/choice', (req, res) => {
  let stuff = []  
  
  if(req.body.beef) {stuff.push(req.body.beef)}
  if(req.body.chicken) {stuff.push(req.body.chicken)}
  if(req.body.pork) {stuff.push(req.body.pork)}
  if(req.body.fish) {stuff.push(req.body.fish)}
  if(req.body.turkey) {stuff.push(req.body.turkey)}
  if(req.body.lamb) {stuff.push(req.body.lamb)}
  if(req.body.tomato) {stuff.push(req.body.tomato)}
  if(req.body.carrot) {stuff.push(req.body.carrot)}
  if(req.body.beans) {stuff.push(req.body.beans)}
  if(req.body.broccoli) {stuff.push(req.body.broccoli)}
  if(req.body.peppers) {stuff.push(req.body.peppers)}
  if(req.body.lettuce) {stuff.push(req.body.lettuce)}
  if(req.body.rice) {stuff.push(req.body.rice)}
  if(req.body.pasta) {stuff.push(req.body.pasta)}
  if(req.body.eggs) {stuff.push(req.body.eggs)}
  if(req.body.cheese) {stuff.push(req.body.cheese)}
  if(req.body.milk) {stuff.push(req.body.milk)}
  if(req.body.butter) {stuff.push(req.body.butter)}
  if(req.body.bread) {stuff.push(req.body.bread)}



    fetch(`https://api.edamam.com/search?q=${stuff}&app_id=a49443ff&app_key=e31785b777706422206d071c54db598e`)
    .then((response) => {
        
        return response.json()
    })
    .then((recipe) => {

        res.render('recipelist', {eat: recipe.hits})
    })


})


module.exports = router;
