// Express for routing
var express = require("express");

// Express handlebars for rendering db content to dom
var expresshandlebars = require("express-handlebars");

// Morgan for logging
var logger = require("morgan");

// Mongoose for object modeling
var mongoose = require("mongoose");

// Axios & Cheerio for scraping
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.engine('.handlebars', expresshandlebars({defaultLayout: 'pageContainer', extname: '.handlebars'}));
app.set('view engine', '.handlebars');

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articleCollection";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
app.get("/scrape", function (req, res) {
	
	// Grabbing the body of the html with axios
	axios.get("https://www.nytimes.com/section/science").then(function (response) {
		// Then, load that into cheerio and save it to $ for a shorthand selector
		const $ = cheerio.load(response.data);

		let scrapedData = [];

		// Grab every an article in the ol li list, and do the following:
		$("#stream-panel ol li").each(function (i, element) {
			// Save an empty result object
			var result = {};

			// Add the title, summary, image and href of every article, and save them as properties of the result object
			result.title = $(this).find(".e1xfvim30").text();
			result.summary = $(this).find(".e1xfvim31").text();
			result.image = $(this).find(".css-79elbk").children("img").attr("src");
			result.link = $(this).find(".css-4jyr1y").children("a").attr("href");

			// Create a new Article using the `result` object built from scraping
			db.Article.create(result)
				.then(function (dbArticle) {
					// View the added result in the console
					console.log(dbArticle);
				})
				.catch(function (err) {
					// If an error occurred, log it
					console.log(err);
				});
			});

		// Send a message to the client
		res.render('', {data: scrapedData});
	});
});

app.get("/articles", function (req, res) {
	db.Article.find({})
	.then(function (dbArticle) {		   
		res.render('saved', {data: dbArticle})
	})
	.catch(function (err) {
		// If an error occurred, send it to the client
		console.log(err);
	});
});
  
// Route for getting all Articles from the db
app.post("/save", function (req, res) {
	// console.log(req.body)
	db.Article.create(req.body)
	.then(function (dbArticle) {
		// If we were able to successfully find Articles, send them back to the client
		console.log(dbArticle)
	})
	.catch(function (err) {
		// If an error occurred, send it to the client
		console.log(err);
	});
});
  
app.put("/delete", function (req, res) {
	// console.log(req.body.id)
	db.Article.remove({_id:req.body.id})
	.then(function (dbArticle) {
		// If we were able to successfully find Articles, send them back to the client
		console.log(dbArticle)
	}).catch(function (err) {
		// If an error occurred, send it to the client
		console.log(err);
	});
});
  
app.delete("/delete-all", function (req, res) {
	db.Article.remove({})
	.then(function (dbArticle) {
		// If we were able to successfully find Articles, send them back to the client
		console.log("All Deleted")
	}).catch(function (err) {
		// If an error occurred, send it to the client
		console.log(err);
	});
});
  
app.put("/delete-note", function (req, res) {
	console.log(req.body.id)
  	db.Note.remove({_id:req.body.id})
	.then(function (dbNote) {
		// If we were able to successfully find Articles, send them back to the client
		console.log(dbNote)
	}).catch(function (err) {
		// If an error occurred, send it to the client
		console.log(err);
	});
});
  
app.post("/new-note", function (req, res) {
	// console.log({'title': req.body.title, 'body': req.body.body}, req.body.artId)
	db.Note.create({'title': req.body.title, 'body': req.body.body})
	.then(function (dbNote) {
		// If we were able to successfully find Articles, send them back to the client
		console.log(req.body.artId)
		return db.Article.findOneAndUpdate({ _id: req.body.artId }, { $push: { note: dbNote._id }}, { new: true });
	}).then(function(dbArticle){
		console.log(dbArticle)
	}).catch(function (err) {
		// If an error occurred, send it to the client
		console.log(err);
	});
});
  
app.get("/article-notes/:id", function(req, res) {
	// console.log(req.params.id)
	db.Article.findOne({ _id: req.params.id })
	.populate("note")
	.then(function(dbArticle) {
		// If we were able to successfully find an Article with the given id, send it back to the client
  		console.log(dbArticle)
		res.render('listing', {data: dbArticle})
	}).catch(function(err) {
		// If an error occurred, send it to the client
		res.json(err);
	});
});
  
app.listen(PORT, function () {
	console.log("App running on port " + PORT + "!");
});  