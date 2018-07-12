var app = require('./backend/server');
var ChatServer = require('./backend/websocket/chat-server');
var Bundler = require('parcel-bundler');

const bundlerinstance = new Bundler('./app/index.html', {});
app.use(bundlerinstance.middleware());

var port = 1234;

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

new ChatServer(server);