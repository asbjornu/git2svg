/**
  * The App module, containing the application logic.
  *
  * @module app
  *
  */
var server = null;
const args = require('./args');
const Git = require('nodegit');
const path = require('path');

/**
  * Starts the web application.
  *
  * @export start
  * @param express The Express server object.
  * @return void
  *
  */
module.exports.start = express => {
    server = express;

	args.validate()
	    .then(args => {
			var path = args.path;
			Git.Repository
				.open(path)
				.then(repository => {
					const http = require('http').Server(server);
					const io = require('socket.io')(http);

					io.on('connection', socket => {
  						console.log('a user connected');
					});

					server.locals.io = io;
					server.locals.path = path;
					server.locals.repository = repository;

					var port = process.env.PORT || 3000;
					http.listen(port, () => {
						console.log(`Watching '${path}' on http://localhost:${port}`);
					});
				});
		});
};


/**
  * Handles the rendering of the index page.
  *
  * @export showIndex
  * @param request The Express Request object.
  * @param response The Express Response object.
  * @param next The Express Next object.
  * @return void
  *
  */
module.exports.showIndex = (request, response, next) => {
    try {
		response.sendFile(path.join(__dirname, '/views/index.html'));
    } catch (error) {
		next(error);
    }
};
