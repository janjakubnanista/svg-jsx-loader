# svg-jsx-loader

[Webpack](http://webpack.github.io/) loader that allows you to load your SVG files as [React](http://facebook.github.io/react/) components.

[![Build Status](https://travis-ci.org/janjakubnanista/svg-jsx-loader.svg?branch=master)](https://travis-ci.org/janjakubnanista/svg-jsx-loader)

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

<a name="es6"></a> `es6` *{Boolean}* Use ES6 compatible JavaScript syntax for component class. Defaults to `false`.

`displayName` *{String}* `displayName` of generated class. Defaults to `null`.

`replaceUseTags` *{Boolean}* Replace `<use/>` tags with referenced elements. Element that is referenced by `<use/>` tag's `xlink:href` attribute is looked up, it's `id`
is discarded and it replaces the original `<use/>` tag. This is useful when exporting from Illustrator. Defaults to `false`.

Suppose you have an SVG file with following structure:

	<polygon id="mask-path" points="497,129 537.1,135.3 494.4,215.8"/>
    <clipPath id="mask">
        <use xlink:href="#mask-path" overflow="visible"/>
    </clipPath>
    <g id="group" clip-path="url(#mask)">
    	<!-- Group contents -->
    </g>

Then of course React won't support `<use/>` tags and you end up unmasked `#group`. By trading off the resulting component size you can set `replaceUseTags` to `true` and end up with follwoing structure which is supported by React:

	<polygon id="mask-path" points="497,129 537.1,135.3 494.4,215.8"/>
    <clipPath id="mask">
    	<polygon points="497,129 537.1,135.3 494.4,215.8"/>
    </clipPath>
    <g id="group" clip-path="url(#mask)">
    	<!-- Group contents -->
    </g>

## Acknowledgements

This module was inspired by [react-svg-loader](https://github.com/boopathi/react-svg-loader).
