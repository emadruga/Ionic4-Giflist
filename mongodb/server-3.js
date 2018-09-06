// Set up
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
 
// Configuration
mongoose.connect('mongodb://localhost/hotels');
 
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());
 
// Models
var Room = mongoose.model('Room', {
    nome_completo:  String,
    data_nasc:      String,
    rg_identidade:  String,
    cpf:	    String,
    sexo:	    String,
    email:	    String,
    cidade:	    String,
    cep:	    String,
    telefone:	    String,
    deficiencia:    String,
    cotista:        String  
});
 
/*
 * Generate some test data, if no records exist already
 * MAKE SURE TO REMOVE THIS IN PROD ENVIRONMENT
*/
 
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
Room.remove({}, function(res){
    console.log("removed records");
});
 
Room.count({}, function(err, count){
    console.log("Rooms: " + count);
 
});
 
// Routes
 
app.post('/api/person', function(req, res) {
 
    Room.find({ cpf: reg.body.cpf }, function(err, rooms){
        if(err){
            res.send(err);
        } else {
            res.json(rooms);
        }
    });   
});

   app.post('/api/rooms/insert', function(req, res) {
 
       console.log("Inserting: " + req.body.cpf );

       var newPerson = new Room({
 	   nome_completo:  req.body.nome_completo,
	   /* data_nasc:      req.body.data_nasc, */
	   rg_identidade:  req.body.rg_identidade, 
	   cpf:	           req.body.cpf,
	   sexo:	   req.body.sexo,	    
	   email:	   req.body.email,	    
	   cidade:	   req.body.cidade,	    
	   cep:	           req.body.cep,	    
	   telefone:	   req.body.telefone,	    
	   deficiencia:    req.body.deficiencia,    
	   cotista:        req.body.cotista         
       });
       
       newPerson.save(function(err, doc){
	   if (err) {
	       console.log("Server Insert Error: " + err);
	       res.send(err);
	   }
	       
           console.log("Created person: " + doc.cpf);
	   res.json(doc);
       });
 
    });

    app.post('/api/rooms/reserve', function(req, res) {
 
        console.log("Server: " + req.body.cpf);

	var from_str = "2018-09-15";
	var to_str   = "2018-09-25";
 
        Room.findByIdAndUpdate(req.body.cpf, {
            $push: {"reserved": {from: from_str, to: to_str}}
        }, {
            safe: true,
            new: true
        }, function(err, room){
            if(err){
                res.send(err);
            } else {
                res.json(room);
            }
        });
 
    });
 
// listen
app.listen(8080);
console.log("App listening on port 8080");
