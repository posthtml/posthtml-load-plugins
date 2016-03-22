// ------------------------------------
// #POST - LOAD PLUGINS
// ------------------------------------

'use strict';
var path = require('path');

module.exports = function (options) {
	var pkg = require(path.join((process.env.PWD || path.dirname(require.main.filename)), 'package.json'));

	if (typeof options === 'string') {
		options = require(path.join(process.cwd(), options));
	} else {
		options = options || pkg.posthtml || {};
	}

	function Processor(plugin) {
		function namespace(plugin) {
			return plugin
				.slice(9)
				.replace(/[_.-](\w|$)/g, function (_, x) {
					return x.toUpperCase();
				});
		}

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

	var processors = [];

	Object.keys(Object.assign({}, pkg.dependencies, pkg.devDependencies))
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

	processors.forEach((processor) => {
		var namespaceOptions = processor.namespace in options ? options[processor.namespace] : options;
		var processorOptions = {};

		Object.keys(processor.defaults).forEach(function (key) {
			processorOptions[key] = processor.defaults[key];
		});

		Object.keys(namespaceOptions).forEach(function (key) {
			processorOptions[key] = namespaceOptions[key];
		});

		if (namespaceOptions && !processorOptions.disable) {
			plugins.push(processor.plugin(processorOptions));
		}
	});

	return plugins;
};
