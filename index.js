// ------------------------------------
// #POST - LOAD PLUGINS
// ------------------------------------

'use strict';
const path = require('path');

exports = module.exports = function (options) {
	var pkg = require(path.join(process.env.pwd, 'package.json'));

	if (typeof options === 'string') {
		options = require(path.join(process.cwd(), options));
	} else {
		options = options || pkg.posthtml || {};
	}

	function Processor(plugin) {
		function namespace(plugin) {
			let namespace = plugin
			.slice(9)
			.replace(/-(\w)/g, (match) => {
				return match.replace(/-/, '').toUpperCase();
			});
			return `${namespace}`;
		}

		return {
			plugin: require(`${plugin}`),
			namespace: namespace(plugin),
			defaults: {}
		};
	}

	function isPlugin(element) {
		return element.match(/posthtml-[\w]/);
	}

	function isInclude(element) {
		return element.match(/posthtml-[include]/);
	}

	function notInclude(element) {
		return element.match(/posthtml-[^include]/);
	}

	function isNotMe(element) {
		return element.match(/posthtml-[^load-plugins]/);
	}

	var processors = [];

	Object.keys(pkg.dependencies).filter(isNotMe).filter(isPlugin).filter(isInclude).forEach((plugin) => {
		processors.unshift(new Processor(plugin));
	});

	Object.keys(pkg.dependencies).filter(isNotMe).filter(isPlugin).filter(notInclude).forEach((plugin) => {
		processors.push(new Processor(plugin));
	});

	Object.keys(pkg.devDependencies).filter(isNotMe).filter(isPlugin).filter(isInclude).forEach((plugin) => {
		processors.unshift(new Processor(plugin));
	});

	Object.keys(pkg.devDependencies).filter(isNotMe).filter(isPlugin).filter(notInclude).forEach((plugin) => {
		processors.push(new Processor(plugin));
	});

	var plugins = [];

	processors.forEach((processor) => {
		var namespaceOptions = processor.namespace in options ? options[processor.namespace] : options;
		var processorOptions = {};

		Object.keys(processor.defaults).forEach((key) => {
			processorOptions[key] = processor.defaults[key];
		});

		Object.keys(namespaceOptions).forEach((key) => {
			processorOptions[key] = namespaceOptions[key];
		});

		if (namespaceOptions && !processorOptions.disable) {
			plugins.push(processor.plugin(processorOptions));
		}
	});

	return plugins;
};
