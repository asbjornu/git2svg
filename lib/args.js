module.exports = {
    validate : function () {
        return new Promise((fulfill, reject) => {
            var yargs = require('yargs')
              .usage('Usage: $0 [path]')
              .epilog(`Asbjørn Ulsberg © ${new Date().getFullYear()}`)
              .check((arguments, y) => {
                  if (!arguments._ || !Array.isArray(arguments._) || arguments._.length != 1) {
                      throw 'Error: "path" argument missing';
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
