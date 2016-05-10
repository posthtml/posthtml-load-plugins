// ------------------------------------
// #POST - LOAD PLUGINS
// ------------------------------------

'use strict';
var path = require('path');
var appRoot = require('app-root-path');
var pathExists = require('path-exists');

function namespace(plugin) {
	return plugin
		.slice(9)
		.replace(/[_.-](\w|$)/g, function (_, x) {
			return x.toUpperCase();
		});
}

function Processor(plugin) {
	return {
		plugin: require(plugin),
		namespace: namespace(plugin),
		defaults: {}
	};
}

function isPlugin(element) {
	return element.match(/posthtml-[\w]/);
}

function isNotMe(element) {
	return /posthtml-(?!load-plugins)/.test(element);
}

exports = module.exports = function (opt, ext) {
	var pkg = require(appRoot + '/package.json');

	if (typeof opt === 'string' && pathExists(path.join(process.cwd(), opt))) {
		opt = require(path.join(process.cwd(), opt));
	} else {
		opt = opt || pkg.posthtml || {};
	}

	for (var plugin in ext) {
		if (ext.hasOwnProperty(plugin)) {
			opt[namespace(plugin)] = ext[plugin];
		}
	}

	var processors = [];

	Object.keys(Object.assign({}, ext, pkg.dependencies, pkg.devDependencies))
		.sort(function (a, b) {
			if (/posthtml-include/.test(b)) {
				return 1;
			}
			return 0;
		})
		.filter(isPlugin)
		.filter(isNotMe)
		.forEach(function (plugin) {
			processors.push(new Processor(plugin));
		});

	var plugins = [];

	processors.forEach(function (processor) {
		var namespaceOptions = processor.namespace in opt ? opt[processor.namespace] : opt;
		var processorOptions = {};

		if (typeof namespaceOptions === 'object') {
			Object.keys(namespaceOptions).forEach(function (key) {
				processorOptions[key] = namespaceOptions[key];
			});
		}

		if (typeof namespaceOptions === 'string') {
			processorOptions = namespaceOptions;
		}

		if (namespaceOptions && !processorOptions.disable) {
			plugins.push(processor.plugin(processorOptions));
		}
	});

	return plugins;
};
