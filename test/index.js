'use strict';

const fs = require('fs');

var posthtml = require('posthtml');

var plugins = require('../index')('test/posthtml.json');

var html = fs.readFileSync('test/index.html', 'utf-8');

posthtml(plugins)
	.process(html)
	.then(result => console.log(result.html));
