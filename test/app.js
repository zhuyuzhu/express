var path = require('path');
var fs = require('fs');

const express = require('express')
const app = express()

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


const port = 3000

var session = require('express-session')
var cookieParser = require('cookie-parser')

app.use(session({
    secret: 'myself',
    resave: false,
    saveUninitialized: false
}))

app.use(cookieParser())

app.get('/login', (req, res, next) => {
    if(!req.session.user){
        req.session.user = {name: 'zhu'}
        return res.end('success login!')
    }else {
        next();
    }
})

app.use((req, res, next) => {
    if(!req.session.user){
        return res.end('no sesssion')
    }else {
        next();
    }
})

app.get('/', (req, res) => {
    if(!req.cookies.home){
        res.cookie("home",'true',{maxAge: 900000, httpOnly: true});
    }
  res.send('Home Page')
})

app.get('/set', (req, res) => {
    if(!req.cookies.home){
        return res.end('no access home page, please access home page first!')
    }else {
        fs.readFile(path.join(__dirname, './node.html'), (err, data) => {
            res.status(200).end(data);
        })
    }

})
app.post('/postSameOrigin', (req, res) => {
    console.log(req.body);
    res.end(JSON.stringify(req.body))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
