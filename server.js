var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pets');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var PetSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 3},
    stars: {type: String, required:false},
    review: {type: String, required:false, minlenth: 3},
    completed: { type: Boolean, default: false },
    username: { type: String, required:false, minlength: 3},
}, {timestamps: true});

mongoose.model('Pet', PetSchema);

var Pet = mongoose.model('Pet');

app.use(bodyParser.json());

app.use(express.static( __dirname + '/public/dist' ));

var path = require('path');



// Get ALL
app.get('/pets/', function(req, res) {
    var pet = Pet.find({}, function(err, task) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            res.json({data: task});
        }
    });
});
// Get ONE
app.get('/pets/:pet/', function(req, res) {
    console.log('made it to show route');
    var pet = Pet.findOne({_id: req.params.pet}, function (err, task) {
        if (err) {
            console.log('error in show');
        }
        else {
            console.log('successful');
            res.json({data: task});
        }
    });
});
// Create ONE
app.post('/pets/', function(req, res) {
    console.log('made it to create route');
    var pet = new Pet(req.body);
    pet.save(function(err) {
        if (err) {
            console.log('error in creation');
        }
        else {
            console.log('successful');
            res.redirect('/');
        }
    });
});
// Update ONE
app.put('/pets/:pet/', function(req, res) {
    console.log('made it to update route',req.params.pet);
    Pet.findByIdAndUpdate(req.params.pet, req.body, function(err, pet) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            console.log('successful');
            res.redirect('/');
        }
    });
});
// Delete ONE
app.delete('/pets/:pet/', function(req, res) {
    console.log(req.params.id);
    Pet.findByIdAndRemove(req.params.pet, function(err, pet) {
        if (err) {
            console.log('error in delete');
        }
        else {
            console.log('successful');
            res.json({message:"success"});
        }
    });
});
app.post('/write/:pet', function(req, res) {
    console.log('made it to review route');
    Pet.findByIdAndUpdate(req.params.pet, req.body, function(err, pet) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            console.log('successful review save');
            res.redirect('/');
        }
    });
});

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/index.html"))
  });


app.listen(8000, function() {
    console.log("listening on port 8000");
});