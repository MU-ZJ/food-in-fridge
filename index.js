const express = require("express")
const app = express()
var session = require('express-session')
var bcrypt = require('bcryptjs');
const pgp = require("pg-promise")()
require('dotenv').config()

const PORT = process.env.PORT || 8080 

exp.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true
  }))

const connectionString = {
    host: 'queenie.db.elephantsql.com',
    port: 5432,
    database: 'lahyjaxt ',
    user: 'lahyjaxt ',
    password: process.env.DB_KEY,
};

const db = pgp(connectionString)

const mustacheExpress = require('mustache-express')

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.urlencoded())

app.listen(PORT,() => {
    console.log('live')
})