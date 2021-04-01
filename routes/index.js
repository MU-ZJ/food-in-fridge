const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
const fetch = require("node-fetch");

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
  db.oneOrNone(
    "SELECT user_handle, user_pass FROM users WHERE user_handle = $1",
    [user_handle]
  )
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

router.get("/shopping-list", (req, res) => {
  res.render("shopping-list");
});

router.post("/shopping-list", (req, res) => {
  let allIngred = req.body.allIngred;
  let selectIngred = req.body.foodIngred;
  let totalOrder = []
  let checkedIngred = []
  let finalOrder = []

  let thisRecipe = req.body.recipe;
  let userId = "5";
  let items = thisRecipe[0].split("?");
  let uri = items[0].split("_");
  let key = uri[1];

  console.log(allIngred)
  console.log(selectIngred)


  //This is Needed to Create A List Complete with true or false for all items in list
  if (allIngred.length == 1) {
    let thisOne = allIngred[0].split("?")
    totalOrder.push(thisOne)
    console.log('used one')
    console.log(thisOne)
  } else {
    for (index = 0; index < allIngred.length; index++) {
      let thisOne = allIngred[index].split("?")
      totalOrder.push(thisOne)
    }
  }

  console.log(totalOrder)

  if (typeof selectIngred === 'string') {
    console.log(typeof(selectIngred))
    let makeList = selectIngred
    console.log(makeList)
    let thisOne = makeList.split("?")
    checkedIngred.push(thisOne)
  } else {

    for (index = 0; index < selectIngred.length; index++) {
      let thisOne = selectIngred[index].split("?")
      checkedIngred.push(thisOne)
    }
  }
  console.log(checkedIngred)


  for (index = 0; index < totalOrder.length; index++) {
    let match = 0
    for (y = 0; y < checkedIngred.length; y++) {
      console.log(totalOrder[index][1])
      console.log(checkedIngred[y][1])
      console.log(match)
      if (totalOrder[index][1] == checkedIngred[y][1]) {
        match = 1
        console.log(match)
      }

    }
    if (match == 0) {
      let notChecked = totalOrder[index]
      console.log(notChecked)
      notChecked.push(false)
      finalOrder.push(notChecked)
      console.log(notChecked)
    
    }

  }

for(index = 0; index < checkedIngred.length; index ++) {
  let checked = checkedIngred[index]
  checked.push(true)
  finalOrder.push(checked)
}

db.none(
  "INSERT INTO recipe_list(recipe_key, recipe_title, recipe_img, user_id) VALUES($1, $2, $3, $4)",
  [key, items[2], items[1], 1]
).then((res) => {
  db.one("SELECT recipe_id from recipe_list WHERE recipe_key = $1 ", [
    key,
  ]).then((result) => {
    recipe_id = result.recipe_id;


    for (let index = 0; index < selectIngred.length; index++) {
      let ingreds = finalOrder[index]
      // console.log(ingreds[0]);
      // console.log(ingreds);


      console.log(recipe_id);

      db.none(
        "INSERT INTO ingred_list(ingred_name, ingred_img, ingred_key, ingred_active, user_id, recipe_id) VALUES($1, $2, $3, $4, $5, $6)",
        [ingreds[0], ingreds[2], ingreds[1], ingreds[3], userId, recipe_id]
      )
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
});




  console.log(finalOrder)
  res.send(finalOrder)

})



//   let thisRecipe = req.body.recipe;
//   let userId = "5";
//   let notChecked = []
//   let items = thisRecipe[0].split("?");
//   let recipe_id = "2";
//   let uri = items[0].split("_");
//   let key = uri[1];


//   for (let index = 0; index < allIngred.length; index++){
//     let ingredients = allIngred[index].split("?");
//     let ingreds = ingredients[0].split(',')
//     // console.log(ingreds);

//     ingreds.map((ingred)=>{
//       ingred.ingred_active = false
//       console.log(ingred)

//     })

//   }
//   for (let index = 0; index < allIngred.length; index++) {
//     let ingredients = allIngred[index].split("?");
//     let ingreds = ingredients[0].split(',')
//     console.log(ingreds);


//     db.none(
//       "INSERT INTO ingred_list(ingred_name, ingred_img, ingred_key, ingred_active, user_id, recipe_id) VALUES($1, $2, $3, $4, $5, $6)",
//       [ingreds[0], ingreds[2], ingreds[1], false, userId, recipe_id]
//     )
//     }



//   db.none(
//     "INSERT INTO recipe_list(recipe_key, recipe_title, recipe_img, user_id) VALUES($1, $2, $3, $4)",
//     [key, items[2], items[1], 1]
//   ).then((res) => {
//     db.one("SELECT recipe_id from recipe_list WHERE recipe_key = $1 ", [
//       key,
//     ]).then((result) => {
//       recipe_id = result.recipe_id;


//       for (let index = 0; index < selectIngred.length; index++) {
//         let ingreds = selectIngred[index].split("?");
//         console.log(ingreds[0]);
//         console.log(ingreds);


//         console.log(recipe_id);

//         db.none(
//           "INSERT INTO ingred_list(ingred_name, ingred_img, ingred_key, ingred_active, user_id, recipe_id) VALUES($1, $2, $3, $4, $5, $6)",
//           [ingreds[0], ingreds[2], ingreds[1], true, userId, recipe_id]
//         )
//           .then((res) => {
//             console.log(res);
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       }
//     });
//   });
// });

// for(let index = 0; index < selectIngred.length; index++) {

//   let ingreds = selectIngred[index].split("?")
//   console.log(ingreds[0])
//   console.log(ingreds)

//   console.log(recipe_id)

//   db.none(
//     "INSERT INTO ingred_list(ingred_name, ingred_img, ingred_key, ingred_active, user_id, recipe_id) VALUES($1, $2, $3, $4, $5, $6)",[ingreds[0], ingreds[2], ingreds[1], true, userId, recipe_id]
//   ).then((res) => {
//     console.log(res)
//   }).catch((error)=>{
//     console.log(error)
//   })
// }

// })


router.get("/choice", (req, res) => {
  res.render("inhouse");
});

router.post("/choice", (req, res) => {
  let stuff = [];

  if (req.body.beef) {
    stuff.push(req.body.beef);
  }
  if (req.body.chicken) {
    stuff.push(req.body.chicken);
  }
  if (req.body.pork) {
    stuff.push(req.body.pork);
  }
  if (req.body.fish) {
    stuff.push(req.body.fish);
  }
  if (req.body.turkey) {
    stuff.push(req.body.turkey);
  }
  if (req.body.lamb) {
    stuff.push(req.body.lamb);
  }
  if (req.body.tomato) {
    stuff.push(req.body.tomato);
  }
  if (req.body.carrot) {
    stuff.push(req.body.carrot);
  }
  if (req.body.beans) {
    stuff.push(req.body.beans);
  }
  if (req.body.broccoli) {
    stuff.push(req.body.broccoli);
  }
  if (req.body.peppers) {
    stuff.push(req.body.peppers);
  }
  if (req.body.lettuce) {
    stuff.push(req.body.lettuce);
  }
  if (req.body.rice) {
    stuff.push(req.body.rice);
  }
  if (req.body.pasta) {
    stuff.push(req.body.pasta);
  }
  if (req.body.eggs) {
    stuff.push(req.body.eggs);
  }
  if (req.body.cheese) {
    stuff.push(req.body.cheese);
  }
  if (req.body.milk) {
    stuff.push(req.body.milk);
  }
  if (req.body.butter) {
    stuff.push(req.body.butter);
  }
  if (req.body.bread) {
    stuff.push(req.body.bread);
  }

  fetch(
    `https://api.edamam.com/search?q=${stuff}&app_id=a49443ff&app_key=e31785b777706422206d071c54db598e`
  )
    .then((response) => {
      return response.json();
    })
    .then((recipe) => {
      res.render("recipelist", { eat: recipe.hits });
    });
});

//Doesn't work - Need to edit api response to have recipe ID ready
router.post("/recipe/", (req, res) => {
  let item = req.body.recipe;

  let itemone = item.split("_");
  let recpie = itemone[1];

  fetch(
    `https://api.edamam.com/search?q=${recpie}&app_id=a49443ff&app_key=e31785b777706422206d071c54db598e`
  )
    .then((response) => {
      return response.json();
    })
    .then((recipe) => {
      res.render("recipe", { eat: recipe.hits });
    });
});

router.get("/recipe/:id", (req, res) => {
  let item = req.params.id;
  fetch(
    `https://api.edamam.com/search?q=${item}&app_id=a49443ff&app_key=e31785b777706422206d071c54db598e`
  )
    .then((response) => {
      return response.json();
    })
    .then((recipe) => {
      res.render("recipelist", { eat: recipe.hits });
    });
});

module.exports = router;
