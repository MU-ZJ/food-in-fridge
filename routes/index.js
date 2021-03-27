const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    let user = req.session.userid

    if (!user) {
        res.render('index', {login: 'Login'})
    } else {
        res.render('index', {login: `Hello ${user}`})
    }
})

module.exports = router