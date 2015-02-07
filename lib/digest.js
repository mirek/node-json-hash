"use strict";

// Compute digest for JSON object.
exports.digest = digest;
function digest(a) {
  var _ref = arguments[1] === undefined ? {} : arguments[1];
  var _ref$algorithm = _ref.algorithm;
  var algorithm = _ref$algorithm === undefined ? "sha1" : _ref$algorithm;
  var _ref$inputEncoding = _ref.inputEncoding;
  var inputEncoding = _ref$inputEncoding === undefined ? "utf8" : _ref$inputEncoding;
  var _ref$outputEncoding = _ref.outputEncoding;
  var outputEncoding = _ref$outputEncoding === undefined ? "hex" : _ref$outputEncoding;
  var crypto = _ref.crypto;
  var h = crypto.createHash(algorithm);
  var u = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return h.update(args.join(":"), inputEncoding);
  };
  var d = function (a) {
    return digest(a, { algorithm: algorithm, inputEncoding: inputEncoding, outputEncoding: outputEncoding, crypto: crypto });
  };
  switch (true) {

    // undefined
    case typeof a === "undefined":
      u("u");
      break;

    // null
    case a === null:
      u("n");
      break;

    // boolean
    case typeof a === "boolean":
    case a instanceof Boolean:
      u("f", a.valueOf());
      break;

    // number
    case typeof a === "number":
    case a instanceof Number:
      u("i", "" + a);
      break;

    // string
    case typeof a === "string":
    case a instanceof String:
      u("s", "" + a);
      break;

    // symbol
    case typeof a === "symbol":
    case a instanceof Symbol:
      u("S", "" + a);
      break;

    // date
    case a instanceof Date:
      u("d", a.toISOString());
      break;

    // regexp
    case a instanceof RegExp:
      u("x", "" + a);
      break;

    // function
    case a instanceof Function:
      u("F", a.toString());
      break;

    // array
    case Array.isArray(a):
      u("[");
      a.forEach(function (e) {
        return u("a", d(e));
      });
      u("]");
      break;

    // object
    default:
      u("{");
      Object.keys(a).sort().forEach(function (k) {
        return u("k", d(k), "v", d(a[k]));
      });
      u("}");
      break;
  }
  return h.digest(outputEncoding);
}
exports.__esModule = true;
//# sourceMappingURL=digest.js.map