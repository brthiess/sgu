/*
 * Module dependencies
 */
var express = require('express');


var app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(express.logger('dev'))

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('index'
  )
})
app.listen(3000)