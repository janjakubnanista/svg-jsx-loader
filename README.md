# svg-jsx-loader

[Webpack](http://webpack.github.io/) loader that allows you to load your SVG files as [React](http://facebook.github.io/react/) components.

[![Build Status](https://travis-ci.org/janjakubnanista/svg-jsx-loader.svg?branch=master)](https://travis-ci.org/janjakubnanista/svg-jsx-loader)

## Installation

    npm install svg-jsx-loader

## Usage

This loader outputs a React component. To use it for all of your `.svg` files you need to include it in your webpack [module.loaders](http://webpack.github.io/docs/configuration.html#module-loaders) configuration as follows.

	loaders: [
    	{ test: /\.svg$/, loaders: ['babel?presets[]=react', 'svg-jsx'] }
    ]

To use it for individual files: 

	var MyComponent = require('babel?presets[]=react!svg-jsx!../svg/my_component.svg');
	
**In both cases `babel` with `react` preset is required to transpile resulting JSX.**

## Options

Besides options that are passed to underlying [`svg-to-jsx` module](https://github.com/janjakubnanista/svg-to-jsx) `svg-jsx-loader` supports a few options itself:

<a name="es6"></a> `es6` *{Boolean}* Use ES6 compatible JavaScript syntax for component class. Defaults to `false`.

`displayName` *{String}* `displayName` of generated class. Defaults to `null`.

## Acknowledgements

This module was inspired by [react-svg-loader](https://github.com/boopathi/react-svg-loader).
