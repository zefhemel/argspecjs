argspec.js
==========
`argspec.js` is a simple optional argument handling library for
Javascript.

The problem
-----------

Javascript has no great way of dealing with optional arguments, unless
they are optional arguments at the end of the argument list:

    function myFun(a, b, optC) {
      if(optC === undefined) optC = 0;

      ...
    }

    myFun(1, 2, 3);
    myFun(1, 2); // optC will be 0

But what if you require optional arguments in the beginning of the
argument list? In the following example `session` and `tx` are both
optional arguments, but `callback` is required. Dealing with that is
annoying, as the example shows:

    function list(session, tx, callback) {
      if(session.call) { // check if first arg is callback function -> first two args were left out
        callback = session;
        tx = null;
        session = null;
      } else if(session.executeSql) { // check if first arg is transaction object -> first arg was left out
        callback = tx; 
        tx = session;
        session = null;
      }

      ...
    }

Eww.

The solution
------------

`argspec.js` offers a declarative way of dealing with optional arguments:

    function list(session, tx, callback) {
      var args = argspec.getArgs(arguments, [
        { name: 'session', optional: true, check: argspec.hasProperty('closeConn') },
        { name: 'tx', optional: true, check: argspec.hasProperty('executeSql') },
        { name: 'callback', optional: false, check: argspec.isCallback() }
      ]);
      session = args.session;
      tx = args.tx;
      callback = args.callback;

      ...
    }

The `argspec.getArgs(args, spec)` methods has two arguments:

* `args`
  An Javascript argument list (typically `arguments`, the built-in Javascript argument list)
* `spec`
  An array of objects, defining each of the arguments. Each object has the following properties:
  * `name`: defines the argument name, is used as the name of the
    argument in the object regurned by the `getArgs(..)` function.
  * `optional` (optional): defines whether the argument is optional (`true`) or not (`false`), default is `false`.
  * `check` (optional for required arguments): a function that will be passed the argument value and will check if it fits all the requirements. You can pass any function here, `argspec.js` comes with a number of utilty check-function producing functions:
      * `hasProperty(propname)`: checks if the object has the given property or not
      * `hasType(typeStr)`: checks if the object has the given type (as given by `typeof obj`)
      * `isCallback()`: checks if the object is callable
  * `defaultValue` (optional): a default value, if the argument is left out

The object returned by `getArgs(..)` has a property for each argument.

Note that you can use `argspec.js` to do declarative argument value validation, even if you do not require optional arguments:

    function addNums(a, b) {
      var args = getArgs(arguments, [
        { name: 'a', check: argspec.hasType('number') },
        { name: 'b', check: argspec.hasType('number') }
      ]);
      return args.a + args.b; // or return a + b; would also be fine in this case
    }

Users
-----

The `argspec.js` library is used (and included in) the
[persistence.js](http://github.com/zefhemel/persistencejs) Javascript
ORM library.
