
[![npm version][npm]][npm-url]
[![Dependencies][deps]][deps-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][cover-image]][cover-url]
[![XO Code Style][style]][style-url]

# Autoload Plugins for [PostHTML](https://github.com/posthtml/posthtml)

## Install

```bash
(sudo) npm i -D posthtml-load-plugins
```
## Usage

Plugins will be loaded directly from your projects ***package.json*** file or local installed plugins.  
Install them as usual with ``` npm i -S ``` or ``` npm i -D ``` or ```npm i```.

[PostHTML Plugins](https://maltsev.github.io/posthtml-plugins/)

After installing your plugins there a three ways to declare your plugin options.

- Set options directly as arguments.
- Set options in your ***package.json***.
- Create a separated ***[name].[ext]*** file, where ***[name]*** is any name you like and ***[ext]*** should be either ``` .js ``` or ``` .json ```.
For an example of well formed options file see below.
- For plugins not having rules installed locally will be used default settings.

## Options

### package.json

```json
{
 "dependencies": {
	 "posthtml-bem": "^0.2.2",
	 "posthtml-each": "^1.0.1",
	 "posthtml-include": "^1.0.2"
 },
 "devDependencies": {
	 "posthtml-style-to-file": "^0.1.1"
 },
 "posthtml": {
	 "bem": {
		 "elemPrefix": "__",
		 "modPrefix": "-",
		 "modDlmtr": "--"
	 },
	 "include": {
		 "root": "./",
		 "encoding": "utf-8"
	 },
	 "styleToFile": {
		 "path": "./dist/style.css"
	 }
 }
}
```

### [name].[ext]

#### JS
```js
module.exports = {
	bem: {
		elemPrefix: '__',
		modPrefix: '-',
		modDlmtr: '--'
	},
	include: {
		root: './',
		encoding: 'utf-8'
	},
	styleToFile: {
		path: './dist/style.css'
	}
}
```
#### JSON

```json
{
	"bem": {
		"elemPrefix": "__",
		"modPrefix": "-",
		"modDlmtr": "--"
	},
	"include": {
		"root": "./",
		"encoding": "utf-8"
	},
	"styleToFile": {
		"path": "./dist/style.css"
	}
}
```

## Usage
For general usage and build process integration see [PostHTML Docs](https://github.com/posthtml/posthtml#usage)

### Examples using Node API
#### Default

```js
'use strict'

const fs = require('fs')

const posthtml = require('posthtml')
const plugins = require('posthtml-load-plugins')()

let html = fs.readFileSync('./index.html', 'utf8')

posthtml(plugins)
	.process(html)
	.then(result => console.log(result.html))
```

#### Options file (e.g posthtml.json)

```js
'use strict'

const fs = require('fs')

const posthtml = require('posthtml')
const plugins = require('posthtml-load-plugins')('posthtml.(js|json)')

let html = fs.readFileSync('./index.html', 'utf8')

posthtml(plugins)
	.process(html)
	.then(result => console.log(result.html))
```

#### Extends options

```js
'use strict'

const fs = require('fs')

const posthtml = require('posthtml')
const plugins = require('posthtml-load-plugins')('posthtml.(js|json)', {"posthtml-bem": {elemPrefix: '__'}})

let html = fs.readFileSync('./index.html', 'utf8')

posthtml(plugins)
	.process(html)
	.then(result => console.log(result.html))
```

## Contributors

[![GitScrum](https://avatars.githubusercontent.com/u/2789192?s=130)](https://github.com/GitScrum) |
---|
[Ivan Demidov](https://github.com/GitScrum) |

## License

MIT

[npm]:  https://img.shields.io/npm/v/posthtml-load-plugins.svg
[npm-url]: https://www.npmjs.com/package/posthtml-load-plugins

[deps]: https://david-dm.org/michael-ciniawsky/posthtml-load-plugins.svg
[deps-url]: https://david-dm.org/michael-ciniawsky/posthtml-load-plugins

[style]: https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[style-url]: https://github.com/michael-ciniawsky/posthtml-load-plugins

[travis-url]: https://travis-ci.org/michael-ciniawsky/posthtml-load-plugins
[travis-image]: http://img.shields.io/travis/michael-ciniawsky/posthtml-load-plugins.svg

[cover-image]:https://coveralls.io/repos/github/michael-ciniawsky/posthtml-load-plugins/badge.svg?branch=master
[cover-url]:https://coveralls.io/github/michael-ciniawsky/posthtml-load-plugins?branch=master
