/**
 * Copyright (c) 2010 Zef Hemel <zef@zef.me>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {
  'use strict';

  var argspec,
      toString = Function.prototype.call.bind(Object.prototype.toString);

  argspec = function (args, specs) {
    var argument, argumentSpec, max,
        argumentIndex = 0,
        specIndex = 0,
        argObj = {};

    for (max = specs.length; specIndex < max; specIndex += 1) {
      argumentSpec = specs[specIndex];
      argument = args[argumentIndex];

      if (argumentSpec.optional) {
        if (argument !== undefined && argumentSpec.check(argument)) {
          argObj[argumentSpec.name] = argument;
          argumentIndex += 1;
        } else if(argumentSpec.defaultValue) {
          argObj[argumentSpec.name] = argumentSpec.defaultValue;
        }
      } else {
        if (argumentSpec.check && !argumentSpec.check(argument)) {
          throw new TypeError('Invalid value for argument: ' + argumentSpec.name + ' Value: ' + argument);
        }

        argObj[argumentSpec.name] = argument;
        argumentIndex += 1;
      }
    }
    return argObj;
  };

  argspec.hasProperty = function (name) {
    return function(obj) {
      return obj[name] !== undefined;
    };
  };

  argspec.hasType = function (type) {
    return function(obj) {
      return toString(obj).split(' ')[1].slice(0, -1).toLowerCase() === type;
    };
  };

  argspec.isTypeof = function (type) {
    return function(obj) {
      return obj.constructor.name === type;
    };
  };

  argspec.isCallback = function () {
    return function(obj) {
      return obj && obj.apply;
    };
  };

  if (typeof module !== 'undefined' && 'exports' in module) {
    module.exports = argspec;
  } else if (typeof window !== undefined) {
    window.argspec = argspec;
  }
}());
