'use strict';

var loaderUtils = require('loader-utils');
var parseString = require('xml2js').parseString;
var xmlbuilder = require('xmlbuilder');
var fs = require('fs');
var path = require('path');
var utils = require('./utils');

// Passed to xml2js parser as a validator option
// It is executed for every tag and normalizes its attributes
function xml2jsValidator(xpath, c, element) {
    element.$ = utils.normalizeAttributes(element.$ || {});

    return element;
}

function normalizeElement(element) {
    var wrapper = {};
    var tagName = element['#name'];
    var textContext = element._;

    // Normalize all the children
    var children = element.$$ && element.$$.filter(utils.isTagAllowed).map(normalizeElement);

    // Prefix all attributes with @ for xmlbuilder
    var attributes = Object.keys(element.$ || {}).reduce(function(hash, name) {
        hash['@' + name] = element.$[name];

        return hash;
    }, {});

    if (textContext) attributes['#text'] = textContext;
    if (children && children.length) attributes['#list'] = children;

    // Nest root element under tag name
    wrapper[tagName] = attributes;

    return wrapper;
}

function parseSVG(string, callback) {
    parseString(string, {
        explicitArray: true,
        explicitChildren: true,
        explicitRoot: false,
        mergeAttrs: false,
        normalize: true,
        normalizeTags: true,
        preserveChildrenOrder: true,
        attrNameProcessors: [utils.camelCase],
        validator: xml2jsValidator
    }, callback);
}

function buildSVG(object) {
    return xmlbuilder
        .create(object, { headless: true })
        .end({ pretty: true, indent: '\t', newline: '\n' });
}

function buildJSX(svg) {
    // Style attribute has to be treated differently
    // See https://facebook.github.io/react/tips/inline-styles.html
    return svg.replace(/style="(.*?)"/g, function(match, styleString) {
        return 'style={' + utils.styleAttribute(styleString) + '}';
    });
}

function buildComponent(svg, es6) {
    var type = es6 ? 'es6' : 'es5';
    var templateFilename = path.resolve(__dirname, 'templates', type) + '.js.tpl';
    var template = fs.readFileSync(templateFilename).toString('utf8');

    return template.replace('{SVG}', svg);
}

module.exports = function svgJsxLoader(source) {
    this.cacheable();

    var callback = this.async();
    var options = loaderUtils.parseQuery(this.query);

    parseSVG(source, function(error, result) {
        if (error) return callback(error);

        var normalized = normalizeElement(result);
        var svg = buildSVG(normalized);
        var jsx = buildJSX(svg);
        var component = buildComponent(jsx, options.es6);

        callback(null, component);
    });
};
