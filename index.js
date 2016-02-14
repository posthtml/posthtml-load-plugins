// ------------------------------------
// #POST - LOAD PLUGINS
// ------------------------------------

'use strict'

exports = module.exports = function (options) {
  if (typeof options === 'string') {
    options = require(`${process.cwd() + '/' + options}`)
  } else {
    options = options || {}
  }

  var pkg = require(`${process.cwd() + '/package.json'}`)

  function Processor (plugin, options) {
    function namespace (plugin) {
      let namespace = plugin
        .slice(9)
        .replace(/-(\w)/g, (match) => {
          return match.replace(/-/, '').toUpperCase()
        })
      return `${namespace}`
    }

    function defaults (plugin) {
      if (pkg.posthtml.plugin) {
        return pkg.posthtml.plugin
      } else {
        return {}
      }
    }

    return {
      plugin: require(`${plugin}`),
      namespace: namespace(plugin),
      defaults: defaults(options)
    }
  }

  function isPlugin (element, index, array) {
    return element.match(/posthtml/)
  }

  var processors = []

  Object.keys(pkg.dependencies).filter(isPlugin).forEach((plugin) => {
    processors.push(new Processor(plugin))
  })

  Object.keys(pkg.devDependencies).filter(isPlugin).forEach((plugin) => {
    processors.push(new Processor(plugin))
  })

  var plugins = []

  // each plugin
  processors.forEach((processor) => {
    var namespaceOptions = processor.namespace in options ? options[processor.namespace] : options
    var processorOptions = {}

    Object.keys(processor.defaults).forEach((key) => {
      processorOptions[key] = processor.defaults[key]
    })

    Object.keys(namespaceOptions).forEach((key) => {
      processorOptions[key] = namespaceOptions[key]
    })

    if (namespaceOptions && !processorOptions.disable) {
      plugins.push(processor.plugin(processorOptions))
    }
  })
  console.log(plugins)
  return plugins
}
