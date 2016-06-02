// ------------------------------------
// #POST - LOAD PLUGINS
// ------------------------------------

'use strict';
import prepareConfig from './prepare-config.js';

function toKebabCase(plugin) {
	return plugin.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function getModuleName(plugin) {
	return `posthtml-${toKebabCase(plugin)}`;
}

function processor(plugin) {
	return require(getModuleName(plugin));
}

export default (opt, ext) => {
	const config = prepareConfig(opt, ext);

	return Object.keys(config)
		.map(plugin => processor(plugin)(config[plugin]));
};
