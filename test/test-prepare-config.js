import test from 'ava';
import generator from '../src/prepare-config.js';

test('should retrun object', t => {
	t.true(typeof generator() === 'object');
	t.false(Array.isArray(generator()));
});

test('should return object witch five params from package.json', t => {
	const expected = {
		bem: {
			elemPrefix: '__',
			modPrefix: '--',
			modDlmtr: '-'
		},
		each: {},
		include: {},
		modules: {},
		styleToFile: {
			path: './dist/css/'
		}
	};

	t.deepEqual(expected, generator());
});

test('should return object witch three params from package.json and not down', t => {
	const expected = {
		bem: {
			elemPrefix: '__',
			modPrefix: '--',
			modDlmtr: '-'
		},
		each: {},
		include: {},
		modules: {},
		styleToFile: {
			path: './dist/css/'
		}
	};

	t.deepEqual(expected, generator(undefined));
});

test('should return with advanced settings from options', t => {
	const expected = {
		bem: {
			elemPrefix: '__',
			modPrefix: '--',
			modDlmtr: '-'
		},
		each: {},
		include: {},
		modules: {},
		styleToFile: {
			path: 'dist/style.css'
		}
	};
	const options = {
		styleToFile: {
			path: 'dist/style.css'
		}
	};

	t.deepEqual(expected, generator(options));
});

test('should return with advanced settings from array options', t => {
	const expected = {
		include: {
			encoding: 'utf-8'
		},
		bem: {
			elemPrefix: '__',
			modPrefix: '--',
			modDlmtr: '-'
		},
		each: {},
		modules: {},
		styleToFile: {
			path: 'dist/style.css'
		}
	};
	const options = [{
		styleToFile: {
			path: 'dist/style.css'
		}
	}, {
		include: {
			encoding: 'utf-8'
		}
	}];

	t.deepEqual(expected, generator(options));
});

test('should return with advanced settings from array options and second file options', t => {
	const expected = {
		bem: {
			elemPrefix: '__',
			modPrefix: '-',
			modDlmtr: '--'
		},
		each: {},
		modules: {},
		styleToFile: {
			path: './dist/style.css'
		},
		include: {
			root: './',
			encoding: 'window-1251'
		}
	};
	const options = [{
		styleToFile: {
			path: 'dist/style.css'
		}
	}, {
		include: {
			encoding: 'utf-8'
		}
	}];

	t.deepEqual(expected, generator(options, 'fixtures/posthtml.js'));
});

test('should return with advanced settings from files', t => {
	const expected = {
		bem: {
			elemPrefix: '__',
			modPrefix: '-',
			modDlmtr: '--'
		},
		each: {},
		modules: {},
		styleToFile: {
			path: 'dist/style.css'
		},
		include: {
			root: 'test/',
			encoding: 'utf-8'
		}
	};
	const options = 'fixtures/posthtml.json';

	t.deepEqual(expected, generator(options));
});
