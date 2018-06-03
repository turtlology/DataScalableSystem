var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var session = require('express-session');
var FileStore = require('session-file-store')(session);

const Sequelize = require('sequelize');
const sequelize = new Sequelize('DataScalableSystem', 'root', 'root', {
	host: 'localhost',
	dialect: 'mysql',

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

	operatorsAliases: false
});

app.get('/', function(req, res){
	res.send('Hello, world!');
});


const User = sequelize.define('users', {
	name: {
		type: Sequelize.STRING
	},
	password: {
		type: Sequelize.STRING
	},
	firstName: {
		type: Sequelize.STRING
	},
	lastName: {
		type: Sequelize.STRING
	}
});

app.get('/insert', function(req, res){

	User.sync({force: true}).then(() => {
		// Table created
		return User.create({
			name: "hsmith",
			password: "smith",
			firstName: "Henry",
			lastName: "Smith"
		}).then(() => {
			return User.create({
				name : "tbucktoo",
				password : "bucktoo",
				firstName: "Tim",
				lastName: "Bucktoo"
			})
		});
	});
	res.send({"message": "insert successfully"});
});

var identityKey = 'skey';

app.use(session({
	name: identityKey,
	secret: 'chyingp',
	store: new FileStore(),
	saveUninitialized: false,
	resave: true,
	cookie: {
		maxAge: 15 * 60 * 1000
	}
}));

app.post('/login', function(req, res){
	if (req.body){
		var sess = req.session;

		(async () => {
			var user = await User.find({
				where: {
					name: req.body.username,
					password: req.body.password
				}
			});
			if (user){
				req.session.regenerate(function(err) {
					req.session.loginUser = user.get('name');
					res.json({"message":"Welcome "+user.get('firstName')})
				});
				console.log(user.get("firstName"))
			} else {
				res.json({"message":"There seems to be an issue with the username/password combination that you entered"});
			}
		}) ();



	} else {
		res.send('The input is not in json type');
	}
});

app.post('/logout', function(req, res){
	if (!isLogIn(req)){
		res.json({"message":"You are not currently logged in"});
	}
	req.session.destroy(function(err) {
		res.clearCookie(identityKey);
		res.json({"message":"You have been successfully logged out"});
	});
});

app.post('/add', function(req, res){
	//console.log("here is add");
	if (!isLogIn(req)){
		res.json({"message":"You are not currently logged in"});
		return;
	}
	if (req.body){
		var num1 = req.body.num1;
		var num2 = req.body.num2;
		if ( !isInteger(num1) || !isInteger(num2)){
			res.json({"message":"The numbers you entered are not valid"});
			return;
		}
		var result = num1 + num2;
		res.json({"message":"The action was successful", "result": result});

	}
});

app.post('/multiple', function(req, res){
	//console.log("here is multiple");
	if (!isLogIn(req)){
		res.json({"message":"You are not currently logged in"});
		return;
	}
	if (req.body){
		var num1 = req.body.num1;
		var num2 = req.body.num2;
		if ( !isInteger(num1) || !isInteger(num2)){
			res.json({"message":"The numbers you entered are not valid"});
			return;
		}
		var result = num1 * num2;
		res.send({"message":"The action was successful", "result": result});

	}
});

app.post('/divide', function(req, res){
	//console.log("here is divide");
	if (!isLogIn(req)){
		res.send({"message":"You are not currently logged in"});
		return;
	}
	if (req.body){
		var num1 = req.body.num1;
		var num2 = req.body.num2;
		if ( !isInteger(num1) || !isInteger(num2) || num2 == 0){
			res.send({"message":"The numbers you entered are not valid"});
			return;
		}
		var result = num1 / num2;
		res.send({"message":"The action was successful", "result": result});

	}
});

function isInteger(obj){

	return typeof obj === 'number' && obj%1 === 0;

}

var users = [
	{name : "hsmith", password : "smith"},
	{name : "tbucktoo", password : "bucktoo"}
];

function isLogIn(req){
	var sess = req.session;
	var loginUser = sess.loginUser;
	var isLogined = !!loginUser;
	return isLogined;
}

app.listen(4000);
