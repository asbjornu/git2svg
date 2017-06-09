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
const fs = require('fs');

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
					const gitFolder = repository.path();

					io.on('connection', socket => {
  						console.log('Browser connected through socket.io');
						refresh('connected');
					});

					fs.watch(gitFolder, { recursive: true }, refresh);

					server.locals.io = io;
					server.locals.path = path;
					server.locals.repository = repository;

					var port = process.env.PORT || 3000;
					http.listen(port, () => {
						console.log(`Watching <${gitFolder}> on <http://localhost:${port}/>`);
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


function refresh(event, filename) {
	console.log(`${event}: Loading data from the Git repository.`);
	var repository = server.locals.repository;

	var getCommitData = commit => {
		var sha = commit.sha();
		var author = commit.author().toString();
		var committer = commit.committer().toString();
		var message = commit.message();
		var body = commit.body();
		var time = commit.timeMs();
		return {
			sha: sha,
			author: author,
			committer: committer,
			message: message,
			body: body,
			time: time
		};
	};

	repository.getHeadCommit().then(headCommit => {
		var oid = headCommit.id();
		repository.createRevWalk(oid).walk(oid, (x, c) => {
			if (!c) {
				return;
			}

			var commit = getCommitData(c);
			server.locals.io.emit('commit', commit);
		});
	}).catch(error => {
		console.error(error);
	})
}
