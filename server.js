/**
 * Showing with the Express framwork http://expressjs.com/
 * Express must be installed for this sample to work
 */

var tropoapi = require('tropo-webapi');
var express = require('express');
var app = express.createServer(); 

/**
 * Required to process the HTTP body
 * req.body has the Object while req.rawBody has the JSON string
 */
app.configure(function(){
	app.use(express.bodyParser());
    app.use(express.static("./"));
});

app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/', function(req, res){
	// Create a new instance of the TropoWebAPI object.
	var tropo = new tropoapi.TropoWebAPI();
	// Use the say method https://www.tropo.com/docs/webapi/say.htm
	tropo.say("Welcome to the Tropo voice dial tone application.");

	// Demonstrates how to use the base Tropo action classes.
	var say = {"value":"Please say or enter a 10 digit phone number you would like to call."};
	// var choices = new tropo.Choices("[5 DIGITS]");
	var choices = {"value":"[10 DIGITS]"};

	// Action classes can be passes as parameters to TropoWebAPI class methods.
	// use the ask method https://www.tropo.com/docs/webapi/ask.htm
	tropo.ask(choices, 3, true, null, "foo", null, true, say, 5, null);
	// use the on method https://www.tropo.com/docs/webapi/on.htm
	tropo.on("continue", null, "/answer", true);

	console.log(tropoapi.TropoJSON(tropo));

    res.send(tropoapi.TropoJSON(tropo));
});

app.post('/answer', function(req, res){
	// Create a new instance of the TropoWebAPI object.
	var tropo = new tropoapi.TropoWebAPI();
	try {
		tropo.say("transferring call to " + req.body['result']['actions']['interpretation'] + " now.");
		tropo.transfer("+1" + req.body['result']['actions']['interpretation'], {
				network: "VOICE" 
			});		
	}
	catch(err) {
		tropo.say("no phone number received");
	}
	res.send(tropoapi.TropoJSON(tropo));
});

app.listen(8000);
// console.log('Server running on http://0.0.0.0:8000/')

