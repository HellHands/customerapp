var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");
var mongojs = require("mongojs");
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;
var app = express();

/* custom middleware..

var logger = function(req, res, next){
	console.log("Loggin..");
	next();
}

app.use(logger);
*/

//View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set Static Path
app.use(express.static(path.join(__dirname, "public")));

//Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

//Express Validator Middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}

		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// var users = [
// 	{
// 		id: 1,
// 		firstName: "John",
// 		lastName: "Doe",
// 		email: "johndoe@gmail.com"

// 	},
// 	{
// 		id: 2,
// 		firstName: "Jill",
// 		lastName: "jack",
// 		email: "jillyjack@gmail.com"

// 	},
// 	{
// 		id: 3,
// 		firstName: "Raj",
// 		lastName: "Moorani",
// 		email: "pmoorani@gmail.com"
// 	},
// ];

app.get("/", function(req, res){
	db.users.find(function(err, docs) {
		//console.log(docs);
		res.render('index', {
			title: "Customers",	//passing title variable to index.ejs
			users: docs
		});
	});
});

app.post("/users/add", function(req, res){
	//set validation rules
	req.checkBody("firstName", "First Name is required!").notEmpty();
	req.checkBody("lastName", "Last Name is required!").notEmpty();
	req.checkBody("email", "Email is required!").notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.render('index', {
			title: "Customers",	//passing title variable to index.ejs
			users: users,
			errors: errors
		});
	} else {
		var newUser = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email
		}

		db.users.insert(newUser, function(err, result) {
			if (err) {
				console.log(err);
			}else{
				res.redirect("/");
			}
		});
		// console.log('success');
	}
	// res.json(newUser);
});

// DELETE ROUTE
app.delete("/users/delete/:id", function(req, res) {
	//console.log(req.params.id); 
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
			res.redirect("/");
		}
	});
});

app.listen(3000, function(){
	console.log("Server listening on port: 3000");
});

