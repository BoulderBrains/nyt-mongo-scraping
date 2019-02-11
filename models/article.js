var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	// Will allow me to populate an associated note for an article
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

// Creates the model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;