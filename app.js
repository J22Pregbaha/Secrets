// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
	const password = req.body.password;

	User.findOne({email: email}, function (err, user) {
		if (err) {
			console.log(err);
		} else {
			if (user) {
				bcrypt.compare(password, user.password, function (err, result) {
					if (result === true) {
						res.render("secrets");
					}
				});
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
	const password = req.body.password;

	bcrypt.hash(password, saltRounds, function(err, hash) {
		const newUser = new User({
			email: email,
			password: hash,
		});

		newUser.save(function (err) {
			if (err) {
				console.log(err);
			} else {
				res.render("secrets");
			}
		});
	});
});


app.listen(3000, function () {
	console.log("Server started on port 3000");
});
