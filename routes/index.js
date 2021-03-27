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

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    res.send(`We need to do something with ${email} and ${password}`)
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    res.send(`We need to do something with ${email} and ${password}`)
})

module.exports = router