'use strict';

var loaderUtils = require('loader-utils');
var svgtojsx = require('svg-to-jsx');
var fs = require('fs');
var path = require('path');
var assign = require('object-assign');
var utils = require('./utils');

function buildComponent(svg, options) {
    var type = options.es6 ? 'es6' : 'es5';
    var templateFilename = path.resolve(__dirname, 'templates', type) + '.js.tpl';
    var template = fs.readFileSync(templateFilename).toString('utf8');

    return template
        .replace(/{SVG}/g, svg)
        .replace(/{DISPLAYNAME}/g, JSON.stringify(options.displayName))
        .replace(/{CLASSNAME}/g, options.displayName);
}

module.exports = function svgJsxLoader(source) {
    this.cacheable();

    var callback = this.async();
    var options = loaderUtils.parseQuery(this.query);
    var fileName = path.basename(this.resourcePath, '.svg');
    var displayName = utils.camelCase(fileName);

    options = assign({}, {
        passProps: true,
        root: null,
        refs: null,
        displayName: displayName
    }, options);

    svgtojsx(source, options, function(error, result) {
        if (error) return callback(error);

        var component = buildComponent(result, options);

        callback(null, component);
    });
};
