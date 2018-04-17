'use strict';

require('mocha');

var expect = require('expect.js');
var utils = require('./utils');
var loader = require('../index.js');

/* global describe, it */
describe('svg-jsx-loader', function() {
    it('should use displayName query parameter when set to string value', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('simplest');

        executor.query = '?displayName=MyComponent';

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    displayName: "MyComponent",\n' +
                '    render: function() {\n' +
                '        return (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" {...this.props}>\n\t<text fontFamily="Verdana" fontSize="55" x="250" y="150">Hello, out there</text>\n</svg>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });

    it('should use displayName query parameter when set to null value', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('simplest');

        executor.query = '?displayName=null';

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    displayName: null,\n' +
                '    render: function() {\n' +
                '        return (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" {...this.props}>\n\t<text fontFamily="Verdana" fontSize="55" x="250" y="150">Hello, out there</text>\n</svg>);\n' +
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
                'import React from \'react\';\n\n' +
                'export default class inputFilename extends React.Component {\n' +
                '    render() {\n' +
                '        return (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" {...this.props}>\n\t<text fontFamily="Verdana" fontSize="55" x="250" y="150">Hello, out there</text>\n</svg>);\n' +
                '    }\n' +
                '};\n\n' +
                'inputFilename.displayName = "inputFilename";\n'
            );

            done();
        });
    });

    it('should use displayName for class name with ES6', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('simplest');

        executor.query = '?es6=true&displayName=myComponent';

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'import React from \'react\';\n\n' +
                'export default class myComponent extends React.Component {\n' +
                '    render() {\n' +
                '        return (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" {...this.props}>\n\t<text fontFamily="Verdana" fontSize="55" x="250" y="150">Hello, out there</text>\n</svg>);\n' +
                '    }\n' +
                '};\n\n' +
                'myComponent.displayName = "myComponent";\n'
            );

            done();
        });
    });

    it('should pass passProps option to underlying convertor', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('simplest');

        executor.query = '?passProps=false';

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    displayName: "inputFilename",\n' +
                '    render: function() {\n' +
                '        return (<svg version="1.1" xmlns="http://www.w3.org/2000/svg">\n\t<text fontFamily="Verdana" fontSize="55" x="250" y="150">Hello, out there</text>\n</svg>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });

    it('should pass root option to underlying convertor', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('root');

        executor.query = '?root=root';

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    displayName: "inputFilename",\n' +
                '    render: function() {\n' +
                '        return (<text id="root" {...this.props}/>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });

    it('should pass refs option to underlying convertor', function(done) {
        var executor = new utils.Executor(loader);
        var input = utils.input('root');

        executor.query = '?{refs:{root:"myRef"}}';

        executor.execute(input, function(error, output) {
            expect(error).to.be(null);
            expect(output).to.be(
                'var React = require(\'react\');\n\n' +
                'module.exports = React.createClass({\n' +
                '    displayName: "inputFilename",\n' +
                '    render: function() {\n' +
                '        return (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" {...this.props}>\n\t<text id="root" ref="myRef"/>\n</svg>);\n' +
                '    }\n});\n'
            );

            done();
        });
    });
});
