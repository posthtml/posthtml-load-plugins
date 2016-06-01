import {resolve} from 'path';
import appRoot from 'app-root-path';
import pathExists from 'path-exists';
const {dependencies, devDependencies, posthtml} = require(`${appRoot}/package.json`);

function exclude(plugins) {
	return /^posthtml-[\w]/.test(plugins);
}

function isNotMe(plugin) {
	return /posthtml-(?!load-plugins)/.test(plugin);
}
function getName(plugin) {
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
		Object.keys(
			Object.assign({}, dependencies, devDependencies)
		)
		.filter(exclude)
		.filter(isNotMe)
		.map(getName)
		.reduce((previousValue, currentValue) => Object.assign(previousValue, {[currentValue]: {}}), {}),
		posthtml,
		options.reduce((previousValue, currentValue) => {
			if (isFile(currentValue)) {
				currentValue = require(resolve(currentValue));
			}

			if (Array.isArray(currentValue)) {
				currentValue = currentValue.reduce((previousValue, currentValue) => Object.assign(previousValue, currentValue), {});
			}

			return Object.assign(previousValue, currentValue);
		}, {})
	);
};
