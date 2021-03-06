module.exports = {
    validate : function () {
        return new Promise((fulfill, reject) => {
            var yargs = require('yargs')
              .usage('\nUsage: npm start -- [repository_path]')
              .epilog(`Asbjørn Ulsberg © ${new Date().getFullYear()}`)
              .check((arguments, y) => {
                  if (!arguments._ || !Array.isArray(arguments._) || arguments._.length != 1 || arguments._[0] === `${arguments.$0}.js`) {
                      throw 'Error: "repository_path" argument missing or invalid';
                  }

                  return true;
              })
              .help();

            var arguments = yargs.argv;

            return fulfill({
                path: arguments._[0]
            });
        });
    }
}
