/**
  * The App module, containing the application logic.
  *
  * @module app
  *
  */
var server = null;
const args = require('./args');
const Git = require('nodegit');

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
					server.locals.path = path;
					server.locals.repository = repository;

					var port = process.env.PORT || 3000;
					express.listen(port, () => {
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
		var repository = server.locals.repository;
		repository.head().then(reference => {
			console.log(reference.toString());
			response.send(reference.toString());
		})
    } catch (error) {
        showError(error, response, next);
    }
};


/**
  * Handles the rendering of an error.
  *
  * @private
  * @param request The Express Request object.
  * @param response The Express Response object.
  * @param next The Express Next object.
  * @return void
  *
  */
function showError(error, response, next) {
    console.error(error);

    try {
        var model = {
            error: error
        };
        // view.render('error', model, response, next);
    } catch (e) {
        console.error(e);
        next(e);
    }
}
