var tinylr = require('tiny-lr');

'use strict';

module.exports = function (grunt) {
    var server;
    var changedFile;

    grunt.registerMultiTask('tinylr-start', 'Start the tiny livereload server', function () {
        var done = this.async();

        var options = this.options({
            port: 35729
        });

        grunt.event.on('watch', function(action, filepath) {
            changedFile = filepath;
        });

        server = tinylr();
        grunt.log.writeln('... Starting server on ' + options.port + ' ...');
        server.listen(options.port, done);
    });

    grunt.registerTask('tinylr-reload', 'Sends a reload notification to the livereload server, based on `watchFiles.changed`', function () {
        if (!server) return;

        server.changed({
            body: {
                files: changedFile
            }
        });
    });

    function changed() {
        if (grunt.file.watchFiles) return grunt.file.watchFiles.changed;

        var watch = grunt.config('watch');

        var files = Object.keys(watch).filter(function (target) {
            var tasks = watch[target].tasks;
            if (!tasks) return false;
            return ~tasks.indexOf('reload');
        }).reduce(function (list, target) {
            return list.concat(watch[target].files || []);
        }, []);

        files = grunt.file.expandFiles(files).filter(ignore('node_modules'));

        // stat compare
        var stats = changed.stats = changed.stats || {};

        var current = files.map(function (filepath) {
            var stat = fs.statSync(filepath);
            stat.file = filepath;
            return stat;
        }).reduce(function (o, stat) {
            o[stat.file] = stat.mtime.getTime();
            return o;
        }, {});


        files = Object.keys(current).filter(function (file) {
            if (!stats[file]) return true;
            return stats[file] !== current[file];
        });


        changed.stats = current;
        return files;
    }


    // filter helper
    function ignore(pattern) {
        return function (item) {
            return !~item.indexOf(pattern);
        }
    }
};
