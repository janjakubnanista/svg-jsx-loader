'use strict';

var fs = require('fs');
var path = require('path');
var loaderPath = path.resolve(__dirname, '../index.js');

exports.webpackConfig = function(input) {
    return {
        entry: ['babel', loaderPath, path.resolve(__dirname, 'input/' + input + '.svg')].join('!'),
        output: { path: path.resolve(__dirname, 'output'), filename: 'output.js', libraryTarget: 'commonjs2' }
    };
};

exports.input = function(input) {
    var filename = path.resolve(__dirname, 'input/' + input + '.svg');

    return fs.readFileSync(filename).toString('utf8');
};

exports.Executor = function(loader) {
    this.loader = loader;
};

exports.Executor.prototype.execute = function(input, callback) {
    this.__callback = callback;

    return this.loader(input);
};

exports.Executor.prototype.cacheable = function() {};

exports.Executor.prototype.async = function() {
    return this.__callback;
};
