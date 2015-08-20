'use strict';

require('mocha');

var expect = require('expect.js');
var utils = require('./utils');
var loader = require('../index.js');

/* global describe, it */
describe('svg-jsx-loader', function() {
    it('should convert attributes to camelCase', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('simplest');

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    render: function() {\n' +
                '        return (<svg {...this.props} version="1.1">\n\t<polygon fill="#C0272D" points="497,129 537.1,135.3 494.4,215.8"/>\n\t<text fontFamily="Verdana" fontSize="55" x="250" y="150">Hello, out there</text>\n</svg>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });

    it('should discard unsupported tags', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('not_allowed_tags');

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    render: function() {\n' +
                '        return (<svg {...this.props} version="1.1"/>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });

    it('should discard unsupported attributes', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('not_allowed_attributes');

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    render: function() {\n' +
                '        return (<svg {...this.props} version="1.1">\n\t<polygon fill="#C0272D" points="497,129 537.1,135.3 494.4,215.8"/>\n</svg>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });

    it('should rename class attribute to className', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('className');

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    render: function() {\n' +
                '        return (<svg {...this.props} version="1.1">\n\t<polygon className="class"/>\n</svg>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });

    it('should convert style attribute', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('styles');

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    render: function() {\n' +
                '        return (<svg {...this.props} version="1.1">\n\t<text style={{"fontFamily":"Verdana","fontSize":"25px"}} x="250" y="150">Hello, out there</text>\n</svg>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });

    it('should use ES6 template if es6 query option is truthy', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('simplest');

        executor.query = '?es6=true';

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'import { Component } from \'react\';\n\n' +
                'export default class extends Component {\n' +
                '    render() {\n' +
                '        return (<svg {...this.props} version="1.1">\n\t<polygon fill="#C0272D" points="497,129 537.1,135.3 494.4,215.8"/>\n\t<text fontFamily="Verdana" fontSize="55" x="250" y="150">Hello, out there</text>\n</svg>);\n' +
                '    }\n' +
                '};\n'
            );

            done();
        });
    });

    it('should convert use tags when replaceUseTags option is truthy', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('use');

        executor.query = '?replaceUseTags=true';

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    render: function() {\n' +
                '        return (<svg version="1.1">\n\t<polygon id="Glue_mask" points="497,129 537.1,135.3 494.4,215.8"/>\n\t<clippath id="path">\n\t\t<polygon id="Glue_mask" points="497,129 537.1,135.3 494.4,215.8"/>\n\t</clippath>\n</svg>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });

    it('should not convert use tags when replaceUseTags option is falsy', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('use');

        executor.query = '?replaceUseTags=false';

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    render: function() {\n' +
                '        return (<svg version="1.1">\n\t<polygon id="Glue_mask" points="497,129 537.1,135.3 494.4,215.8"/>\n\t<clippath id="path"/>\n</svg>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });
});
