const test = require('ava');
const plugin = require('../');
const readFile = require('fs').readFile;
// const tempWrite = require('temp-write');
// const del = require('del');
// const pathExists = require('path-exists');
const posthtml = require('posthtml');

function read(path) {
	return new Promise((resolve, reject) => {
		readFile(path, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			}
			return resolve(data);
		});
	});
}

test('Plugin return array', t => {
	t.true(Array.isArray(plugin()));
});

test('Plugin reads custom json config from posthtml.json', async t => {
	t.is(
		(await read('expected/output-config-pkg.html')),
		(await posthtml(plugin('fixtures/posthtml.json')).process(await read('fixtures/input.html'))).html
	);
});
