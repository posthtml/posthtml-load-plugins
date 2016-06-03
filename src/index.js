import sequence from 'posthtml-standard-sequence';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import table from 'text-table';
import prepareConfig from './prepare-config.js';

function toKebabCase(plugin) {
	return plugin.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function getModuleName(plugin) {
	return `posthtml-${toKebabCase(plugin)}`;
}

function processor(plugin, warning) {
	try {
		return require(getModuleName(plugin));
	} catch (e) {
		warning.push([logSymbols.error, `posthtml-${plugin}`]);
		return () => {};
	}
}

export default (opt, ext) => {
	let warning = [];
	const config = sequence(prepareConfig(opt, ext));
	const plugins = Object.keys(config)
		.map(plugin => processor(plugin, warning)(config[plugin]))
		.filter((plugin) => plugin !== undefined);

	if (warning.length) {
		console.log(`  ${logSymbols.warning} ${chalk.yellow('warning'.toUpperCase())} plugins is not installed`);
		console.log(`    ${table(warning)}`);
	}

	return plugins;
};
