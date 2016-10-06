/*
 * Module dependencies
 */
 
var express = require('express');


var app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(express.logger('dev'))

app.use(express.static(__dirname + '/public'))

app.get('/*', function (req, res) {
	path = req.path.replace(/\//g, "");
	if(path == ""){
		path = 'index';
	}
	console.log(path);
	if (req.query.content_only == 'true') {
		res.render(path, {content_only: true});
	}
	else {
		res.render(path, {content_only: false});
	}
  
})

app.listen(3000)