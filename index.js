'use strict';

var loaderUtils = require('loader-utils');
var parseString = require('xml2js').parseString;
var xmlbuilder = require('xmlbuilder');
var fs = require('fs');
var path = require('path');
var assign = require('object-assign');
var utils = require('./utils');

function replaceUseTags(element, root) {
    if (!element.$$) return element;

    element.$$ = element.$$.map(function(child) {
        var tagName = child['#name'];
        if (tagName === 'use') {
            var link = child.$['xlink:href'] || '';
            var id = link.replace(/^#/, '');
            var replacement = utils.findTagById(id, root);

            if (replacement) {
                replacement = assign({}, replacement);

                replacement.$ && delete replacement.$.id;
            }

            return replacement || child;
        }

        return replaceUseTags(child, root || element);
    });

    return element;
}

function normalizeElement(element, options) {
    var wrapper = {};
    var tagName = element['#name'];
    var textContext = element._;

    if (options.replaceUseTags) {
        element = replaceUseTags(element);
    }

    // Normalize all the children
    var children = element.$$ && element.$$
        .filter(utils.isTagAllowed)
        .map(normalizeElement);

    // Prefix all attributes with @ for xmlbuilder
    var attributes = Object.keys(utils.normalizeAttributes(element.$ || {}))
        .reduce(function(hash, name) {
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
        attrNameProcessors: [utils.camelCase]
    }, callback);
}

function buildSVG(object) {
    return xmlbuilder
        .create(object, { headless: true })
        .end({ pretty: true, indent: '\t', newline: '\n' });
}

function buildJSX(svg) {
    return svg
        // Style attribute has to be treated differently
        // See https://facebook.github.io/react/tips/inline-styles.html
        .replace(/style="(.*?)"/g, function(match, styleString) {
            return 'style={' + utils.styleAttribute(styleString) + '}';
        })
        .replace(/^<svg/, '<svg {...this.props}');
}

function buildComponent(svg, options) {
    var type = options.es6 ? 'es6' : 'es5';
    var name = options.displayName || null;
    var templateFilename = path.resolve(__dirname, 'templates', type) + '.js.tpl';
    var template = fs.readFileSync(templateFilename).toString('utf8');

    return template.replace('{SVG}', svg).replace('{NAME}', JSON.stringify(name));
}

module.exports = function svgJsxLoader(source) {
    this.cacheable();

    var callback = this.async();
    var options = loaderUtils.parseQuery(this.query);
    var fileName = path.basename(this.resourcePath, '.svg');
    var className = utils.className(fileName);

    options.displayName = 'displayName' in options ? options.displayName : className;

    parseSVG(source, function(error, result) {
        if (error) return callback(error);

        var normalized = normalizeElement(result, options);

        var svg = buildSVG(normalized);
        var jsx = buildJSX(svg);
        var component = buildComponent(jsx, options);

        callback(null, component);
    });
};
