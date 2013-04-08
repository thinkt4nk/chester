var fs = require('fs');

/**
 * Enumerates a target path, returning the filepaths all desired files.
 *	The callback gets a list of filepaths
 *
 * @param {string} path The path to enumerate
 * @param {object} [options] The runtime options
 *				> [RegExp] match A regular expression to match for inclusion
 * @param {function} cb Callback
 * @return {void}
 */
function enumerate_target(path, options, cb) {
	cb = cb || function(files) { return files; }
	if ('function' === typeof options) {
		cb = options;
		options = {};
	}
	var stats = fs.statSync(path),
		files = [];
	if (stats.isDirectory()) {
		var contents = fs.readdirSync(path);
		contents.forEach(function(child_path) {
			var files_to_add = enumerate_target([path, child_path].join('/'), options);
			files = files.concat(files_to_add);
		});
	}
	else {
		if (options != null && options.match != null && !options.match.test(path)) {
			return [];
		}
		files = [path];
	}
	return cb(files);
}
module.exports = {
	enumerate: enumerate_target,
	search: enumerate_target
}
