var express = require('express');
var app = express();
// Set the port to be used by this server.
app.set('port', (process.env.PORT || 5000));
// Serve up public folder
app.use(express.static('PokeScraperWeb'));
// Listen on the port
app.listen(app.get('port'), function() {
 console.log("Node app is running at localhost:" + app.get('port'))
 })