# Autoload plugins for [PostHTML](https://github.com/posthtml/posthtml)

## Install

```bash
(sudo) npm i -D posthtml-load-plugins
```

## Usage

Plugins will be loaded directly from your projects ***package.json*** file.
Install them as usual with ``` npm i -S ``` or ``` npm i -D ```.
After installing your plugins there a two ways to declare your plugin options.
You can either set your options directly in your package.json or create a separated ***[name].[ext]*** file, where ***[name]*** is any name you like and ***[ext]*** should be either be ``` .js ``` or ``` .json ```. For well formed options file see below.

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
For general usage and build process integration see [PostTML Docs](https://github.com/posthtml/posthtml#usage)

### Example using Node API
#### Default

```js
'use strict'

const fs = require('fs')

const posthtml = require('posthtml')
const plugins = require('posthtml-load-plugins')(/* options */)

let html = fs.readFileSync('./index.html', 'utf-8')

posthtml(plugins)
  .process(html)
  .then(result => console.log(result.html))
```

#### Options file (e.g posthtml.json)

```js
'use strict'

const fs = require('fs')

const posthtml = require('posthtml')
const plugins = require('posthtml-load-plugins')('posthtml.json')

let html = fs.readFileSync('./index.html', 'utf-8')

posthtml(plugins)
  .process(html)
  .then(result => console.log(result.html))
```
