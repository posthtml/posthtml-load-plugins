'use strict'

const fs = require('fs')

var posthtml = require('posthtml')

var plugins = require('../index')('posthtml.js')

var html = fs.readFileSync('./index.html', 'utf-8')

posthtml(plugins)
  .process(html)
  .then(result => console.log(result.html))
