// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretsDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

const User = mongoose.model('User', userSchema);

app.get("/", function(req, res) {
	res.render("home");
});

app.route("/login")
.get(function (req, res) {
	res.render("login");
})
.post(function (req, res) {
	const email = req.body.username;
	const password = md5(req.body.password);

	User.findOne({email: email, password: password}, function (err, user) {
		if (err) {
			console.log(err);
		} else {
			if (user) {
				res.render("secrets");
			}
		}
	})
});

app.route("/register")
.get(function (req, res) {
	res.render("register");
})
.post(function (req, res) {
	const email = req.body.username;
	const password = md5(req.body.password);
	
	const newUser = new User({
		email: email,
		password: password
	});
	
	newUser.save(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.render("secrets");
		}
	})
});


app.listen(3000, function () {
	console.log("Server started on port 3000");
});
