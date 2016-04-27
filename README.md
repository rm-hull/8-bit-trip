# 8-bit Trip

_8-bit Trip_ is a node.js port of [sound-flour](https://github.com/rm-hull/sound-flour)
deployed onto a [zeit.co/now](https://zeit.co/now#) instance.

## Build

[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coverage-badge]][coverage-url]
[![Dependency Status][david-badge]][david-url]

Run locally with:

    $ npm install
    $ gulp build
    $ node dist/app.js

This will start an express app on http://localhost:3000.

## Usage

Anything after the base URL is treated as an equation; the only bound variable is _t_, to represent a instant in time.
_t_ only ever increments, and should be used as follows in a browser:

http://localhost:3000/(t>>6|t|t>>(t>>16))*10+((t>>11)&7))

or the zeit server:

## License

### The MIT License (MIT)

Copyright (c) 2016 Richard Hull

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[travis-badge]: https://api.travis-ci.org/rm-hull/8-bit-trip.svg
[travis-url]: https://travis-ci.org/rm-hull/8-bit-trip
[david-badge]: https://david-dm.org/rm-hull/8-bit-trip.svg
[david-url]: https://david-dm.org/rm-hull/8-bit-trip
[coverage-badge]: https://coveralls.io/repos/rm-hull/8-bit-trip/badge.svg?branch=master
[coverage-url]: https://coveralls.io/r/rm-hull/8-bit-trip?branch=master)
