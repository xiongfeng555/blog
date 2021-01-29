var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
var Schema = mongoose.Schema;

var info = new Schema({
    id: {
        type: Number
    },
    title: {
        type: String,
        required: true
    },
    TYPE: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Info', info)