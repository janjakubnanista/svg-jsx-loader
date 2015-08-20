# svg-jsx-loader

[Webpack](http://webpack.github.io/) loader that allows you to load your SVG files as [React](http://facebook.github.io/react/) components.

## Installation

    npm install svg-jsx-loader

## Usage

This loader outputs a React component. To use it for all of your `.svg` files you need to include it in your webpack [module.loaders](http://webpack.github.io/docs/configuration.html#module-loaders) configuration as follows.

	loaders: [
    	{ test: /\.svg$/, loaders: ['svg-jsx'] }
    ]

To use it for individual files:

	var MyComponent = require('svg-jsx!../svg/my_component.svg');

In case you are using [ES6](#es6) variant, you have to chain a transpiler after this loader. I personally prefer [babel](https://babeljs.io/):

    loaders: [
    	{ test: /\.svg$/, loaders: ['babel', 'svg-jsx?es6=true'] }
    ]

## Options

<a name="es6"></a> `es6` Use ES6 compatible JavaScript syntax. Defaults to `false`.

`replaceUseTags` Replace `<use/>` tags with referenced elements. Element that is referenced by `<use/>` tag's `xlink:href` attribute is looked up, it's `id`
is discarded and it replaces the original `<use/>` tag. This is useful when exporting from Illustrator.

## Acknowledgements

This module was inspired by [react-svg-loader](https://github.com/boopathi/react-svg-loader).
