var Mongoose = require('./database').Mongoose;
var Schema = Mongoose.Schema;

var File = Mongoose.model('file', new Schema({
	name: String
}));

exports.File = File;  