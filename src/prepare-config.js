import {resolve} from 'path';
import appRoot from 'app-root-path';
import pathExists from 'path-exists';
import blackList from './black-list';

const {dependencies, devDependencies, posthtml} = require(`${appRoot}/package.json`);
const exclude = plugins => /^posthtml-[\w]/.test(plugins);
const inBlackList = plugin => !blackList.includes(plugin);

/* function isNotMe(plugin) {
	return /posthtml-(?!load-plugins)/.test(plugin);
}

function isSequence(plugin) {
	return /posthtml-(?!standard-sequence)/.test(plugin);
}

function isConfig(plugin) {
	return /posthtml-(?!standard-config)/.test(plugin);
}

function isCLI(plugin) {
	return /posthtml-(?!cli)/.test(plugin);
} */

function toSnakeCase(plugin) {
	return plugin
		.slice(9)
		.replace(/[_.-](\w|$)/g, (match, parameter) => parameter.toUpperCase());
}

function isFile(string) {
	return typeof string === 'string' && pathExists.sync(resolve(string));
}

export default (...options) => {
	return Object.assign(
		{},
		Object.keys(Object.assign({}, dependencies, devDependencies))
			.filter(exclude)
			.filter(inBlackList)
			.map(toSnakeCase)
			.reduce((previousValue, currentValue) => Object.assign(previousValue, {[currentValue]: {}}), {}),
		posthtml,
		options.reduce((previousValue, currentValue) => {
			if (isFile(currentValue)) {
				currentValue = require(resolve(currentValue));
			}

			if (Array.isArray(currentValue)) {
				currentValue = currentValue.reduce((previousValue, currentValue) => Object.assign(previousValue, currentValue), {});
			}

			if (Array.isArray(currentValue) === false && isFile(currentValue) === false && currentValue !== undefined) {
				currentValue = Object.keys(currentValue)
					.map(plugin => (exclude(plugin) ? {[toSnakeCase(plugin)]: currentValue[plugin]} : {[plugin]: currentValue[plugin]}))
					.reduce((previousValue, currentValue) => Object.assign(previousValue, currentValue), {});
			}

			return Object.assign(previousValue, currentValue);
		}, {})
	);
};
